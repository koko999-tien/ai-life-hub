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

export const maxDuration = 60;

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
  // Không tin hoàn toàn phần tử đầu của x-forwarded-for vì client có thể
  // tự spoof. Ưu tiên x-vercel-forwarded-for (do Vercel đặt), nếu không thì
  // lấy phần tử CUỐI của x-forwarded-for — proxy đáng tin gần nhất.
  const vercelForwarded = req.headers.get('x-vercel-forwarded-for');
  if (vercelForwarded) {
    return vercelForwarded.split(',')[0].trim().slice(0, 64);
  }
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1].slice(0, 64);
    }
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
    // Phân biệt: model được yêu cầu nhưng không tồn tại (400) với
    // chưa cấu hình provider nào (503).
    if (modelId && workspaceProviderRegistry.getConfiguredProviders().length > 0) {
      return NextResponse.json(
        {
          code: 'MODEL_NOT_FOUND',
          message: `Không tìm thấy mô hình "${modelId}". Vui lòng chọn một mô hình khác trong danh sách.`,
        },
        { status: 400 }
      );
    }
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
              modelId: modelOption.id,
              modelLabel: modelOption.label,
              providerLabel: modelOption.providerLabel,
            })
          );
        }
      } catch (err) {
        if (!req.signal.aborted) {
          // Chỉ log chi tiết ở server, không passthrough message gốc cho client.
          const rawMessage = err instanceof Error ? err.message : '';
          const redacted = rawMessage.replace(
            /AIza[0-9A-Za-z\-_]+|sk-[0-9A-Za-z\-_]+/g,
            '[REDACTED]'
          );
          if (redacted) {
            console.error('[workspace/execute] Provider error:', redacted);
          }

          let code = 'PROVIDER_EXECUTION_ERROR';
          let message =
            'Nhà cung cấp AI tạm thời không phản hồi. Vui lòng thử lại hoặc đổi mô hình khác.';
          if (rawMessage.includes('429') || rawMessage.includes('hạn mức')) {
            code = 'PROVIDER_RATE_LIMITED';
            message =
              'Hạn mức gọi mô hình này đang tạm đầy. Vui lòng thử lại sau ít giây hoặc đổi mô hình khác.';
          } else if (
            rawMessage.includes('GEMINI_API_KEY') ||
            rawMessage.includes('cấu hình')
          ) {
            code = 'PROVIDER_NOT_CONFIGURED';
            message =
              'Máy chủ chưa được cấu hình khóa kết nối AI. Vui lòng liên hệ quản trị viên.';
          }

          controller.enqueue(
            encodeSseChunk({
              type: 'error',
              code,
              message,
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
