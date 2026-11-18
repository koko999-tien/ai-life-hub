import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Giới thiệu về AI Life Hub',
  description:
    'AI Life Hub tổng hợp câu lệnh AI dùng ngay cho người đi làm và bộ công cụ chuyên sâu dễ hiểu dành cho lập trình viên Việt Nam.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Giới thiệu về AI Life Hub | AI Life Hub',
    description:
      'AI Life Hub tổng hợp câu lệnh AI dùng ngay cho người đi làm và bộ công cụ chuyên sâu dễ hiểu dành cho lập trình viên Việt Nam.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16 max-w-5xl">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Về Chúng Tôi</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-text tracking-tight">
          Kiến tạo cầu nối giữa Con người và Trí tuệ Nhân tạo
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          AI Life Hub giúp mọi người — từ nhân viên văn phòng, học sinh đến lập trình viên — ứng dụng AI dễ dàng vào công việc hàng ngày bằng tiếng Việt tự nhiên, không rào cản kỹ thuật.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card p-6 bg-bg-surface border-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Thực chiến &amp; Dùng được ngay</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Mọi câu lệnh mẫu, hướng dẫn kỹ năng và mẫu trợ lý AI đều đã được kiểm nghiệm thực tế trên ChatGPT, Claude, Gemini và DeepSeek — bạn chỉ cần sao chép và dán để sử dụng ngay mỗi ngày.
          </p>
        </div>

        <div className="card p-6 bg-bg-surface border-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Bảo mật &amp; Quyền riêng tư</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Các công cụ như Khu thử nghiệm AI, Bảng tính chi phí sử dụng AI và Trình tối ưu câu lệnh đều chạy trực tiếp trên trình duyệt của bạn, không gửi hay thu thập dữ liệu câu lệnh riêng tư.
          </p>
        </div>

        <div className="card p-6 bg-bg-surface border-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Cộng đồng &amp; Mã nguồn mở</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Được phát triển mở, minh bạch và gắn kết với cộng đồng. Bất kỳ ai cũng có thể đóng góp câu lệnh mẫu, đánh giá hướng dẫn kỹ năng và mở rộng kho tài nguyên chung.
          </p>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card p-8 bg-bg-surface border-border mb-16 space-y-6">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Code2 className="w-6 h-6 text-accent" />
          Nền tảng Công nghệ Phía Sau
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">Next.js 14</strong>
            <span className="text-xs text-text-muted">Tải trang siêu nhanh &amp; tối ưu tìm kiếm</span>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">TypeScript</strong>
            <span className="text-xs text-text-muted">Mã nguồn chặt chẽ, hạn chế lỗi</span>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">Supabase</strong>
            <span className="text-xs text-text-muted">Lưu trữ an toàn &amp; phân quyền dữ liệu</span>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">Tailwind CSS</strong>
            <span className="text-xs text-text-muted">Hỗ trợ Giao diện Sáng / Tối</span>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-text">Sẵn sàng nâng cấp hiệu suất làm việc với AI?</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/categories"
            className="py-3 px-6 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover shadow-md transition-all flex items-center gap-2"
          >
            Khám phá 55+ Kỹ năng AI
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/compare"
            className="py-3 px-6 rounded-xl border border-border bg-bg hover:bg-hover text-text font-semibold text-sm transition-all"
          >
            Xem Bảng So Sánh Các AI
          </Link>
        </div>
      </div>
    </div>
  );
}
