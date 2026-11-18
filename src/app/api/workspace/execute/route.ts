import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { workspaceProviderRegistry } from '@/lib/ai/registry';
import { buildWorkflowPrompts } from '@/lib/ai/prompts';
import {
  checkRateLimit,
  computeUsageMetrics,
  WORKSPACE_LIMITS,
} from '@/lib/ai/rate-limiter';
import type { AIStreamChunk } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

const ExecuteRequestSchema = z.object({
  workflowId: z.enum([
    'email-assistant',
    'meeting-summary',
    'document-analysis',
    'custom-prompt',
  ]),
  modelId: z.string().max(120).optional(),
  temperature: z.number().min(0).max(1).optional(),
  inputs: z.record(z.string(), z.unknown()),
});

function extractClientKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim().slice(0, 64);
  }
  return 'local-client';
}

function encodeSseChunk(chunk: AIStreamChunk): Uint8Array {
  const payload = `data: ${JSON.stringify(chunk)}\n\n`;
  return new TextEncoder().encode(payload);
}

export async function POST(req: NextRequest) {
  // 1. Rate Limit Check
  const clientKey = extractClientKey(req);
  const rate = checkRateLimit(clientKey);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        code: 'RATE_LIMITED',
        message: `Bạn đã gửi quá nhiều yêu cầu liên tiếp. Vui lòng đợi ${rate.retryAfterSeconds} giây rồi thử lại.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rate.retryAfterSeconds),
        },
      }
    );
  }

  // 2. Parse & Validate JSON Body via Zod
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      {
        code: 'INVALID_JSON',
        message: 'Dữ liệu gửi lên không đúng định dạng JSON hợp lệ.',
      },
      { status: 400 }
    );
  }

  const parsed = ExecuteRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: 'VALIDATION_ERROR',
        message: 'Thông tin đầu vào chưa hợp lệ hoặc thiếu trường bắt buộc.',
      },
      { status: 400 }
    );
  }

  const { workflowId, modelId, temperature, inputs } = parsed.data;

  // 2.5 Explicit per-workflow non-empty payload check before building templates
  const rawPrimaryContent =
    workflowId === 'email-assistant'
      ? `${String(inputs.purpose || '').trim()} ${String(inputs.contextOrDraft || '').trim()}`.trim()
      : workflowId === 'meeting-summary'
      ? String(inputs.notesText || '').trim()
      : workflowId === 'document-analysis'
      ? String(inputs.documentText || '').trim()
      : String(inputs.promptText || '').trim();

  if (rawPrimaryContent.length < 3) {
    return NextResponse.json(
      {
        code: 'EMPTY_INPUT',
        message: 'Vui lòng nhập nội dung đầu vào cụ thể trước khi thực thi.',
      },
      { status: 400 }
    );
  }

  // 3. Build Workflow Prompts & Enforce Input Bounds
  const { systemPrompt, userPrompt } = buildWorkflowPrompts(workflowId, inputs);
  const combinedLength = systemPrompt.length + userPrompt.length;

  if (!userPrompt.trim() || userPrompt.trim().length < 5) {
    return NextResponse.json(
      {
        code: 'EMPTY_INPUT',
        message: 'Vui lòng nhập nội dung đầu vào cụ thể trước khi thực thi.',
      },
      { status: 400 }
    );
  }

  if (combinedLength > WORKSPACE_LIMITS.MAX_INPUT_CHARS) {
    return NextResponse.json(
      {
        code: 'INPUT_TOO_LARGE',
        message: `Nội dung đầu vào vượt quá giới hạn an toàn (${WORKSPACE_LIMITS.MAX_INPUT_CHARS.toLocaleString('vi-VN')} ký tự). Vui lòng chia nhỏ văn bản.`,
      },
      { status: 413 }
    );
  }

  // 4. Resolve Configured Server-Side Provider (Never fake responses when unconfigured!)
  const resolved = workspaceProviderRegistry.resolveModelAndProvider(modelId);
  if (!resolved) {
    return NextResponse.json(
      {
        code: 'AI_PROVIDER_NOT_CONFIGURED',
        message:
          'Máy chủ hiện chưa được cấu hình khóa kết nối AI (như GEMINI_API_KEY, OPENAI_API_KEY hoặc ANTHROPIC_API_KEY). Quản trị viên cần bổ sung biến môi trường trên máy chủ để bật thực thi trực tiếp.',
      },
      { status: 503 }
    );
  }

  const { provider, modelOption } = resolved;
  const startedAt = Date.now();

  // 5. Stream Real Provider Response Over SSE
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let accumulatedChars = 0;
      let reportedInputTokens: number | undefined;
      let reportedOutputTokens: number | undefined;

      try {
        for await (const event of provider.stream({
          systemPrompt,
          userPrompt,
          modelOption,
          temperature,
          maxOutputTokens: WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS,
          signal: req.signal,
        })) {
          if (req.signal.aborted) {
            break;
          }

          if (event.type === 'text') {
            accumulatedChars += event.delta.length;
            controller.enqueue(encodeSseChunk({ type: 'text', delta: event.delta }));
          } else if (event.type === 'usage') {
            if (typeof event.inputTokens === 'number') reportedInputTokens = event.inputTokens;
            if (typeof event.outputTokens === 'number') reportedOutputTokens = event.outputTokens;
          }
        }

        if (!req.signal.aborted) {
          const latencyMs = Date.now() - startedAt;
          const usage = computeUsageMetrics({
            registryModelId: modelOption.registryModelId,
            promptChars: combinedLength,
            outputChars: accumulatedChars,
            reportedInputTokens,
            reportedOutputTokens,
          });

          controller.enqueue(
            encodeSseChunk({
              type: 'done',
              latencyMs,
              usage,
              modelLabel: modelOption.label,
              providerLabel: modelOption.providerLabel,
            })
          );
        }
      } catch (err) {
        if (!req.signal.aborted) {
          const safeMessage =
            err instanceof Error && err.message
              ? err.message.replace(/AIza[0-9A-Za-z\-_]+|sk-[0-9A-Za-z\-_]+/g, '[REDACTED]')
              : 'Không thể hoàn tất yêu cầu từ nhà cung cấp AI. Vui lòng thử lại hoặc đổi mô hình khác.';

          controller.enqueue(
            encodeSseChunk({
              type: 'error',
              code: 'PROVIDER_EXECUTION_ERROR',
              message: safeMessage,
            })
          );
        }
      } finally {
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
