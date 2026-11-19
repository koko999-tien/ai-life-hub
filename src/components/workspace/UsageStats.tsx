'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, History, LayoutDashboard, Play } from 'lucide-react';
import { listWorkspaceSessions, type WorkspaceSessionRecord } from '@/lib/workspace/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { aggregateUsage, formatVnd } from '@/lib/workspace/usage';

export function UsageStats() {
  const [sessions, setSessions] = useState<WorkspaceSessionRecord[]>([]);
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
      const loaded = await listWorkspaceSessions(uid);
      if (mounted) {
        setSessions(loaded);
        setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const usage = aggregateUsage(sessions);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-text flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-accent" />
            Thống kê sử dụng
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Cộng dồn từ các phiên làm việc đã lưu có ghi nhận mức sử dụng. Chi phí là ước tính theo
            giá registry, không phải hóa đơn thực tế.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/workspace/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-bg-surface hover:border-accent text-xs font-semibold text-text transition-colors"
          >
            <History className="w-3.5 h-3.5 text-accent" />
            <span>Lịch sử phiên</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-bg-surface hover:border-accent text-xs font-semibold text-text transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
            <span>Tổng quan</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted py-10 text-center">Đang tải thống kê sử dụng...</p>
      ) : usage.total.count === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-bg-surface p-8 sm:p-12 text-center space-y-3">
          <BarChart3 className="w-10 h-10 text-accent/50 mx-auto" />
          <p className="text-base font-bold text-text">Chưa có dữ liệu sử dụng</p>
          <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            Hãy chạy workflow đầu tiên của bạn trong AI Workspace — tokens và chi phí ước tính của
            mỗi lần chạy sẽ được ghi lại và thống kê tại đây.
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
        <div className="space-y-8">
          {/* Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Phiên có usage</p>
              <p className="text-3xl font-mono font-extrabold text-text mt-2">
                {usage.total.count.toLocaleString('vi-VN')}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Tổng tokens</p>
              <p className="text-3xl font-mono font-extrabold text-text mt-2">
                {usage.total.totalTokens.toLocaleString('vi-VN')}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-bg-surface p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Tổng chi phí ước tính</p>
              <p className="text-3xl font-mono font-extrabold text-text mt-2">
                {formatVnd(usage.total.totalCostVnd)}
              </p>
            </div>
          </div>

          {/* By model */}
          <section aria-label="Thống kê theo mô hình">
            <h2 className="text-base font-bold text-text mb-3">Theo mô hình</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-bg-surface shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th scope="col" className="px-4 py-3 font-semibold">Mô hình</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Phiên</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Tokens</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Chi phí ước tính</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.byModel.map((row) => (
                    <tr key={row.modelId} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-semibold text-text">{row.label}</td>
                      <td className="px-4 py-3 text-right text-text-muted">{row.count.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right font-mono text-text">{row.totalTokens.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right font-mono text-text">{formatVnd(row.totalCostVnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* By workflow */}
          <section aria-label="Thống kê theo quy trình">
            <h2 className="text-base font-bold text-text mb-3">Theo quy trình</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-bg-surface shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th scope="col" className="px-4 py-3 font-semibold">Quy trình</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Phiên</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Tokens</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Chi phí ước tính</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.byWorkflow.map((row) => (
                    <tr key={row.workflowId} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-semibold text-text">{row.label}</td>
                      <td className="px-4 py-3 text-right text-text-muted">{row.count.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right font-mono text-text">{row.totalTokens.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right font-mono text-text">{formatVnd(row.totalCostVnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* By day */}
          <section aria-label="Thống kê theo ngày">
            <h2 className="text-base font-bold text-text mb-3">Theo ngày</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-bg-surface shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th scope="col" className="px-4 py-3 font-semibold">Ngày</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Phiên</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Tokens</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">Chi phí ước tính</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.byDay.map((row) => (
                    <tr key={row.date} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-semibold text-text">
                        {row.date === 'Không rõ ngày'
                          ? row.date
                          : new Date(`${row.date}T00:00:00`).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-right text-text-muted">{row.count.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right font-mono text-text">{row.totalTokens.toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right font-mono text-text">{formatVnd(row.totalCostVnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
