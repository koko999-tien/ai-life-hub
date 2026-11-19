'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Trash2, RotateCcw, History, Play, BarChart3 } from 'lucide-react';
import { toast } from '@/components/ui';
import type { AIWorkflowId } from '@/lib/ai/types';
import {
  listWorkspaceSessions,
  deleteWorkspaceSession,
  type WorkspaceSessionRecord,
} from '@/lib/workspace/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { getWorkflowLabel, getModelLabel, formatVnd } from '@/lib/workspace/usage';

/** Key dùng để WorkspaceClient biết cần mở lại session nào sau khi chuyển trang. */
export const WORKSPACE_REOPEN_SESSION_KEY = 'workspace-reopen-session-id';

const WORKFLOW_FILTERS: Array<{ id: AIWorkflowId | 'all'; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'email-assistant', label: 'Trợ lý Email AI' },
  { id: 'meeting-summary', label: 'Tóm tắt Cuộc họp' },
  { id: 'document-analysis', label: 'Phân tích Tài liệu' },
  { id: 'custom-prompt', label: 'Câu lệnh tùy chọn' },
];

export function WorkspaceHistory() {
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkspaceSessionRecord[]>([]);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [workflowFilter, setWorkflowFilter] = useState<AIWorkflowId | 'all'>('all');

  const loadSessions = useCallback(async (uid?: string) => {
    const loaded = await listWorkspaceSessions(uid);
    setSessions(loaded);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      let uid: string | undefined;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getUser();
          uid = data.user?.id;
          if (mounted) setUserId(uid);
        } catch {
          // Chưa đăng nhập: dùng localStorage như WorkspaceClient
        }
      }
      if (mounted) {
        await loadSessions(uid);
        setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [loadSessions]);

  const handleReopen = (session: WorkspaceSessionRecord) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(WORKSPACE_REOPEN_SESSION_KEY, session.id);
    }
    router.push('/workspace');
  };

  const handleDelete = async (session: WorkspaceSessionRecord) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phiên làm việc "${session.title}" không? Hành động này không thể hoàn tác.`)) {
      return;
    }
    await deleteWorkspaceSession(session.id, userId);
    await loadSessions(userId);
    toast.success('Đã xóa phiên làm việc.');
  };

  const filteredSessions =
    workflowFilter === 'all' ? sessions : sessions.filter((s) => s.workflowId === workflowFilter);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-text flex items-center gap-2">
            <History className="w-7 h-7 text-accent" />
            Lịch sử phiên làm việc
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {sessions.length > 0
              ? `Bạn đã lưu ${sessions.length.toLocaleString('vi-VN')} phiên làm việc. Bấm "Mở lại" để tiếp tục chỉnh sửa và chạy lại một phiên cũ.`
              : 'Các phiên làm việc sau khi chạy sẽ tự động lưu tại đây.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/workspace/usage"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-bg-surface hover:border-accent text-xs font-semibold text-text transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-accent" />
            <span>Thống kê sử dụng</span>
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Mở AI Workspace</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <label htmlFor="ws-history-filter" className="text-xs font-semibold text-text">
          Lọc theo quy trình:
        </label>
        <select
          id="ws-history-filter"
          value={workflowFilter}
          onChange={(e) => setWorkflowFilter(e.target.value as AIWorkflowId | 'all')}
          className="px-3 py-2 rounded-xl border border-border bg-bg-surface text-xs sm:text-sm font-medium text-text focus:outline-hidden focus:border-accent"
        >
          {WORKFLOW_FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-text-muted">
          {filteredSessions.length.toLocaleString('vi-VN')} phiên
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted py-10 text-center">Đang tải lịch sử phiên làm việc...</p>
      ) : filteredSessions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-bg-surface p-8 sm:p-12 text-center space-y-3">
          <History className="w-10 h-10 text-accent/50 mx-auto" />
          <p className="text-base font-bold text-text">
            {sessions.length === 0 ? 'Chưa có phiên làm việc nào' : 'Không có phiên nào thuộc quy trình này'}
          </p>
          <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            {sessions.length === 0
              ? 'Hãy chạy workflow đầu tiên của bạn — kết quả sẽ tự động được lưu lại tại đây để mở lại bất cứ lúc nào.'
              : 'Thử chọn quy trình khác trong bộ lọc phía trên để xem các phiên còn lại.'}
          </p>
          {sessions.length === 0 && (
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Chạy workflow đầu tiên</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border border-border bg-bg-surface p-4 sm:p-5 shadow-sm hover:border-accent/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-base font-bold text-text truncate">{session.title}</h2>
                  <p className="text-xs text-text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>{getWorkflowLabel(session.workflowId)}</span>
                    <span aria-hidden="true">•</span>
                    <span>{getModelLabel(session.modelId)}</span>
                    <span aria-hidden="true">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(session.updatedAt).toLocaleString('vi-VN')}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>{session.storageMode === 'cloud' ? 'Đám mây' : 'Trình duyệt'}</span>
                  </p>
                  {session.usage && (
                    <p className="text-xs text-text-muted mt-1.5">
                      Đã dùng {session.usage.totalTokens.toLocaleString('vi-VN')} tokens · Ước tính{' '}
                      {formatVnd(session.usage.estimatedCostVnd)}
                    </p>
                  )}
                  {session.resultText && (
                    <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                      {session.resultText}
                    </p>
                  )}
                </div>
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleReopen(session)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Mở lại</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(session)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-bg hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold text-text transition-colors"
                    aria-label={`Xóa phiên ${session.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
