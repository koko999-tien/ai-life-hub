/**
 * Workspace Usage Aggregation
 *
 * Cộng dồn UsageMetrics từ các WorkspaceSessionRecord đã lưu (chỉ tính
 * những session có `usage`) để hiển thị thống kê theo model / workflow / ngày.
 * Không thêm bảng DB mới — dữ liệu đọc từ storage hiện có.
 */

import type { AIWorkflowId } from '@/lib/ai/types';
import type { WorkspaceSessionRecord } from '@/lib/workspace/storage';
import { getModelById } from '@/lib/models/registry';

/** Tên tiếng Việt của 4 workflow, khớp WORKFLOW_META trong WorkspaceClient. */
export const WORKFLOW_LABELS: Record<AIWorkflowId, string> = {
  'email-assistant': 'Trợ lý Email AI',
  'meeting-summary': 'Tóm tắt Cuộc họp',
  'document-analysis': 'Phân tích Tài liệu',
  'custom-prompt': 'Câu lệnh tùy chọn',
};

export function getWorkflowLabel(workflowId: AIWorkflowId): string {
  return WORKFLOW_LABELS[workflowId] || workflowId;
}

export function getModelLabel(modelId: string): string {
  return getModelById(modelId)?.name || modelId;
}

/** Định dạng số tiền VNĐ theo chuẩn vi-VN, vd: 12.345 đ */
export function formatVnd(n: number): string {
  const safe = Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
  return `${safe.toLocaleString('vi-VN')} đ`;
}

export interface UsageByModelRow {
  modelId: string;
  label: string;
  totalTokens: number;
  totalCostVnd: number;
  count: number;
}

export interface UsageByWorkflowRow {
  workflowId: AIWorkflowId;
  label: string;
  totalTokens: number;
  totalCostVnd: number;
  count: number;
}

export interface UsageByDayRow {
  /** Ngày ISO yyyy-MM-dd (lấy từ updatedAt của session). */
  date: string;
  totalTokens: number;
  totalCostVnd: number;
  count: number;
}

export interface AggregatedUsage {
  byModel: UsageByModelRow[];
  byWorkflow: UsageByWorkflowRow[];
  byDay: UsageByDayRow[];
  total: { totalTokens: number; totalCostVnd: number; count: number };
}

export function aggregateUsage(sessions: WorkspaceSessionRecord[]): AggregatedUsage {
  const byModelMap = new Map<string, UsageByModelRow>();
  const byWorkflowMap = new Map<AIWorkflowId, UsageByWorkflowRow>();
  const byDayMap = new Map<string, UsageByDayRow>();
  let totalTokens = 0;
  let totalCostVnd = 0;
  let count = 0;

  for (const session of sessions) {
    const usage = session.usage;
    if (!usage) continue;

    const tokens = usage.totalTokens || 0;
    const costVnd = usage.estimatedCostVnd || 0;
    count += 1;
    totalTokens += tokens;
    totalCostVnd += costVnd;

    const modelRow = byModelMap.get(session.modelId) || {
      modelId: session.modelId,
      label: getModelLabel(session.modelId),
      totalTokens: 0,
      totalCostVnd: 0,
      count: 0,
    };
    modelRow.totalTokens += tokens;
    modelRow.totalCostVnd += costVnd;
    modelRow.count += 1;
    byModelMap.set(session.modelId, modelRow);

    const workflowRow = byWorkflowMap.get(session.workflowId) || {
      workflowId: session.workflowId,
      label: getWorkflowLabel(session.workflowId),
      totalTokens: 0,
      totalCostVnd: 0,
      count: 0,
    };
    workflowRow.totalTokens += tokens;
    workflowRow.totalCostVnd += costVnd;
    workflowRow.count += 1;
    byWorkflowMap.set(session.workflowId, workflowRow);

    const date = (session.updatedAt || session.createdAt || '').slice(0, 10) || 'Không rõ ngày';
    const dayRow = byDayMap.get(date) || { date, totalTokens: 0, totalCostVnd: 0, count: 0 };
    dayRow.totalTokens += tokens;
    dayRow.totalCostVnd += costVnd;
    dayRow.count += 1;
    byDayMap.set(date, dayRow);
  }

  const byCostDesc = <T extends { totalCostVnd: number }>(a: T, b: T) => b.totalCostVnd - a.totalCostVnd;

  return {
    byModel: [...byModelMap.values()].sort(byCostDesc),
    byWorkflow: [...byWorkflowMap.values()].sort(byCostDesc),
    byDay: [...byDayMap.values()].sort((a, b) => b.date.localeCompare(a.date)),
    total: { totalTokens, totalCostVnd, count },
  };
}
