/**
 * Privacy-Safe Product Analytics Foundation
 *
 * Tracks ONLY sanitized product events (no raw prompt text, no document content,
 * no emails, no personal identifiers).
 *
 * Dispatches CustomEvent('ai-life-hub:analytics') for external telemetry adapters
 * and stores an ephemeral capped local diagnostic summary (max 50 events) that users
 * can clear anytime via 1-click deletion on /account.
 */

import { LOCAL_STORAGE_KEYS } from '@/lib/supabase/client';

export type AnalyticsEventName =
  | 'page_view'
  | 'prompt_opened'
  | 'prompt_copied'
  | 'workflow_started'
  | 'workflow_completed'
  | 'workspace_session_created'
  | 'workspace_session_reused'
  | 'result_saved'
  | 'signup_completed';

export interface AnalyticsEventPayload {
  route?: string;
  promptId?: string;
  workflowId?: string;
  modelId?: string;
  category?: string;
  durationMs?: number;
  mode?: 'cloud' | 'local';
}

const FORBIDDEN_PAYLOAD_KEYS = new Set([
  'prompt',
  'template',
  'content',
  'text',
  'document',
  'email',
  'message',
  'input',
  'output',
]);

function sanitizePayload(payload?: AnalyticsEventPayload): Record<string, string | number> {
  if (!payload) return {};
  const clean: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(payload)) {
    if (FORBIDDEN_PAYLOAD_KEYS.has(key.toLowerCase())) continue;
    if (typeof val === 'number' && Number.isFinite(val)) {
      clean[key] = Math.round(val);
    } else if (typeof val === 'string' && val.length > 0) {
      // Truncate metadata identifiers to max 80 chars so freeform text can never leak
      clean[key] = val.slice(0, 80);
    }
  }
  return clean;
}

export function trackEvent(name: AnalyticsEventName, payload?: AnalyticsEventPayload): void {
  if (typeof window === 'undefined') return;

  try {
    const entry = {
      event: name,
      props: sanitizePayload(payload),
      ts: new Date().toISOString(),
    };

    window.dispatchEvent(new CustomEvent('ai-life-hub:analytics', { detail: entry }));

    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS_EVENTS);
    const list = raw ? JSON.parse(raw) : [];
    const safeList = Array.isArray(list) ? list : [];
    safeList.unshift(entry);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS_EVENTS, JSON.stringify(safeList.slice(0, 50)));
  } catch {
    // Analytics must never throw or interrupt user flows
  }
}
