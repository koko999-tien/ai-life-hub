import type { AIProvider, AIRequest, WorkspaceModelOption } from '../types';
import { WORKSPACE_LIMITS } from '../rate-limiter';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiProvider implements AIProvider {
  readonly id = 'google' as const;
  readonly label = 'Google Gemini API';

  private getApiKey(): string {
    return (process.env.GEMINI_API_KEY || '').trim();
  }

  isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  getModels(): WorkspaceModelOption[] {
    if (!this.isConfigured()) return [];
    return [
      {
        id: 'google:gemini-flash-latest',
        label: 'Google Gemini Flash (Nhanh & Khuyên dùng)',
        providerId: 'google',
        providerLabel: 'Google AI',
        apiModelId: 'gemini-flash-latest',
        registryModelId: 'gemini-2-5-flash',
        recommendedFor: 'Viết email, tóm tắt họp & phân tích tài liệu tốc độ cao',
      },
      {
        id: 'google:gemini-flash-lite-latest',
        label: 'Google Gemini Flash-Lite (Siêu nhanh)',
        providerId: 'google',
        providerLabel: 'Google AI',
        apiModelId: 'gemini-flash-lite-latest',
        registryModelId: 'gemini-2-5-flash-lite',
        recommendedFor: 'Biên tập ngắn & rút gọn tức thì',
      },
      {
        id: 'google:gemini-pro-latest',
        label: 'Google Gemini Pro (Phân tích chuyên sâu)',
        providerId: 'google',
        providerLabel: 'Google AI',
        apiModelId: 'gemini-pro-latest',
        registryModelId: 'gemini-2-5-pro',
        recommendedFor: 'Tài liệu dài phức tạp & suy luận nhiều bước (yêu cầu hạn mức gói Pro)',
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
      throw new Error('Máy chủ chưa cấu hình khóa GEMINI_API_KEY.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WORKSPACE_LIMITS.PROVIDER_TIMEOUT_MS);

    if (req.signal) {
      req.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    const buildBody = () =>
      JSON.stringify({
        systemInstruction: {
          parts: [{ text: req.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: req.userPrompt }],
          },
        ],
        generationConfig: {
          temperature: req.temperature ?? 0.4,
          maxOutputTokens: Math.min(
            req.maxOutputTokens ?? WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS,
            WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS
          ),
        },
      });

    try {
      // Chỉ gọi đúng model đã yêu cầu, một lần duy nhất — không fallback
      // lặng lẽ sang model khác khi model này lỗi 404/503.
      const response = await fetch(
        `${GEMINI_BASE_URL}/${req.modelOption.apiModelId}:streamGenerateContent?alt=sse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: buildBody(),
          signal: controller.signal,
        }
      );

      if (!response || !response.ok || !response.body) {
        if (response?.status === 429) {
          throw new Error(
            'Hạn mức gọi mô hình này đang tạm đầy (HTTP 429). Vui lòng thử lại sau ít giây hoặc chuyển sang mô hình Flash / nhà cung cấp khác ở cột bên phải.'
          );
        }
        if (response?.status === 404) {
          throw new Error(
            `Mô hình ${req.modelOption.apiModelId} không tồn tại (HTTP 404). Vui lòng chọn mô hình khác.`
          );
        }
        throw new Error(
          `Dịch vụ Google Gemini phản hồi lỗi HTTP ${response?.status ?? 503}. Vui lòng thử lại sau.`
        );
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
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const parts = parsed?.candidates?.[0]?.content?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (typeof part?.text === 'string' && part.text.length > 0 && !part.thought) {
                  yield { type: 'text', delta: part.text };
                }
              }
            }
            const usageMeta = parsed?.usageMetadata;
            if (usageMeta) {
              yield {
                type: 'usage',
                inputTokens: usageMeta.promptTokenCount,
                outputTokens: usageMeta.candidatesTokenCount,
              };
            }
          } catch {
            // Skip partial JSON frames
          }
        }
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
