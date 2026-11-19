import type { AIProvider, WorkspaceModelOption, WorkspacePublicStatus } from './types';
import { GeminiProvider } from './providers/gemini';
import { AnthropicProvider } from './providers/anthropic';
import {
  createOpenAIProvider,
  createDeepSeekProvider,
  createOpenRouterProvider,
} from './providers/openai-compatible';
import { WORKSPACE_LIMITS } from './rate-limiter';

export class ProviderRegistry {
  private readonly providers: AIProvider[];

  constructor() {
    this.providers = [
      new GeminiProvider(),
      createOpenAIProvider(),
      new AnthropicProvider(),
      createDeepSeekProvider(),
      createOpenRouterProvider(),
    ];
  }

  getConfiguredProviders(): AIProvider[] {
    return this.providers.filter((p) => p.isConfigured());
  }

  getAvailableModels(): WorkspaceModelOption[] {
    return this.getConfiguredProviders().flatMap((p) => p.getModels());
  }

  resolveModelAndProvider(requestedModelId?: string): {
    provider: AIProvider;
    modelOption: WorkspaceModelOption;
  } | null {
    const active = this.getConfiguredProviders();
    if (active.length === 0) return null;

    if (requestedModelId) {
      for (const provider of active) {
        const found = provider.getModels().find((m) => m.id === requestedModelId);
        if (found) {
          return { provider, modelOption: found };
        }
      }
      // Model được yêu cầu không tồn tại trong bất kỳ provider đã cấu hình nào:
      // trả về null thay vì lặng lẽ dùng model đầu tiên.
      return null;
    }

    const firstProvider = active[0];
    const firstModel = firstProvider.getModels()[0];
    if (!firstModel) return null;

    return { provider: firstProvider, modelOption: firstModel };
  }

  getPublicStatus(): WorkspacePublicStatus {
    const activeProviders = this.getConfiguredProviders().map((p) => ({
      id: p.id,
      label: p.label,
    }));
    const availableModels = this.getAvailableModels();

    return {
      configured: availableModels.length > 0,
      activeProviders,
      availableModels,
      defaultModelId: availableModels[0]?.id ?? null,
      requiredEnvVars: [
        'GEMINI_API_KEY',
        'OPENAI_API_KEY',
        'ANTHROPIC_API_KEY',
        'DEEPSEEK_API_KEY',
        'OPENROUTER_API_KEY',
      ],
      rateLimitPerMinute: WORKSPACE_LIMITS.RATE_LIMIT_MAX_REQUESTS,
      maxInputChars: WORKSPACE_LIMITS.MAX_INPUT_CHARS,
    };
  }
}

export const workspaceProviderRegistry = new ProviderRegistry();
