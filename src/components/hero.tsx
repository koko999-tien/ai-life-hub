'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Brain, Target, Search, Command, Terminal, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function Hero() {
  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32" aria-labelledby="hero-heading">
      {/* Background Mesh & Grid Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle grid pattern with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        {/* Radial Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-b from-accent/20 via-brand-500/10 to-transparent blur-3xl opacity-60 rounded-full" />
      </div>

      <div className="container mx-auto px-section-x">
        <div className="mx-auto max-w-4xl text-center">
          {/* Interactive Radar Notification Badge */}
          <Link
            href="/playbooks"
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/80 bg-bg-surface/80 backdrop-blur-md shadow-xs hover:border-accent/50 hover:shadow-sm hover:scale-[1.02] transition-all mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-text-muted group-hover:text-text transition-colors">
              Mới cập nhật: <strong className="text-text font-semibold">10 Cẩm Nang Kỹ Thuật (Master Playbooks)</strong>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* High-contrast Typography Heading */}
          <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-text text-balance mb-6 leading-[1.15]">
            Khám phá, Thực hành &amp; Triển khai <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-accent via-accent-500 to-brand-500 bg-clip-text text-transparent drop-shadow-xs">
              Trí Tuệ Nhân Tạo
            </span>{' '}
            Đỉnh Cao
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed text-balance">
            Nền tảng tri thức mở toàn diện: 55 kỹ năng thực chiến, 14 kiến trúc AI Agent doanh nghiệp, 
            bộ công cụ System Prompt XML và cẩm nang kỹ thuật thực chiến từ 10 công trình kinh điển.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-accent hover:bg-accent-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-fast"
            >
              <span>Khám phá Danh mục</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-text bg-bg-surface/80 hover:bg-hover backdrop-blur-md border border-border hover:border-accent/40 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-fast"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Thử AI Playground</span>
            </Link>
          </div>

          {/* Raycast-style Search Trigger Bar */}
          <div className="max-w-md mx-auto mb-14">
            <button
              type="button"
              onClick={handleOpenSearch}
              className="w-full group flex items-center justify-between px-4 py-2.5 rounded-2xl bg-bg-surface/90 hover:bg-hover border border-border/80 hover:border-accent/50 shadow-xs hover:shadow-sm transition-all text-left text-sm"
              aria-label="Tìm kiếm nhanh toàn bộ 215 kỹ năng và tài nguyên"
            >
              <div className="flex items-center gap-2.5 text-text-muted group-hover:text-text min-w-0">
                <Search className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs sm:text-sm truncate">Tìm kiếm nhanh kỹ năng, prompt, agent...</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-text-muted bg-bg/80 border border-border rounded-md shadow-2xs">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Visual Showcase: Sleek IDE / AI Terminal Mockup */}
          <div className="relative mx-auto max-w-3xl rounded-2xl border border-border bg-bg-surface/95 shadow-2xl backdrop-blur-xl overflow-hidden text-left mb-16">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-text-muted flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  ai-orchestrator.ts — AI Life Hub Architecture
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Runtime Ready
                </span>
              </div>
            </div>

            {/* Code / Agent Terminal Preview */}
            <div className="p-4 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto space-y-2 bg-bg/40">
              <p className="text-text-muted">
                <span className="text-brand-500">const</span>{' '}
                <span className="text-accent font-semibold">agent</span> ={' '}
                <span className="text-brand-400">new</span> Agent({'{\n'}
                {'  '}role: <span className="text-emerald-500">&apos;Code Architect &amp; System Specialist&apos;</span>,{'\n'}
                {'  '}engine: <span className="text-emerald-500">&apos;Claude 3.5 Sonnet + CoT Synthesis&apos;</span>,{'\n'}
                {'  '}knowledgeBase: <span className="text-emerald-500">&apos;D:\\AI_Knowledge_Lab (10 Master Books)&apos;</span>{'\n'}
                {'}'});
              </p>
              <div className="pt-2 border-t border-border/60 text-text-muted">
                <span className="text-accent font-semibold">&gt; Executing workflow:</span>{' '}
                <span className="text-text font-medium">Auto-align WCAG AAA tokens &amp; SSG prerender 170 routes</span>
              </div>
              <div className="text-emerald-500 flex items-center gap-2">
                <span>✔ 170 static pages prerendered</span>
                <span className="text-text-subtle">|</span>
                <span>✔ 215 search index items mapped</span>
                <span className="text-text-subtle">|</span>
                <span>0 errors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid (Responsive: 1 col on mobile, 2 on sm, 3 on md) */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:max-w-4xl md:mx-auto" 
          role="list" 
          aria-label="Điểm mạnh chính của AI Life Hub"
        >
          <article className="rounded-2xl border border-border bg-bg-surface/80 p-6 text-center hover:border-accent/40 hover:shadow-card-hover transition-all group" role="listitem">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 group-hover:scale-110 transition-transform">
              <Brain className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-text mb-2 text-base">Kiến thức hệ thống</h3>
            <p className="text-sm text-text-muted leading-relaxed">16 danh mục chuyên ngành, 55 kỹ năng bài bản từ cơ bản đến chuyên sâu.</p>
          </article>

          <article className="rounded-2xl border border-border bg-bg-surface/80 p-6 text-center hover:border-accent/40 hover:shadow-card-hover transition-all group" role="listitem">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-text mb-2 text-base">Thực hành tức thì</h3>
            <p className="text-sm text-text-muted leading-relaxed">System Prompt Studio chuẩn XML, bộ tối ưu CoT và Sandbox chạy thử nghiệm.</p>
          </article>

          <article className="rounded-2xl border border-border bg-bg-surface/80 p-6 text-center hover:border-accent/40 hover:shadow-card-hover transition-all group sm:col-span-2 md:col-span-1" role="listitem">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-text mb-2 text-base">Hệ sinh thái thực chiến</h3>
            <p className="text-sm text-text-muted leading-relaxed">Kết nối trực tiếp các công trình và cẩm nang từ phòng lab thực tế tại ổ D.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
