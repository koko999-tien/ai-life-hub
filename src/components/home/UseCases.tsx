'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Terminal,
  GraduationCap,
  Palette,
} from 'lucide-react';
import { Reveal, RevealCard } from '@/components/motion/Reveal';

const CASES = [
  {
    icon: Briefcase,
    title: 'Văn phòng',
    desc: 'Soạn email, tóm tắt họp, phân tích tài liệu — việc hằng ngày xong nhanh hơn, đúng văn phong công sở.',
    href: '/workspace',
    linkText: 'Mở AI Workspace',
    offset: 'lg:mt-0',
  },
  {
    icon: Terminal,
    title: 'Lập trình',
    desc: 'So sánh mô hình, tính chi phí token, soạn system prompt — công cụ kỹ thuật có nguồn kiểm chứng.',
    href: '/builder-lab',
    linkText: 'Vào Builder Lab',
    offset: 'lg:mt-10',
  },
  {
    icon: GraduationCap,
    title: 'Học tập',
    desc: 'Tóm tắt bài giảng, giải thích khái niệm khó, luyện câu lệnh tiếng Việt qua bộ quiz ngắn.',
    href: '/prompts',
    linkText: 'Xem thư viện câu lệnh',
    offset: 'lg:mt-20',
  },
  {
    icon: Palette,
    title: 'Sáng tạo',
    desc: 'Lên ý tưởng nội dung, viết nháp bài đăng, biến một ý tưởng thành nhiều phiên bản khác nhau.',
    href: '/workspace',
    linkText: 'Mở AI Workspace',
    offset: 'lg:mt-28',
  },
];

/**
 * Use Cases: 4 thẻ xếp so le theo đường chéo, trên nền navy phẳng.
 * Đã bỏ các khối màu pastel trôi (trang trí thừa, không giúp đọc nội dung)
 * và kính mờ — thẻ dùng nền đặc, viền mờ.
 */
export function UseCases() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20"
      aria-labelledby="use-cases-heading"
    >
      <div className="container relative mx-auto px-section-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-aqua-300 uppercase">
            Dùng cho ai
          </p>
          <h2
            id="use-cases-heading"
            className="mt-2 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl"
          >
            Bốn nhóm người dùng
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Dù bạn làm văn phòng, viết code, đang học hay làm nội dung — đều
            có sẵn một lối vào riêng.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <RevealCard
                key={useCase.title}
                delay={i * 0.06}
                shadow="0 16px 40px -12px rgba(0, 0, 0, 0.35)"
                className={`rounded-3xl border border-white/10 bg-white/5 p-6 ${useCase.offset}`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-aqua-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {useCase.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  {useCase.desc}
                </p>
                <Link
                  href={useCase.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-aqua-300 transition-colors hover:text-white"
                >
                  {useCase.linkText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </RevealCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
