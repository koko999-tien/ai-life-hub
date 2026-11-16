'use client';

import { ArrowRight, Sparkles, Zap, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36" aria-labelledby="hero-heading">
      <div className="container-main">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Phiên bản 2.0 — Mới ra mắt: Prompt Builder & Agent Templates</span>
          </div>

          <h1 id="hero-heading" className="heading-1 text-balance mb-6 animate-slide-up stagger-1">
            Khám phá, Học tập & Triển khai <br />
            <span className="gradient-text">AI cho cuộc sống</span>
          </h1>

          <p className="text-fluid-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
            Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI
            vào công việc và cuộc sống hàng ngày. Từ người mới bắt đầu đến chuyên gia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Button size="lg" asChild>
              <a href="/category/prompt-engineering">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/category">Xem danh mục</a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-500 animate-fade-in stagger-4">
            Mẹo: Nhấn <kbd className="px-2 py-0.5 font-mono bg-gray-100 dark:bg-gray-800 rounded">⌘K</kbd> để tìm kiếm tức thì
          </p>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 md:max-w-4xl md:mx-auto animate-slide-up stagger-5" role="list" aria-label="Điểm mạnh chính">
          <article className="card p-6 text-center group" role="listitem">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <Brain className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Kiến thức hệ thống</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">8 danh mục, 50+ kỹ năng được curate bởi chuyên gia AI</p>
          </article>

          <article className="card p-6 text-center group" role="listitem">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Thực hành ngay</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Prompt Builder, Agent Templates, ví dụ có thể copy-paste</p>
          </article>

          <article className="card p-6 text-center group" role="listitem">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tài nguyên chất lượng</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bài viết, khóa học, công cụ, paper được kiểm duyệt kỹ lưỡng</p>
          </article>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/10 blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
}