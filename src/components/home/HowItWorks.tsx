'use client';

import { MousePointerClick, ClipboardPaste, Sparkles } from 'lucide-react';
import { Reveal, RevealCard } from '@/components/motion/Reveal';

const STEPS = [
  {
    number: '1',
    icon: MousePointerClick,
    title: 'Chọn việc cần làm',
    desc: 'Soạn email, tóm tắt họp hay phân tích tài liệu — chọn đúng việc, không cần học cách dùng.',
  },
  {
    number: '2',
    icon: ClipboardPaste,
    title: 'Dán nội dung của bạn',
    desc: 'Dán email, biên bản hay tài liệu vào, điền vài thông tin ngắn là xong.',
  },
  {
    number: '3',
    icon: Sparkles,
    title: 'Bấm Tạo ngay, nhận kết quả',
    desc: 'Kết quả viết bằng tiếng Việt, sao chép dùng luôn hoặc chỉnh lại theo ý bạn.',
  },
];

/**
 * 3 bước dùng — chỉ xuất hiện 1 lần duy nhất trên trang chủ
 * (PeachWeb lặp lại 2 lần, gây rối — không học theo).
 */
export function HowItWorks() {
  return (
    <section
      id="cach-dung"
      className="scroll-mt-28 py-16 sm:py-20"
      aria-labelledby="cach-dung-heading"
    >
      <div className="container mx-auto px-section-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Cách dùng
          </p>
          <h2
            id="cach-dung-heading"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-text text-balance sm:text-4xl"
          >
            Chỉ 3 bước là xong
          </h2>
          <p className="mt-3 text-base text-text-muted">
            Không cần biết code, không cần học câu lệnh dài. Việc của bạn chỉ
            là nói rõ mình cần gì.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <RevealCard
                key={step.number}
                delay={i * 0.07}
                shadow="inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 12px 28px -8px rgba(0, 0, 0, 0.18)"
                className="glass-card relative rounded-3xl p-6"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {step.number}
                </span>
                <Icon className="mt-4 h-6 w-6 text-accent" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-text">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {step.desc}
                </p>
              </RevealCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
