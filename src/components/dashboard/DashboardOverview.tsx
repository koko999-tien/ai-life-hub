'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Play,
  Scale,
  Calculator,
  Bookmark,
  History,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { listWorkspaceSessions, type WorkspaceSessionRecord } from '@/lib/workspace/storage';
import {
  isSupabaseConfigured,
  supabase,
  fetchBookmarks,
  type BookmarkItem,
} from '@/lib/supabase/client';
import { getWorkflowLabel, getModelLabel, formatVnd } from '@/lib/workspace/usage';

const SHORTCUTS = [
  {
    href: '/workspace',
    title: 'AI Workspace',
    desc: 'Chạy Email, Tóm tắt họp, Phân tích tài liệu',
    icon: Play,
  },
  {
    href: '/builder-lab',
    title: 'Builder Lab',
    desc: 'Trung tâm công cụ kỹ sư & bảng mã API',
    icon: Sparkles,
  },
  {
    href: '/compare',
    title: 'So sánh mô hình AI',
    desc: 'Đối chiếu 16 mô hình kèm trạng thái & giá',
    icon: Scale,
  },
  {
    href: '/tools/token-calculator',
    title: 'Tính chi phí Token',
    desc: 'Dự toán Token sang USD & VNĐ',
    icon: Calculator,
  },
];

function bookmarkHref(item: BookmarkItem): string {
  if (item.itemType === 'skill') {
    return item.itemSlug ? `/skill/${item.itemSlug}` : '/categories';
  }
  if (item.itemType === 'prompt') {
    return item.itemSlug ? `/skill/${item.itemSlug}#prompt-${item.itemId}` : '/prompts';
  }
  return '/resources';
}

const BOOKMARK_TYPE_LABELS: Record<BookmarkItem['itemType'], string> = {
  skill: 'Kỹ năng',
  prompt: 'Mẫu câu lệnh',
  resource: 'Tài nguyên',
};

export function DashboardOverview() {
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkspaceSessionRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      let uid: string | undefined;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getUser();
          uid = data.user?.id;
        } catch {
          // Chưa đăng nhập: dùng localStorage như WorkspaceClient
        }
      }
      const [loadedSessions, loadedBookmarks] = await Promise.all([
        listWorkspaceSessions(uid),
        fetchBookmarks(uid),
      ]);
      if (mounted) {
        setSessions(loadedSessions);
        setBookmarks(loadedBookmarks);
        setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const recentSessions = sessions.slice(0, 5);
  const totalTokens = sessions.reduce((sum, s) => sum + (s.usage?.totalTokens || 0), 0);
  const totalCostVnd = sessions.reduce((sum, s) => sum + (s.usage?.estimatedCostVnd || 0), 0);
  const sessionsWithUsage = sessions.filter((s) => s.usage).length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">
      <div className="mb-6 pb-5 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-text flex items-center gap-2">
          <LayoutDashboard className="w-7 h-7 text-accent" />
          Tổng quan
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Hoạt động AI Workspace của bạn, các mục đã lưu và lối tắt tới công cụ thường dùng.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted py-10 text-center">Đang tải dữ liệu tổng quan...</p>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Tổng phiên làm việc</p>
              <p className="text-3xl font-mono font-extrabold text-text mt-2">
                {sessions.length.toLocaleString('vi-VN')}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {sessionsWithUsage.toLocaleString('vi-VN')} phiên có ghi nhận mức sử dụng
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Tổng tokens đã dùng</p>
              <p className="text-3xl font-mono font-extrabold text-text mt-2">
                {totalTokens.toLocaleString('vi-VN')}
              </p>
              <p className="text-xs text-text-muted mt-1">Cộng dồn từ tất cả phiên có usage</p>
            </div>
            <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Tổng chi phí ước tính
              </p>
              <p className="text-3xl font-mono font-extrabold text-text mt-2">{formatVnd(totalCostVnd)}</p>
              <p className="text-xs text-text-muted mt-1">
                Chi phí ước tính theo giá registry, không phải hóa đơn thực tế
              </p>
            </div>
          </div>

          {/* Recent sessions */}
          <section aria-label="Phiên làm việc gần đây" className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text flex items-center gap-1.5">
                <History className="w-4 h-4 text-accent" />
                5 phiên gần nhất
              </h2>
              <Link href="/workspace/history" className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1">
                Xem tất cả
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentSessions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-bg-surface p-8 text-center space-y-3">
                <Play className="w-8 h-8 text-accent/50 mx-auto" />
                <p className="text-sm font-bold text-text">Chưa có phiên làm việc nào</p>
                <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                  Hãy chạy workflow đầu tiên của bạn trong AI Workspace — kết quả sẽ tự động được lưu
                  và xuất hiện tại đây.
                </p>
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Chạy workflow đầu tiên</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => router.push('/workspace/history')}
                    className="w-full text-left rounded-2xl border border-border bg-bg-surface p-4 shadow-sm hover:border-accent/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-text block truncate">{session.title}</span>
                    <span className="text-xs text-text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{getWorkflowLabel(session.workflowId)}</span>
                      <span aria-hidden="true">•</span>
                      <span>{getModelLabel(session.modelId)}</span>
                      <span aria-hidden="true">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(session.updatedAt).toLocaleString('vi-VN')}
                      </span>
                      {session.usage && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>
                            {session.usage.totalTokens.toLocaleString('vi-VN')} tokens ·{' '}
                            {formatVnd(session.usage.estimatedCostVnd)}
                          </span>
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Shortcuts */}
          <section aria-label="Lối tắt" className="mb-8">
            <h2 className="text-base font-bold text-text mb-3">Lối tắt</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SHORTCUTS.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <Link
                    key={shortcut.href}
                    href={shortcut.href}
                    className="rounded-2xl border border-border bg-bg-surface p-4 shadow-sm hover:border-accent/50 transition-colors group"
                  >
                    <span className="p-2 rounded-lg bg-accent/10 text-accent inline-flex mb-2">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-bold text-text block group-hover:text-accent transition-colors">
                      {shortcut.title}
                    </span>
                    <span className="text-xs text-text-muted mt-0.5 block leading-snug">{shortcut.desc}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Bookmarks / favorites */}
          <section aria-label="Mục đã lưu">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-accent" />
                Mục yêu thích đã lưu ({bookmarks.length.toLocaleString('vi-VN')})
              </h2>
              <Link href="/favorites" className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1">
                Xem tất cả
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-text-muted rounded-2xl border border-dashed border-border bg-bg-surface p-5 text-center">
                Bạn chưa lưu mục yêu thích nào. Bấm biểu tượng bookmark ở kỹ năng, câu lệnh hoặc tài nguyên
                để lưu lại tại đây.
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarks.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={bookmarkHref(item)}
                    className="block rounded-2xl border border-border bg-bg-surface p-4 shadow-sm hover:border-accent/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-text block truncate">{item.itemTitle}</span>
                    <span className="text-xs text-text-muted mt-0.5 block">
                      {BOOKMARK_TYPE_LABELS[item.itemType] || item.itemType} •{' '}
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
