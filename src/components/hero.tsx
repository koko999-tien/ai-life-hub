'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
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
  ChevronDown,
} from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { toast } from 'sonner';

// Cảnh 3D chỉ tải khi vào trang chủ, không làm chậm các trang khác.
const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-white/60">
      Đang tải hiệu ứng 3D…
    </div>
  ),
});

export function Hero() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax nhẹ theo cuộn trang kiểu PeachWeb: cảnh 3D trôi xuống,
  // nội dung mờ dần khi cuộn qua. Tắt hẳn khi prefers-reduced-motion.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.35]);

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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-950 pt-28 pb-14 text-white sm:pt-32 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      {/* Nền 3D: gradient pastel tĩnh (fallback) + canvas 3D + lớp tối mờ sau chữ */}
      <div className="absolute inset-0 -z-0" aria-hidden="true">
        <div className="peach-hero-bg absolute inset-0" />
        <motion.div
          style={reduceMotion ? undefined : { y: sceneY }}
          className="absolute inset-0"
        >
          <HeroScene
            scrollYProgress={reduceMotion ? undefined : scrollYProgress}
          />
        </motion.div>
        {/* Lớp tối mờ: chữ luôn đọc được dù cảnh 3D sáng hay bận */}
        <div className="hero-scrim absolute inset-0" />
      </div>

      <motion.div
        style={reduceMotion ? undefined : { opacity: contentOpacity }}
        className="container relative z-10 mx-auto px-section-x"
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Positioning Pill */}
          <Link
            href="/workspace"
            className="group mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 shadow-2xs backdrop-blur-md transition-all hover:border-white/40 hover:shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua-400" />
            </span>
            <span className="text-xs font-medium text-white/80 transition-colors group-hover:text-white">
              Mới:{' '}
              <strong className="font-semibold text-white">
                AI Workspace — soạn email, tóm tắt họp &amp; phân tích tài liệu ngay
                trên trình duyệt
              </strong>
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-aqua-300 transition-all group-hover:translate-x-0.5" />
          </Link>

          {/* Tiêu đề lớn, câu ngắn */}
          <h1
            id="hero-heading"
            className="mb-5 font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
          >
            AI không chỉ để trò chuyện. <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-peach-300 via-aqua-300 to-brand-300 bg-clip-text text-transparent">
              Hãy dùng AI để hoàn thành công việc.
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-balance text-white/75 sm:text-lg">
            Không gian làm việc AI tiếng Việt giúp người đi làm soạn email, tổng
            hợp biên bản họp và phân tích tài liệu ngay trên trình duyệt — đi kèm
            thư viện 80+ câu lệnh thực chiến và phòng công cụ kỹ thuật cho lập
            trình viên.
          </p>

          {/* 1 nút chính duy nhất + link phụ */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/workspace?workflow=email-assistant"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] transition-all duration-fast hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              <Play className="h-4 w-4" />
              <span>Bắt đầu — Soạn email đầu tiên</span>
            </Link>
          </div>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            <Link
              href="/prompts"
              className="inline-flex items-center gap-1 font-medium text-white/70 transition-colors hover:text-white"
            >
              <span>Khám phá thư viện AI</span>
              <ArrowRight className="h-3.5 w-3.5 text-aqua-300" />
            </Link>
            <Link
              href="/builder-lab"
              className="inline-flex items-center gap-1 font-medium text-white/70 transition-colors hover:text-white"
            >
              <span>Builder Lab cho Kỹ thuật</span>
            </Link>
            <a
              href="#cach-dung"
              className="inline-flex items-center gap-1 font-medium text-white/70 transition-colors hover:text-white"
            >
              <span>Chỉ 3 bước là xong ↓</span>
            </a>
          </div>

          {/* Quick Search Trigger Bar */}
          <div className="mx-auto mb-10 max-w-md">
            <button
              type="button"
              onClick={handleOpenSearch}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-left text-sm shadow-2xs backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-sm"
              aria-label="Tìm kiếm nhanh toàn bộ kỹ năng, câu lệnh và công cụ"
            >
              <div className="flex min-w-0 items-center gap-2.5 text-white/70 group-hover:text-white">
                <Search className="h-4 w-4 shrink-0 text-aqua-300" />
                <span className="truncate text-xs sm:text-sm">
                  Tìm công việc, mẫu câu lệnh, mô hình AI (có dấu hoặc không
                  dấu)...
                </span>
              </div>
              <div className="ml-2 flex shrink-0 items-center gap-1.5">
                <kbd className="inline-flex items-center gap-0.5 rounded-md border border-white/15 bg-navy-950/60 px-2 py-0.5 font-mono text-[10px] text-white/70 shadow-2xs">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Interactive Product Experience Preview Card — thẻ kính mờ */}
          <div className="glass-dark relative mx-auto max-w-3xl overflow-hidden rounded-3xl text-left shadow-2xl">
            {/* Preview Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-navy-950/40 px-4 py-3">
              <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white">
                <Briefcase className="h-3.5 w-3.5 text-aqua-300" />
                <span>Người đi làm (Trải nghiệm AI Workspace)</span>
              </span>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Làm việc thật trên trang
                </span>
              </div>
            </div>

            {/* AI Workspace Workflow Preview */}
            <div className="space-y-4 p-5 sm:p-6">
              {/* 3 Workspace Workflows Quick Launcher */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <Link
                  href="/workspace?workflow=email-assistant"
                  className="flex items-center gap-2.5 rounded-xl border border-accent/40 bg-accent/15 p-2.5 transition-colors hover:bg-accent/25"
                >
                  <Mail className="h-4 w-4 shrink-0 text-peach-300" />
                  <div className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">
                      Trợ lý Email AI
                    </span>
                    <span className="block truncate text-[11px] text-white/60">
                      Soạn, rút gọn, đổi ngôn ngữ
                    </span>
                  </div>
                </Link>
                <Link
                  href="/workspace?workflow=meeting-summary"
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 p-2.5 transition-colors hover:border-white/30"
                >
                  <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <div className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">
                      Tóm tắt Cuộc họp
                    </span>
                    <span className="block truncate text-[11px] text-white/60">
                      Quyết định &amp; đầu việc rõ ràng
                    </span>
                  </div>
                </Link>
                <Link
                  href="/workspace?workflow=document-analysis"
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 p-2.5 transition-colors hover:border-white/30"
                >
                  <FileSearch className="h-4 w-4 shrink-0 text-brand-300" />
                  <div className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">
                      Phân tích Tài liệu
                    </span>
                    <span className="block truncate text-[11px] text-white/60">
                      Trích xuất &amp; hỏi đáp bám sát
                    </span>
                  </div>
                </Link>
              </div>

              <div className="rounded-xl border border-white/10 bg-navy-950/40 p-3.5">
                <span className="mb-1 block text-[11px] font-semibold tracking-wider text-aqua-300 uppercase">
                  Ví dụ đầu vào công việc thực tế:
                </span>
                <p className="text-xs font-medium text-white sm:text-sm">
                  &ldquo;Soạn email xin gia hạn nộp báo cáo kiểm toán thêm 2 ngày
                  vì đối tác vừa gửi điều chỉnh số liệu mới.&rdquo;
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-white/10 bg-navy-950/40 p-4 font-sans text-xs leading-relaxed text-white sm:text-[13px]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Kết quả mẫu hoàn chỉnh:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-white/20"
                      aria-label="Sao chép email mẫu"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Đã sao chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Sao chép email</span>
                        </>
                      )}
                    </button>
                    <Link
                      href="/workspace?workflow=email-assistant"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <Play className="h-3 w-3" />
                      <span>Tạo bản của bạn</span>
                    </Link>
                  </div>
                </div>
                <pre className="font-sans text-xs leading-relaxed whitespace-pre-line text-white/70 sm:text-sm">
                  {sampleEmailText}
                </pre>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-white/60">
            Bạn là lập trình viên?{' '}
            <Link
              href="/builder-lab"
              className="font-semibold text-aqua-300 hover:underline"
            >
              Xem Builder Lab →
            </Link>
          </p>

          {/* Gợi ý cuộn xuống — kiểu PeachWeb "Scroll down & dive in" */}
          <div className="mt-10 flex justify-center">
            <a
              href="#cach-dung"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
            >
              Cuộn xuống để xem
              <ChevronDown className="h-4 w-4 animate-bounce text-aqua-300" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
