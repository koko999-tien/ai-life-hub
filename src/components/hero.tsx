'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Search,
  Command,
  CheckCircle2,
  Briefcase,
  Copy,
  Check,
  Play,
  Mail,
  FileCheck2,
  FileSearch,
} from 'lucide-react';
import { toast } from 'sonner';

export function Hero() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const sampleEmailText = `Kính gửi Anh/Chị [Tên Trưởng phòng],

Em viết email này để cập nhật tiến độ Báo cáo Kiểm toán Quý vừa qua. Hiện tại, dữ liệu cơ bản đã được phòng ban tổng hợp hoàn tất 90%.

Tuy nhiên, vào sáng nay, phía đối tác vừa chuyển bổ sung bản đối chiếu số liệu điều chỉnh mới nhất. Để đảm bảo số liệu chuẩn xác trước khi trình Ban Giám đốc, em kính xin phép dời thời hạn bàn giao thêm 02 ngày, cụ thể vào 17:00 ngày [Ngày mới].

Em xin gửi kèm bản dự thảo sơ bộ để Anh/Chị xem trước và rất mong nhận được phê duyệt từ Anh/Chị.

Trân trọng,
[Họ và tên của bạn]`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(sampleEmailText);
      setCopiedEmail(true);
      toast.success('Đã sao chép email mẫu vào bộ nhớ tạm!');
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast.error('Không thể sao chép văn bản.');
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20" aria-labelledby="hero-heading">
      {/* Background Mesh & Grid Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-linear-to-b from-accent/20 via-brand-500/10 to-transparent blur-3xl opacity-60 rounded-full" />
      </div>

      <div className="container mx-auto px-section-x">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Positioning Pill */}
          <Link
            href="/workspace"
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-accent/35 bg-bg-surface/90 backdrop-blur-md shadow-2xs hover:border-accent hover:shadow-sm transition-all mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-text-muted group-hover:text-text transition-colors">
              Mới: <strong className="text-text font-semibold">AI Workspace — soạn email, tóm tắt họp &amp; phân tích tài liệu ngay trên trình duyệt</strong>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Clear First-Viewport Headline */}
          <h1 id="hero-heading" className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-text text-balance mb-5 leading-[1.15]">
            AI không chỉ để trò chuyện. <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-accent via-accent-500 to-brand-500 bg-clip-text text-transparent">
              Hãy dùng AI để hoàn thành công việc.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed text-balance">
            Không gian làm việc AI tiếng Việt giúp người đi làm soạn email, tổng hợp biên bản họp và phân tích tài liệu ngay trên trình duyệt — đi kèm thư viện 80+ câu lệnh thực chiến và phòng công cụ kỹ thuật cho lập trình viên.
          </p>

          {/* 1 nút chính duy nhất + link phụ */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link
              href="/workspace?workflow=email-assistant"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-accent hover:bg-accent-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-fast"
            >
              <Play className="w-4 h-4" />
              <span>Bắt đầu — Soạn email đầu tiên</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6 text-xs sm:text-sm">
            <Link
              href="/prompts"
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-accent transition-colors"
            >
              <span>Khám phá thư viện AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </Link>
            <Link
              href="/builder-lab"
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-text transition-colors"
            >
              <span>Builder Lab cho Kỹ thuật</span>
            </Link>
            <a
              href="#audience-heading"
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-accent transition-colors"
            >
              <span>Chọn lộ trình của bạn ↓</span>
            </a>
          </div>

          {/* Quick Search Trigger Bar */}
          <div className="max-w-md mx-auto mb-10">
            <button
              type="button"
              onClick={handleOpenSearch}
              className="w-full group flex items-center justify-between px-4 py-2.5 rounded-2xl bg-bg-surface/90 hover:bg-hover border border-border/80 hover:border-accent/50 shadow-2xs hover:shadow-sm transition-all text-left text-sm"
              aria-label="Tìm kiếm nhanh toàn bộ kỹ năng, câu lệnh và công cụ"
            >
              <div className="flex items-center gap-2.5 text-text-muted group-hover:text-text min-w-0">
                <Search className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs sm:text-sm truncate">Tìm công việc, mẫu câu lệnh, mô hình AI (có dấu hoặc không dấu)...</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-text-muted bg-bg/80 border border-border rounded-md shadow-2xs">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Interactive Product Experience Preview Card */}
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-bg-surface shadow-2xl backdrop-blur-xl overflow-hidden text-left mb-0">
            {/* Preview Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border bg-bg/80">
              <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-text">
                <Briefcase className="w-3.5 h-3.5 text-accent" />
                <span>Người đi làm (Trải nghiệm AI Workspace)</span>
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Làm việc thật trên trang
                </span>
              </div>
            </div>

            {/* AI Workspace Workflow Preview */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* 3 Workspace Workflows Quick Launcher */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Link
                    href="/workspace?workflow=email-assistant"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text block truncate">Trợ lý Email AI</span>
                      <span className="text-[11px] text-text-muted block truncate">Soạn, rút gọn, đổi ngôn ngữ</span>
                    </div>
                  </Link>
                  <Link
                    href="/workspace?workflow=meeting-summary"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-bg hover:border-accent/40 transition-colors"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text block truncate">Tóm tắt Cuộc họp</span>
                      <span className="text-[11px] text-text-muted block truncate">Quyết định &amp; đầu việc rõ ràng</span>
                    </div>
                  </Link>
                  <Link
                    href="/workspace?workflow=document-analysis"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-bg hover:border-accent/40 transition-colors"
                  >
                    <FileSearch className="w-4 h-4 text-brand-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text block truncate">Phân tích Tài liệu</span>
                      <span className="text-[11px] text-text-muted block truncate">Trích xuất &amp; hỏi đáp bám sát</span>
                    </div>
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-bg/60 p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent block mb-1">
                    Ví dụ đầu vào công việc thực tế:
                  </span>
                  <p className="text-xs sm:text-sm text-text font-medium">
                    &ldquo;Soạn email xin gia hạn nộp báo cáo kiểm toán thêm 2 ngày vì đối tác vừa gửi điều chỉnh số liệu mới.&rdquo;
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-bg p-4 text-xs sm:text-[13px] leading-relaxed text-text font-sans space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kết quả mẫu hoàn chỉnh:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 transition-all shadow-2xs"
                        aria-label="Sao chép email mẫu"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã sao chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép email</span>
                          </>
                        )}
                      </button>
                      <Link
                        href="/workspace?workflow=email-assistant"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Tạo bản của bạn</span>
                      </Link>
                    </div>
                  </div>
                  <pre className="font-sans whitespace-pre-line text-text-muted leading-relaxed text-xs sm:text-sm">
                    {sampleEmailText}
                  </pre>
                </div>
              </div>
          </div>
          <p className="mt-4 text-center text-xs text-text-muted">
            Bạn là lập trình viên?{' '}
            <Link href="/builder-lab" className="font-semibold text-brand-500 hover:underline">
              Xem Builder Lab →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
