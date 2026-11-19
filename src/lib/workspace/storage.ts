/**
 * AI Workspace Session & Personal Template Dual-Mode Storage
 *
 * - Authenticated + Supabase configured -> syncs with `workspace_sessions` & `personal_templates` tables (RLS enforced).
 * - Unauthenticated or Supabase unconfigured -> persists cleanly in browser `localStorage` with explicit UI disclosure.
 */

import { supabase, isSupabaseConfigured, LOCAL_STORAGE_KEYS } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/types';
import type { AIWorkflowId, UsageMetrics } from '@/lib/ai/types';

export interface WorkspaceMessageRecord {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  modelLabel?: string;
}

export interface WorkspaceSessionRecord {
  id: string;
  title: string;
  workflowId: AIWorkflowId;
  modelId: string;
  inputs: Record<string, unknown>;
  resultText: string;
  messages: WorkspaceMessageRecord[];
  usage?: UsageMetrics;
  createdAt: string;
  updatedAt: string;
  storageMode: 'cloud' | 'local';
}

export interface PersonalTemplateRecord {
  id: string;
  title: string;
  description: string;
  template: string;
  categoryId: string;
  workflowId: AIWorkflowId;
  createdAt: string;
  storageMode: 'cloud' | 'local';
}

function readLocalSessions(): WorkspaceSessionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSPACE_SESSIONS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalSessions(sessions: WorkspaceSessionRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.WORKSPACE_SESSIONS,
      JSON.stringify(sessions.slice(0, 60))
    );
    window.dispatchEvent(new Event('workspace-sessions-updated'));
  } catch (e) {
    console.error('Failed to write local workspace sessions:', e);
  }
}

/** Đọc usage từ cột usage_json (JSONB). Trả undefined nếu cột chưa có / dữ liệu sai shape. */
function parseUsageJson(value: unknown): UsageMetrics | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Record<string, unknown>;
  if (
    typeof v.inputTokens !== 'number' ||
    typeof v.outputTokens !== 'number' ||
    typeof v.totalTokens !== 'number' ||
    typeof v.estimatedCostUsd !== 'number' ||
    typeof v.estimatedCostVnd !== 'number'
  ) {
    return undefined;
  }
  return {
    inputTokens: v.inputTokens,
    outputTokens: v.outputTokens,
    totalTokens: v.totalTokens,
    estimatedCostUsd: v.estimatedCostUsd,
    estimatedCostVnd: v.estimatedCostVnd,
    isEstimated: typeof v.isEstimated === 'boolean' ? v.isEstimated : true,
  };
}

export async function listWorkspaceSessions(userId?: string): Promise<WorkspaceSessionRecord[]> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('workspace_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          workflowId: row.workflow_id as AIWorkflowId,
          modelId: row.model_id,
          inputs: (row.inputs_json as Record<string, unknown>) || {},
          resultText: row.result_text || '',
          messages: [],
          usage: parseUsageJson(row.usage_json),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          storageMode: 'cloud' as const,
        }));
      }
    } catch (e) {
      console.warn('Supabase listWorkspaceSessions fallback:', e);
    }
  }

  return readLocalSessions();
}

export async function saveWorkspaceSession(
  session: Omit<WorkspaceSessionRecord, 'id' | 'updatedAt' | 'storageMode'> & { id?: string },
  userId?: string
): Promise<WorkspaceSessionRecord> {
  const now = new Date().toISOString();
  const sessionId = session.id || `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (isSupabaseConfigured && supabase && userId) {
    try {
      const payload = {
        user_id: userId,
        title: session.title.slice(0, 220),
        workflow_id: session.workflowId,
        model_id: session.modelId,
        // Inputs của workflow luôn là dữ liệu JSON-serializable.
        inputs_json: session.inputs as unknown as Json,
        result_text: session.resultText,
        usage_json: (session.usage ?? null) as unknown as Json,
        updated_at: now,
      };

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId);
      const query = isUuid
        ? supabase.from('workspace_sessions').upsert({ id: sessionId, ...payload }).select().single()
        : supabase.from('workspace_sessions').insert(payload).select().single();

      const { data, error } = await query;
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          workflowId: data.workflow_id as AIWorkflowId,
          modelId: data.model_id,
          inputs: (data.inputs_json as Record<string, unknown>) || {},
          resultText: data.result_text || '',
          messages: session.messages || [],
          usage: session.usage,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          storageMode: 'cloud',
        };
      }
    } catch (e) {
      console.warn('Supabase saveWorkspaceSession fallback:', e);
    }
  }

  const existing = readLocalSessions();
  const record: WorkspaceSessionRecord = {
    id: sessionId,
    title: session.title.slice(0, 220),
    workflowId: session.workflowId,
    modelId: session.modelId,
    inputs: session.inputs,
    resultText: session.resultText,
    messages: session.messages || [],
    usage: session.usage,
    createdAt: session.createdAt || now,
    updatedAt: now,
    storageMode: 'local',
  };

  const idx = existing.findIndex((s) => s.id === sessionId);
  if (idx >= 0) {
    existing[idx] = record;
  } else {
    existing.unshift(record);
  }
  writeLocalSessions(existing);
  return record;
}

export async function deleteWorkspaceSession(sessionId: string, userId?: string): Promise<void> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      await supabase
        .from('workspace_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);
    } catch (e) {
      console.warn('Supabase deleteWorkspaceSession error:', e);
    }
  }

  const next = readLocalSessions().filter((s) => s.id !== sessionId);
  writeLocalSessions(next);
}

// Personal Templates CRUD
function readLocalTemplates(): PersonalTemplateRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.PERSONAL_TEMPLATES);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalTemplates(templates: PersonalTemplateRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PERSONAL_TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to write local personal templates:', e);
  }
}

export async function listPersonalTemplates(userId?: string): Promise<PersonalTemplateRecord[]> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('personal_templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          template: t.template,
          categoryId: t.category_id || 'work',
          workflowId: (t.workflow_id || 'custom-prompt') as AIWorkflowId,
          createdAt: t.created_at,
          storageMode: 'cloud' as const,
        }));
      }
    } catch (e) {
      console.warn('Supabase listPersonalTemplates fallback:', e);
    }
  }

  return readLocalTemplates();
}

export async function createPersonalTemplate(
  input: {
    title: string;
    description: string;
    template: string;
    categoryId?: string;
    workflowId?: AIWorkflowId;
  },
  userId?: string
): Promise<PersonalTemplateRecord> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('personal_templates')
        .insert({
          user_id: userId,
          title: input.title.trim(),
          description: input.description.trim(),
          template: input.template.trim(),
          category_id: input.categoryId || 'work',
          workflow_id: input.workflowId || 'custom-prompt',
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          template: data.template,
          categoryId: data.category_id,
          workflowId: data.workflow_id as AIWorkflowId,
          createdAt: data.created_at,
          storageMode: 'cloud',
        };
      }
    } catch (e) {
      console.warn('Supabase createPersonalTemplate fallback:', e);
    }
  }

  const record: PersonalTemplateRecord = {
    id: `pt-${Date.now()}`,
    title: input.title.trim(),
    description: input.description.trim(),
    template: input.template.trim(),
    categoryId: input.categoryId || 'work',
    workflowId: input.workflowId || 'custom-prompt',
    createdAt: now,
    storageMode: 'local',
  };

  const list = readLocalTemplates();
  list.unshift(record);
  writeLocalTemplates(list);
  return record;
}

export async function deletePersonalTemplate(templateId: string, userId?: string): Promise<void> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      await supabase
        .from('personal_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', userId);
    } catch (e) {
      console.warn('Supabase deletePersonalTemplate error:', e);
    }
  }

  const next = readLocalTemplates().filter((t) => t.id !== templateId);
  writeLocalTemplates(next);
}
