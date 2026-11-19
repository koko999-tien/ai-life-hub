/**
 * Server-Side Per-IP Rate Limiter & Usage Cost Tracker
 *
 * Architectural Note:
 * This sliding-window rate limiter runs in server memory per Node.js / Serverless instance.
 * It protects against rapid single-client bursts without requiring external paid infrastructure.
 * For multi-region horizontally scaled deployments with strict global quotas, pair with
 * Upstash Redis / Vercel KV using the same `checkRateLimit` interface.
 */

import { getModelById, DEFAULT_USD_TO_VND } from '@/lib/models/registry';
import type { UsageMetrics } from './types';

export const WORKSPACE_LIMITS = {
  RATE_LIMIT_WINDOW_MS: 60_000,
  RATE_LIMIT_MAX_REQUESTS: 15,
  MAX_INPUT_CHARS: 40_000,
  MAX_OUTPUT_TOKENS: 4_096,
  PROVIDER_TIMEOUT_MS: 25_000,
} as const;

interface RateBucket {
  timestamps: number[];
}

const ipBuckets = new Map<string, RateBucket>();

export function checkRateLimit(clientKey: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const cutoff = now - WORKSPACE_LIMITS.RATE_LIMIT_WINDOW_MS;

  // Periodic cleanup to prevent unbounded Map growth
  if (ipBuckets.size > 1000) {
    for (const [key, bucket] of ipBuckets.entries()) {
      const valid = bucket.timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) ipBuckets.delete(key);
      else bucket.timestamps = valid;
    }
  }

  const bucket = ipBuckets.get(clientKey) || { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= WORKSPACE_LIMITS.RATE_LIMIT_MAX_REQUESTS) {
    const oldest = bucket.timestamps[0] || now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + WORKSPACE_LIMITS.RATE_LIMIT_WINDOW_MS - now) / 1000)
    );
    ipBuckets.set(clientKey, bucket);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  bucket.timestamps.push(now);
  ipBuckets.set(clientKey, bucket);

  return {
    allowed: true,
    remaining: Math.max(0, WORKSPACE_LIMITS.RATE_LIMIT_MAX_REQUESTS - bucket.timestamps.length),
    retryAfterSeconds: 0,
  };
}

export function computeUsageMetrics(params: {
  registryModelId: string;
  promptChars: number;
  outputChars: number;
  reportedInputTokens?: number;
  reportedOutputTokens?: number;
}): UsageMetrics {
  const hasReported =
    typeof params.reportedInputTokens === 'number' &&
    params.reportedInputTokens > 0 &&
    typeof params.reportedOutputTokens === 'number' &&
    params.reportedOutputTokens > 0;

  const inputTokens =
    params.reportedInputTokens && params.reportedInputTokens > 0
      ? params.reportedInputTokens
      : Math.max(1, Math.ceil(params.promptChars / 3.8));

  const outputTokens =
    params.reportedOutputTokens && params.reportedOutputTokens > 0
      ? params.reportedOutputTokens
      : Math.max(1, Math.ceil(params.outputChars / 3.8));

  const regModel = getModelById(params.registryModelId);
  const inputPrice = regModel?.inputPricePer1M ?? 0.3;
  const outputPrice = regModel?.outputPricePer1M ?? 2.5;

  const estimatedCostUsd =
    (inputTokens / 1_000_000) * inputPrice + (outputTokens / 1_000_000) * outputPrice;
  const estimatedCostVnd = Math.round(estimatedCostUsd * DEFAULT_USD_TO_VND);

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
    estimatedCostVnd,
    isEstimated: !hasReported,
  };
}
