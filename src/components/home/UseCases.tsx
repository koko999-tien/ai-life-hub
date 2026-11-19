'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  Terminal,
  GraduationCap,
  Palette,
} from 'lucide-react';

const CASES = [
  {
    icon: Briefcase,
    title: 'Văn phòng',
    desc: 'Soạn email, tóm tắt họp, phân tích tài liệu — việc hằng ngày xong nhanh hơn, đúng văn phong công sở.',
    href: '/workspace',
    linkText: 'Mở AI Workspace',
    offset: 'lg:mt-0',
    orb: 'bg-peach-400/25',
  },
  {
    icon: Terminal,
    title: 'Lập trình',
    desc: 'So sánh mô hình, tính chi phí token, soạn system prompt — công cụ kỹ thuật có nguồn kiểm chứng.',
    href: '/builder-lab',
    linkText: 'Vào Builder Lab',
    offset: 'lg:mt-10',
    orb: 'bg-aqua-400/25',
  },
  {
    icon: GraduationCap,
    title: 'Học tập',
    desc: 'Tóm tắt bài giảng, giải thích khái niệm khó, luyện câu lệnh tiếng Việt qua bộ quiz ngắn.',
    href: '/prompts',
    linkText: 'Xem thư viện câu lệnh',
    offset: 'lg:mt-20',
    orb: 'bg-brand-400/25',
  },
  {
    icon: Palette,
    title: 'Sáng tạo',
    desc: 'Lên ý tưởng nội dung, viết nháp bài đăng, biến một ý tưởng thành nhiều phiên bản khác nhau.',
    href: '/workspace',
    linkText: 'Thử ngay',
    offset: 'lg:mt-28',
    orb: 'bg-peach-300/25',
  },
];

/**
 * Use Cases kiểu PeachWeb: 4 thẻ kính mờ xếp so le theo đường chéo,
 * khối màu pastel trôi phía sau (CSS, không thêm canvas 3D để giữ trang nhẹ).
 */
export function UseCases() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20"
      aria-labelledby="use-cases-heading"
    >
      {/* Khối màu pastel trôi — nền cho thẻ kính mờ */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="animate-drift absolute top-10 left-[8%] h-64 w-64 rounded-full bg-peach-400/20 blur-3xl" />
        <div
          className="animate-drift absolute right-[10%] bottom-16 h-72 w-72 rounded-full bg-aqua-400/20 blur-3xl"
          style={{ animationDelay: '-3s' }}
        />
        <div
          className="animate-drift absolute top-1/2 left-1/2 h-56 w-56 rounded-full bg-brand-400/20 blur-3xl"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <div className="container relative mx-auto px-section-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-aqua-300 uppercase">
            Dùng cho ai
          </p>
          <h2
            id="use-cases-heading"
            className="mt-2 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl"
          >
            Một nơi, nhiều cách dùng
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Dù bạn làm văn phòng, viết code, đang học hay làm nội dung — đều
            có sẵn một lối vào riêng.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <motion.article
                key={useCase.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: i * 0.08,
                  type: 'spring',
                  stiffness: 120,
                  damping: 16,
                }}
                className={`glass-dark rounded-3xl p-6 ${useCase.offset}`}
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
