/**
 * Provider-Independent Server-Side AI Execution Layer Types
 * Powers AI Workspace (/workspace) via /api/workspace/*
 */

export type AIWorkflowId =
  | 'email-assistant'
  | 'meeting-summary'
  | 'document-analysis'
  | 'custom-prompt';

export type AIProviderId = 'google' | 'openai' | 'anthropic' | 'deepseek' | 'openrouter';

export interface WorkspaceModelOption {
  id: string;
  label: string;
  providerId: AIProviderId;
  providerLabel: string;
  apiModelId: string;
  registryModelId: string;
  recommendedFor: string;
}

export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
  modelOption: WorkspaceModelOption;
  temperature?: number;
  maxOutputTokens?: number;
  signal?: AbortSignal;
}

export interface UsageMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  estimatedCostVnd: number;
  isEstimated: boolean;
}

export interface AIResponse {
  text: string;
  providerId: AIProviderId;
  modelId: string;
  usage: UsageMetrics;
  latencyMs: number;
}

export type AIStreamChunk =
  | { type: 'text'; delta: string }
  | { type: 'usage'; usage: Partial<UsageMetrics> }
  | { type: 'done'; latencyMs: number; usage: UsageMetrics; modelLabel: string; providerLabel: string }
  | { type: 'error'; code: string; message: string };

export interface AIProvider {
  readonly id: AIProviderId;
  readonly label: string;
  isConfigured(): boolean;
  getModels(): WorkspaceModelOption[];
  stream(req: AIRequest): AsyncGenerator<{ type: 'text'; delta: string } | { type: 'usage'; inputTokens?: number; outputTokens?: number }, void, unknown>;
}

export interface WorkspacePublicStatus {
  configured: boolean;
  activeProviders: Array<{ id: AIProviderId; label: string }>;
  availableModels: WorkspaceModelOption[];
  defaultModelId: string | null;
  requiredEnvVars: string[];
  rateLimitPerMinute: number;
  maxInputChars: number;
}
