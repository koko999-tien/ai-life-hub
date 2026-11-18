import type { AIProvider, AIProviderId, AIRequest, WorkspaceModelOption } from '../types';
import { WORKSPACE_LIMITS } from '../rate-limiter';

interface OpenAICompatibleConfig {
  id: Extract<AIProviderId, 'openai' | 'deepseek' | 'openrouter'>;
  label: string;
  envVarName: 'OPENAI_API_KEY' | 'DEEPSEEK_API_KEY' | 'OPENROUTER_API_KEY';
  endpointUrl: string;
  models: WorkspaceModelOption[];
}

export class OpenAICompatibleProvider implements AIProvider {
  readonly id: AIProviderId;
  readonly label: string;
  private readonly config: OpenAICompatibleConfig;

  constructor(config: OpenAICompatibleConfig) {
    this.id = config.id;
    this.label = config.label;
    this.config = config;
  }

  private getApiKey(): string {
    return (process.env[this.config.envVarName] || '').trim();
  }

  isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  getModels(): WorkspaceModelOption[] {
    return this.isConfigured() ? this.config.models : [];
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
      throw new Error(`Máy chủ chưa cấu hình khóa cho ${this.label}.`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WORKSPACE_LIMITS.PROVIDER_TIMEOUT_MS);

    if (req.signal) {
      req.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      if (this.config.id === 'openrouter') {
        headers['HTTP-Referer'] = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-life-hub-omega.vercel.app';
        headers['X-Title'] = 'AI Life Hub Workspace';
      }

      const response = await fetch(this.config.endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: req.modelOption.apiModelId,
          stream: true,
          temperature: req.temperature ?? 0.4,
          max_tokens: Math.min(
            req.maxOutputTokens ?? WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS,
            WORKSPACE_LIMITS.MAX_OUTPUT_TOKENS
          ),
          messages: [
            { role: 'system', content: req.systemPrompt },
            { role: 'user', content: req.userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          throw new Error(`Nhà cung cấp ${this.label} đang giới hạn tần suất (HTTP 429). Vui lòng thử lại sau ít giây hoặc đổi mô hình.`);
        }
        throw new Error(`Dịch vụ ${this.label} phản hồi lỗi HTTP ${response.status}.`);
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
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === 'string' && delta.length > 0) {
              yield { type: 'text', delta };
            }
            if (parsed?.usage) {
              yield {
                type: 'usage',
                inputTokens: parsed.usage.prompt_tokens,
                outputTokens: parsed.usage.completion_tokens,
              };
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export function createOpenAIProvider(): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: 'openai',
    label: 'OpenAI API',
    envVarName: 'OPENAI_API_KEY',
    endpointUrl: 'https://api.openai.com/v1/chat/completions',
    models: [
      {
        id: 'openai:gpt-4.1-mini',
        label: 'OpenAI GPT-4.1 mini (Nhanh & Cân bằng)',
        providerId: 'openai',
        providerLabel: 'OpenAI',
        apiModelId: 'gpt-4.1-mini',
        registryModelId: 'gpt-4-1-mini',
        recommendedFor: 'Tác vụ văn phòng & phân tích tài liệu hằng ngày',
      },
      {
        id: 'openai:gpt-4.1',
        label: 'OpenAI GPT-4.1 (Chuẩn xác cao)',
        providerId: 'openai',
        providerLabel: 'OpenAI',
        apiModelId: 'gpt-4.1',
        registryModelId: 'gpt-4-1',
        recommendedFor: 'Bám sát chỉ dẫn phức tạp & tài liệu dài',
      },
    ],
  });
}

export function createDeepSeekProvider(): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: 'deepseek',
    label: 'DeepSeek API',
    envVarName: 'DEEPSEEK_API_KEY',
    endpointUrl: 'https://api.deepseek.com/chat/completions',
    models: [
      {
        id: 'deepseek:deepseek-chat',
        label: 'DeepSeek V3 (Tiết kiệm chi phí)',
        providerId: 'deepseek',
        providerLabel: 'DeepSeek',
        apiModelId: 'deepseek-chat',
        registryModelId: 'deepseek-v3',
        recommendedFor: 'Soạn thảo và tổng hợp văn bản tiếng Việt chi phí thấp',
      },
    ],
  });
}

export function createOpenRouterProvider(): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: 'openrouter',
    label: 'OpenRouter API',
    envVarName: 'OPENROUTER_API_KEY',
    endpointUrl: 'https://openrouter.ai/api/v1/chat/completions',
    models: [
      {
        id: 'openrouter:openai/gpt-4o-mini',
        label: 'GPT-4o mini (Qua OpenRouter)',
        providerId: 'openrouter',
        providerLabel: 'OpenRouter',
        apiModelId: 'openai/gpt-4o-mini',
        registryModelId: 'gpt-4o-mini',
        recommendedFor: 'Dự phòng đa nhà cung cấp tốc độ nhanh',
      },
      {
        id: 'openrouter:deepseek/deepseek-chat',
        label: 'DeepSeek V3 (Qua OpenRouter)',
        providerId: 'openrouter',
        providerLabel: 'OpenRouter',
        apiModelId: 'deepseek/deepseek-chat',
        registryModelId: 'deepseek-v3',
        recommendedFor: 'Biên tập & phân tích văn bản tiết kiệm',
      },
    ],
  });
}
