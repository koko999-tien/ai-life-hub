'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

/**
 * CTA cuối trang chủ — nền navy + gradient pastel (CSS, không dùng thêm
 * canvas 3D để giữ trang nhẹ). Từ "ngay" viết nghiêng có chân, kiểu
 * PeachWeb dùng cho từ "magic" ở CTA cuối của họ.
 */
export function HomeFinalCta() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20"
      aria-labelledby="final-cta-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="peach-hero-bg absolute inset-0" />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="container relative mx-auto px-section-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="final-cta-heading"
            className="font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl"
          >
            Bắt đầu làm việc với AI{' '}
            <em className="font-serif text-peach-300 italic">ngay</em> hôm nay.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Email đầu tiên chỉ mất chưa tới một phút. Không cần đăng ký, không
            cần biết code.
          </p>
        </Reveal>
        <Reveal
          delay={0.1}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/workspace?workflow=email-assistant"
            className="btn-motion inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
          >
            <Play className="h-4 w-4" />
            <span>Bắt đầu — Soạn email đầu tiên</span>
          </Link>
          <Link
            href="/prompts"
            className="btn-motion inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md hover:border-white/50 hover:bg-white/15 active:scale-[0.97]"
          >
            Khám phá thư viện AI
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
