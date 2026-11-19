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
  Laptop,
  Copy,
  Check,
  Cpu,
  DollarSign,
  Play,
  Mail,
  FileCheck2,
  FileSearch,
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export function Hero() {
  const [activePreviewTab, setActivePreviewTab] = useState<'office' | 'builder'>('office');
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
              Mới: <strong className="text-text font-semibold">AI Workspace thực thi trực tiếp Email, Tóm tắt họp &amp; Phân tích tài liệu</strong>
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

          {/* Primary + Secondary + Builder CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link
              href="/workspace"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-accent hover:bg-accent-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-fast"
            >
              <Play className="w-4 h-4" />
              <span>Khám phá AI Workspace</span>
            </Link>
            <Link
              href="/prompts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-text bg-bg-surface hover:bg-hover border border-border hover:border-accent/50 shadow-2xs hover:-translate-y-0.5 transition-all duration-fast"
            >
              <span>Khám phá thư viện AI</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
            <Link
              href="/builder-lab"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-text-muted hover:text-text bg-bg/70 hover:bg-hover border border-border/80 hover:border-brand-500/50 transition-all duration-fast"
            >
              <Laptop className="w-4 h-4 text-brand-500" />
              <span>Builder Lab cho Kỹ thuật</span>
            </Link>
            <a
              href="#audience-heading"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-xs sm:text-sm font-medium text-text-muted hover:text-accent transition-colors"
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
            {/* Tab Header Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border bg-bg/80">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('office')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    activePreviewTab === 'office'
                      ? 'bg-accent text-white shadow-2xs'
                      : 'text-text-muted hover:text-text hover:bg-hover'
                  )}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Người đi làm (Trải nghiệm AI Workspace)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('builder')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    activePreviewTab === 'builder'
                      ? 'bg-brand-500 text-white shadow-2xs'
                      : 'text-text-muted hover:text-text hover:bg-hover'
                  )}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Lập trình viên &amp; Kỹ thuật (Builder Lab)</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Làm việc thật trên trang
                </span>
              </div>
            </div>

            {/* Tab 1 Content: AI Workspace Workflow Preview */}
            {activePreviewTab === 'office' && (
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
            )}

            {/* Tab 2 Content: Builder / Developer Preview */}
            {activePreviewTab === 'builder' && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-bg p-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Chỉ dẫn hệ thống (System Prompt)
                    </span>
                    <p className="text-xs text-text-muted">
                      Thiết kế vai trò, ràng buộc chống bịa đặt và định dạng đầu ra chuẩn xác cho Claude Sonnet 4.6, GPT-4.1, Gemini 2.5 Pro.
                    </p>
                    <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-bg-surface p-2.5 rounded-lg border border-border mt-1 space-y-1">
                      <div>&lt;identity&gt;Kiến trúc sư phần mềm cấp cao&lt;/identity&gt;</div>
                      <div>&lt;strict_constraints&gt;Không bao giờ tự bịa số liệu&lt;/strict_constraints&gt;</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-bg p-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      Đơn giá Token xác thực &amp; quy đổi VNĐ
                    </span>
                    <p className="text-xs text-text-muted">
                      Tính cước API theo biểu giá hãng công bố (tỷ giá dự toán cấu hình thủ công 25.450 VNĐ/USD):
                    </p>
                    <div className="font-mono text-[11px] text-accent bg-bg-surface p-2.5 rounded-lg border border-border mt-1 font-bold">
                      Gemini 2.5 Flash: $0.30 đầu vào / $2.50 đầu ra trên 1M token
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">
                    Gồm bảng đối chiếu 16 mô hình có nguồn dẫn, máy tính Prompt Caching và 14 mẫu Trợ lý AI.
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/compare"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-bg hover:border-brand-500/50 text-text transition-all"
                    >
                      <span>So sánh mô hình</span>
                    </Link>
                    <Link
                      href="/tools/system-prompt-builder"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-2xs"
                    >
                      <span>Mở xưởng tạo chỉ dẫn AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
