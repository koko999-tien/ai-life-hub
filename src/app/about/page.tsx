import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  Code2, 
  HeartHandshake, 
  Terminal,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Giới thiệu về AI Life Hub | Sứ mệnh & Kiến trúc',
  description: 'AI Life Hub là nền tảng tri thức, thư viện kỹ năng và công cụ thực hành AI hàng đầu Việt Nam cho lập trình viên và người dùng hiện đại.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-section-x py-16 max-w-5xl">
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
          AI Life Hub được xây dựng với mục tiêu dân chủ hóa kỹ năng Prompt Engineering, Multi-Agent System và công cụ AI thực chiến cho cộng đồng người Việt và quốc tế.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card p-6 bg-bg-surface border-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Thực chiến & Sẵn sàng chạy</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Mọi prompt, kỹ năng và agent blueprint trên nền tảng đều được kiểm nghiệm thực tế trên các model hàng đầu (Claude 3.5, GPT-4o, DeepSeek), có thể copy và áp dụng ngay trong công việc hàng ngày.
          </p>
        </div>

        <div className="card p-6 bg-bg-surface border-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Bảo mật & Quyền riêng tư</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Kiến trúc Local-First và Client-Side Execution. Mọi tương tác trong Playground, Token Calculator và Prompt Optimizer diễn ra ngay tại trình duyệt của bạn, không thu thập prompt cá nhân.
          </p>
        </div>

        <div className="card p-6 bg-bg-surface border-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Cộng đồng & Mã nguồn mở</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Được phát triển mở, minh bạch và gắn kết với cộng đồng. Bất kỳ ai cũng có thể đóng góp prompt mẫu, đánh giá kỹ năng và mở rộng kho tài nguyên chung.
          </p>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card p-8 bg-bg-surface border-border mb-16 space-y-6">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Code2 className="w-6 h-6 text-accent" />
          Kiến trúc Công nghệ Hiện đại (Tech Stack)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">Next.js 14</strong>
            <span className="text-xs text-text-muted">App Router & 100% SSG</span>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">TypeScript</strong>
            <span className="text-xs text-text-muted">Type-safe End-to-End</span>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">Supabase</strong>
            <span className="text-xs text-text-muted">Database & RLS Security</span>
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <strong className="block text-text font-bold text-lg">Tailwind CSS</strong>
            <span className="text-xs text-text-muted">Dark/Light Modern Design</span>
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
            Xem Bảng So Sánh Model 2026
          </Link>
        </div>
      </div>
    </div>
  );
}
