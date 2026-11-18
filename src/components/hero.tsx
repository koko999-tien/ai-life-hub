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

Em viết email này để cập nhật về tiến độ Báo cáo Kiểm toán Quý vừa qua. Hiện tại, dữ liệu cơ bản đã được phòng ban tổng hợp hoàn tất 90%.

Tuy nhiên, vào sáng nay, phía đối tác vừa chuyển bổ sung bản đối chiếu số liệu điều chỉnh mới nhất. Để đảm bảo tính chuẩn xác và số liệu minh bạch tuyệt đối trước khi đệ trình lên Ban Giám đốc, em kính xin phép được dời thời hạn bàn giao thêm 02 ngày, cụ thể vào 17:00 ngày [Ngày mới].

Em xin gửi kèm theo đây bản dự thảo sơ bộ để Anh/Chị xem trước. Rất mong nhận được sự thông cảm và phê duyệt điều chỉnh từ Anh/Chị.

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
        {/* Subtle grid pattern with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        {/* Radial Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-b from-accent/20 via-brand-500/10 to-transparent blur-3xl opacity-60 rounded-full" />
      </div>

      <div className="container mx-auto px-section-x">
        <div className="mx-auto max-w-4xl text-center">
          {/* Notification Badge */}
          <Link
            href="/prompts"
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/80 bg-bg-surface/80 backdrop-blur-md shadow-xs hover:border-accent/50 hover:shadow-sm hover:scale-[1.02] transition-all mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-text-muted group-hover:text-text transition-colors">
              ✨ Cập nhật mới: <strong className="text-text font-semibold">80+ Câu lệnh AI dùng ngay &amp; Bộ công cụ chuyên sâu</strong>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* High-contrast 5-Second Value Proposition Heading */}
          <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-text text-balance mb-6 leading-[1.15]">
            Ứng dụng AI vào Công việc &amp; Cuộc sống <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent via-accent-500 to-brand-500 bg-clip-text text-transparent drop-shadow-xs">
              Dễ Hiểu, Dùng Được Ngay
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed text-balance">
            Kho 80+ câu lệnh tiếng Việt giúp người đi làm viết email, làm báo cáo, tóm tắt tài liệu trong 30 giây — tách riêng khu vực công cụ tính chi phí theo VNĐ, so sánh các dòng AI và thiết kế trợ lý tự động cho Lập trình viên &amp; Kỹ thuật.
          </p>

          {/* Direct Dual-Audience CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-6">
            <Link
              href="/prompts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-accent hover:bg-accent-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-fast"
            >
              <span>Dùng Ngay 80+ Câu Lệnh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#audience-heading"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-text bg-bg-surface/90 hover:bg-hover border border-border hover:border-brand-500/50 shadow-xs hover:-translate-y-0.5 transition-all duration-fast"
            >
              <Laptop className="w-4 h-4 text-brand-500" />
              <span>Khu Vực Kỹ Thuật &amp; Lập Trình</span>
            </a>
          </div>

          {/* Quick Search Trigger Bar */}
          <div className="max-w-md mx-auto mb-10">
            <button
              type="button"
              onClick={handleOpenSearch}
              className="w-full group flex items-center justify-between px-4 py-2.5 rounded-2xl bg-bg-surface/90 hover:bg-hover border border-border/80 hover:border-accent/50 shadow-xs hover:shadow-sm transition-all text-left text-sm"
              aria-label="Tìm kiếm nhanh toàn bộ kỹ năng, câu lệnh và công cụ"
            >
              <div className="flex items-center gap-2.5 text-text-muted group-hover:text-text min-w-0">
                <Search className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs sm:text-sm truncate">Tìm kiếm nhanh câu lệnh, công cụ, hướng dẫn...</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-text-muted bg-bg/80 border border-border rounded-md shadow-2xs">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Interactive Dual Preview Card */}
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-bg-surface shadow-2xl backdrop-blur-xl overflow-hidden text-left mb-0">
            {/* Tab Header Switcher */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('office')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    activePreviewTab === 'office'
                      ? 'bg-accent text-white shadow-xs'
                      : 'text-text-muted hover:text-text hover:bg-hover'
                  )}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Người đi làm (Xem trước kết quả)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('builder')}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    activePreviewTab === 'builder'
                      ? 'bg-brand-500 text-white shadow-xs'
                      : 'text-text-muted hover:text-text hover:bg-hover'
                  )}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Lập trình viên &amp; Kỹ thuật (Xem trước công cụ)</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Thực hành tức thì
                </span>
              </div>
            </div>

            {/* Tab 1 Content: Office Worker Preview */}
            {activePreviewTab === 'office' && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="rounded-xl border border-border bg-bg/60 p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent block mb-1">
                    Yêu cầu thực tế bạn cần:
                  </span>
                  <p className="text-xs sm:text-sm text-text font-medium">
                    &ldquo;Soạn email xin gia hạn nộp báo cáo kiểm toán thêm 2 ngày vì đối tác vừa gửi điều chỉnh số liệu mới.&rdquo;
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-bg p-4 text-xs sm:text-[13px] leading-relaxed text-text font-sans space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kết quả AI tạo ra hoàn chỉnh (Sao chép dùng ngay):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 transition-all shadow-xs"
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
                      Đặt sẵn vai trò, nguyên tắc an toàn và cách trả lời cố định cho mô hình AI (ChatGPT, Claude).
                    </p>
                    <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-bg-surface p-2.5 rounded-lg border border-border mt-1 space-y-1">
                      <div>&lt;vai_tro&gt;Chuyên gia thiết kế hệ thống nhiều kinh nghiệm&lt;/vai_tro&gt;</div>
                      <div>&lt;nguyen_tac&gt;Chỉ trả lời đúng sự thật, không tự bịa số liệu&lt;/nguyen_tac&gt;</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-bg p-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      Quy đổi chi phí độ dài chữ (Token) ra VNĐ
                    </span>
                    <p className="text-xs text-text-muted">
                      Ước tính cước sử dụng Claude 3.5 / GPT-4o theo tỷ giá thực tế (25.450 đ/USD):
                    </p>
                    <div className="font-mono text-[11px] text-accent bg-bg-surface p-2.5 rounded-lg border border-border mt-1 font-bold">
                      1.500 từ tiếng Việt ≈ 2.000 đơn vị chữ (token) ≈ 240 VNĐ
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">
                    Hỗ trợ tối ưu câu lệnh, ghi nhớ ngữ cảnh để giảm cước (Prompt Caching) và 14 mẫu Trợ lý AI chuyên trách.
                  </span>
                  <Link
                    href="/tools/system-prompt-builder"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-xs"
                  >
                    <span>Mở xưởng tạo chỉ dẫn AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
