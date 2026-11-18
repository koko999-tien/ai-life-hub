import type { AIProvider, AIRequest, WorkspaceModelOption } from '../types';
import { WORKSPACE_LIMITS } from '../rate-limiter';

export class AnthropicProvider implements AIProvider {
  readonly id = 'anthropic' as const;
  readonly label = 'Anthropic Claude API';

  private getApiKey(): string {
    return (process.env.ANTHROPIC_API_KEY || '').trim();
  }

  isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  getModels(): WorkspaceModelOption[] {
    if (!this.isConfigured()) return [];
    return [
      {
        id: 'anthropic:claude-sonnet-4-6',
        label: 'Claude Sonnet 4.6 (Sắc sảo & Chuẩn mực)',
        providerId: 'anthropic',
        providerLabel: 'Anthropic',
        apiModelId: 'claude-sonnet-4-6',
        registryModelId: 'claude-sonnet-4-6',
        recommendedFor: 'Viết email trang trọng, phân tích tài liệu & lập trình',
      },
      {
        id: 'anthropic:claude-haiku-4-5',
        label: 'Claude Haiku 4.5 (Phản hồi tức thì)',
        providerId: 'anthropic',
        providerLabel: 'Anthropic',
        apiModelId: 'claude-haiku-4-5',
        registryModelId: 'claude-haiku-4-5',
        recommendedFor: 'Tóm tắt nhanh & trích xuất đầu việc',
      },
    ];
  }

  async *stream(
    req: AIRequest
  ): AsyncGenerator<
    { type: 'text'; delta: string } | { type: 'usage'; inputTokens?: number; outputTokens?: number },
    void,
    unknown
  > {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Máy chủ chưa cấu hình khóa ANTHROPIC_API_KEY.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WORKSPACE_LIMITS.PROVIDER_TIMEOUT_MS);

    if (req.signal) {
      req.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: req.modelOption.apiModelId,
          stream: true,
          max_tokens: Math.min(
            req.maxOutputTokens ?? WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS,
            WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS
          ),
          temperature: req.temperature ?? 0.4,
          system: req.systemPrompt,
          messages: [{ role: 'user', content: req.userPrompt }],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          throw new Error('Anthropic API đang giới hạn tần suất gọi (HTTP 429). Vui lòng thử lại sau ít giây.');
        }
        throw new Error(`Dịch vụ Anthropic phản hồi lỗi HTTP ${response.status}.`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed?.type === 'content_block_delta' && typeof parsed?.delta?.text === 'string') {
              yield { type: 'text', delta: parsed.delta.text };
            } else if (parsed?.type === 'message_start' && parsed?.message?.usage) {
              yield { type: 'usage', inputTokens: parsed.message.usage.input_tokens };
            } else if (parsed?.type === 'message_delta' && parsed?.usage) {
              yield { type: 'usage', outputTokens: parsed.usage.output_tokens };
            }
          } catch {
            // Skip partial frames
          }
        }
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
