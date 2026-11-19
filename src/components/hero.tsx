'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Search,
  Command,
  Briefcase,
  Play,
  Mail,
  FileCheck2,
  FileSearch,
  ChevronDown,
  Lock,
} from 'lucide-react';
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

// Cảnh 3D chỉ tải khi vào trang chủ, không làm chậm các trang khác.
// Trong lúc chờ, hiện skeleton shimmer trên nền gradient tĩnh đã có sẵn
// phía sau (không để trống như chữ "Đang tải hiệu ứng 3D…" trước đây).
const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      className="relative h-full overflow-hidden"
      role="status"
      aria-label="Đang tải hiệu ứng 3D"
    >
      <div className="absolute top-[28%] left-[18%] h-40 w-40 rounded-full bg-peach-400/20 blur-3xl" />
      <div className="absolute right-[16%] bottom-[22%] h-48 w-48 rounded-full bg-aqua-400/20 blur-3xl" />
      <div className="animate-shimmer shimmer-sweep absolute inset-0" />
      <span className="sr-only">Đang tải hiệu ứng 3D…</span>
    </div>
  ),
});

const CTA_HREF = '/workspace?workflow=email-assistant';

/**
 * Hero kiểu PeachWeb lần 2: một đoạn cuộn dài GHIM màn hình (pinned,
 * scroll-driven), chia 3 giai đoạn XẾP NỐI TIẾP theo tiến độ cuộn:
 *  1. Tiêu đề lớn + 1 CTA chính (ra hẳn ở 0.30).
 *  2. Tiêu đề đổi ("Không cần biết code."), camera 3D tiến vào cảnh
 *     (vào ở 0.32, ra hẳn ở 0.64).
 *  3. Khung trình duyệt mẫu chứa Workspace hiện ra trong cảnh (vào ở 0.66).
 * Chữ trên nền 3D luôn có lớp tối mờ sau chữ; thẻ xem trước dùng nền đặc
 * (không kính mờ) để bong bóng tím không làm mờ chữ mẫu — sửa lỗi lần 1.
 * Tôn trọng prefers-reduced-motion: hiển thị bản tĩnh, không ghim cuộn.
 */

const EASE_SIGNATURE: [number, number, number, number] = [0.2, 0, 0.2, 1];
// Cùng đường cong chữ ký nhưng dạng hàm easing, để dùng cho useTransform
// (TransformOptions.ease chỉ nhận EasingFunction).
const EASE_SIGNATURE_FN = cubicBezier(0.2, 0, 0.2, 1);

/**
 * Một nhịp vào màn trong hero: fade + trồi 24px, 300ms, easing chữ ký.
 * Khi reduced-motion thì hiện tĩnh. Các nhịp cách nhau 70ms, tổng
 * stagger 420ms (<500ms theo skill); hero dẫn đầu, phần tử phụ vào sau.
 */
function Rise({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: EASE_SIGNATURE }}
    >
      {children}
    </motion.div>
  );
}

function HeroIntro() {
  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <div className="mx-auto max-w-4xl px-section-x text-center">
      {/* Top Positioning Pill */}
      <Rise delay={0}>
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
      </Rise>

      {/* Tiêu đề lớn, câu ngắn */}
      <Rise delay={0.07}>
      <h1
        id="hero-heading"
        className="mb-5 font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
      >
        AI không chỉ để trò chuyện. <br className="hidden sm:inline" />
        <span className="bg-linear-to-r from-peach-300 via-aqua-300 to-brand-300 bg-clip-text text-transparent">
          Hãy dùng AI để hoàn thành công việc.
        </span>
      </h1>
      </Rise>

      <Rise delay={0.14}>
      <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-balance text-white/75 sm:text-lg">
        Không gian làm việc AI tiếng Việt giúp người đi làm soạn email, tổng
        hợp biên bản họp và phân tích tài liệu ngay trên trình duyệt — đi kèm
        thư viện 80+ câu lệnh thực chiến và phòng công cụ kỹ thuật cho lập
        trình viên.
      </p>
      </Rise>

      {/* 1 nút chính duy nhất + link phụ */}
      <Rise delay={0.21}>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={CTA_HREF}
          className="btn-motion inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
        >
          <Play className="h-4 w-4" />
          <span>Bắt đầu — Soạn email đầu tiên</span>
        </Link>
      </div>
      </Rise>
      <Rise delay={0.28}>
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
      </Rise>

      {/* Quick Search Trigger Bar */}
      <Rise delay={0.35}>
      <div className="mx-auto mb-8 max-w-md">
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
      </Rise>

      {/* Gợi ý cuộn xuống — kiểu PeachWeb "Scroll down & dive in" */}
      <Rise delay={0.42}>
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md">
          Cuộn xuống để xem
          <ChevronDown className="h-4 w-4 animate-bounce text-aqua-300" />
        </span>
      </div>
      </Rise>
    </div>
  );
}

/**
 * Khung trình duyệt mẫu chứa Workspace — hiện ở cuối hero ghim.
 * Nền ĐẶC (bg-navy-950) để chữ luôn đọc được, không bị bong bóng 3D
 * làm mờ như bản lần 1.
 */
function WorkspaceMockup() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-navy-950 text-left shadow-2xl">
      {/* Thanh trình duyệt */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-navy-900/80 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-peach-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-aqua-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70">
          <Lock className="h-3 w-3 text-aqua-300" />
          ai-life-hub-omega.vercel.app/workspace
        </span>
        <span className="hidden items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-300 sm:inline-flex">
          Làm việc thật trên trang
        </span>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {/* 3 quy trình Workspace */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Link
            href="/workspace?workflow=email-assistant"
            className="flex items-center gap-2.5 rounded-xl border border-accent/40 bg-accent/15 p-2.5 transition-colors hover:bg-accent/25"
          >
            <Mail className="h-4 w-4 shrink-0 text-peach-300" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold text-white">
                Trợ lý Email AI
              </span>
              <span className="block truncate text-[11px] text-white/60">
                Soạn, rút gọn, đổi ngôn ngữ
              </span>
            </span>
          </Link>
          <Link
            href="/workspace?workflow=meeting-summary"
            className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 p-2.5 transition-colors hover:border-white/30"
          >
            <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold text-white">
                Tóm tắt Cuộc họp
              </span>
              <span className="block truncate text-[11px] text-white/60">
                Quyết định &amp; đầu việc rõ ràng
              </span>
            </span>
          </Link>
          <Link
            href="/workspace?workflow=document-analysis"
            className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 p-2.5 transition-colors hover:border-white/30"
          >
            <FileSearch className="h-4 w-4 shrink-0 text-brand-300" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold text-white">
                Phân tích Tài liệu
              </span>
              <span className="block truncate text-[11px] text-white/60">
                Trích xuất &amp; hỏi đáp bám sát
              </span>
            </span>
          </Link>
        </div>

        {/* Ví dụ đầu vào */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
          <span className="mb-1 block text-[11px] font-semibold tracking-wider text-aqua-300 uppercase">
            Ví dụ đầu vào công việc thực tế:
          </span>
          <p className="text-xs font-medium text-white sm:text-sm">
            &ldquo;Soạn email xin gia hạn nộp báo cáo kiểm toán thêm 2 ngày vì
            đối tác vừa gửi điều chỉnh số liệu mới.&rdquo;
          </p>
        </div>

        {/* Kết quả mẫu rút gọn */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Kết quả mẫu:
          </span>
          <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
            &ldquo;Kính gửi Anh/Chị, em viết email này để cập nhật tiến độ Báo
            cáo Kiểm toán Quý vừa qua. Để đảm bảo số liệu chuẩn xác trước khi
            trình Ban Giám đốc, em xin dời thời hạn bàn giao thêm 02 ngày…&rdquo;
          </p>
          <Link
            href={CTA_HREF}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Play className="h-3 w-3" />
            Tạo bản của bạn
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [mockActive, setMockActive] = useState(false);

  // Hero ghim dài 320vh; sticky 100svh. Các giai đoạn XẾP NỐI TIẾP, không
  // chồng nhau (sửa lỗi lần 2: hai tiêu đề chồng nhau thoáng qua khi đổi
  // giai đoạn): giai đoạn 1 ra hẳn ở 0.30 rồi giai đoạn 2 mới vào ở 0.32;
  // giai đoạn 2 ra hẳn ở 0.64 rồi khung mẫu mới vào ở 0.66. Mọi chuyển đổi
  // dùng easing chữ ký (giảm tốc), cùng họ với reveal của các section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.3],
    [1, 1, 0],
    { ease: EASE_SIGNATURE_FN }
  );
  const introY = useTransform(scrollYProgress, [0, 0.3], [0, -60], {
    ease: EASE_SIGNATURE_FN,
  });
  const midOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.42, 0.56, 0.64],
    [0, 1, 1, 0],
    { ease: EASE_SIGNATURE_FN }
  );
  const midY = useTransform(
    scrollYProgress,
    [0.32, 0.42, 0.56, 0.64],
    [40, 0, 0, -40],
    { ease: EASE_SIGNATURE_FN }
  );
  const mockOpacity = useTransform(scrollYProgress, [0.66, 0.78], [0, 1], {
    ease: EASE_SIGNATURE_FN,
  });
  const mockY = useTransform(scrollYProgress, [0.66, 0.78], [80, 0], {
    ease: EASE_SIGNATURE_FN,
  });
  const mockScale = useTransform(scrollYProgress, [0.66, 0.78], [0.94, 1], {
    ease: EASE_SIGNATURE_FN,
  });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Khung mẫu chỉ nhận click khi đã hiện rõ, tránh chặn link ở giai đoạn 1.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setMockActive(v > 0.72);
  });

  // Reduced motion: bản tĩnh, không ghim cuộn, không canvas 3D.
  if (reduceMotion) {
    return (
      <section
        className="relative overflow-hidden bg-navy-950 pt-28 pb-14 text-white sm:pt-32"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div className="peach-hero-bg absolute inset-0" />
          <div className="hero-scrim absolute inset-0" />
        </div>
        <div className="relative z-10">
          <HeroIntro />
          <div className="mt-12 px-section-x">
            <WorkspaceMockup />
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
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[320vh] bg-navy-950 text-white"
      aria-labelledby="hero-heading"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Nền 3D: gradient pastel tĩnh (fallback) + canvas 3D + lớp tối mờ */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="peach-hero-bg absolute inset-0" />
          <motion.div style={{ scale: sceneScale }} className="absolute inset-0">
            <HeroScene scrollYProgress={scrollYProgress} />
          </motion.div>
          {/* Lớp tối mờ: chữ luôn đọc được dù cảnh 3D sáng hay bận */}
          <div className="hero-scrim absolute inset-0" />
        </div>

        {/* Giai đoạn 1: tiêu đề + 1 CTA chính */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="relative z-10 m-auto w-full py-20"
        >
          <HeroIntro />
        </motion.div>

        {/* Giai đoạn 2: tiêu đề đổi, camera tiến vào cảnh */}
        <motion.div
          style={{ opacity: midOpacity, y: midY }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-section-x"
          aria-hidden="true"
        >
          <div className="max-w-4xl text-center">
            <h2 className="font-display text-5xl leading-[1.05] font-extrabold tracking-tight text-balance text-white sm:text-7xl">
              Không cần biết{' '}
              <span className="bg-linear-to-r from-peach-300 via-aqua-300 to-brand-300 bg-clip-text text-transparent">
                code.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Chọn việc, dán nội dung, bấm Tạo ngay — kết quả tiếng Việt trong
              chưa tới một phút.
            </p>
          </div>
        </motion.div>

        {/* Giai đoạn 3: khung trình duyệt mẫu chứa Workspace */}
        <motion.div
          style={{ opacity: mockOpacity, y: mockY, scale: mockScale }}
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-section-x py-16 ${
            mockActive ? '' : 'pointer-events-none'
          }`}
        >
          <p className="text-center text-xs font-semibold tracking-widest text-aqua-300 uppercase">
            Thử ngay trong trình duyệt của bạn
          </p>
          <WorkspaceMockup />
          <Link
            href={CTA_HREF}
            className="btn-motion inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
          >
            <Play className="h-4 w-4" />
            <span>Bắt đầu — Soạn email đầu tiên</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
