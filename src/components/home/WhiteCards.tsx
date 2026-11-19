'use client';

import { motion } from 'motion/react';
import { MousePointerClick, Languages, Zap } from 'lucide-react';

const CARDS = [
  {
    icon: MousePointerClick,
    title: 'Dễ dùng',
    desc: 'Không cần học, mở ra là làm được ngay. Chọn việc, dán nội dung, bấm Tạo ngay — không có màn hình rối.',
    accent: 'bg-accent/10 text-accent',
  },
  {
    icon: Languages,
    title: 'Tiếng Việt thật',
    desc: 'Câu lệnh và kết quả đều viết bằng tiếng Việt tự nhiên, đúng văn phong công sở Việt Nam — không phải bản dịch máy.',
    accent: 'bg-aqua-500/10 text-aqua-500',
  },
  {
    icon: Zap,
    title: 'Chạy ngay',
    desc: 'Không cần cài đặt, không cần đăng ký. Chạy trực tiếp trên trình duyệt, kết quả có trong chưa tới một phút.',
    accent: 'bg-brand-500/10 text-brand-500',
  },
];

/**
 * 3 thẻ ngang trên nền trắng kiểu PeachWeb (mục Award/Trend/Scalable của họ):
 * một khoảng sáng giữa các section tối, chữ navy đậm, dễ đọc.
 */
export function WhiteCards() {
  return (
    <section
      className="bg-white py-16 text-navy-950 sm:py-20"
      aria-labelledby="vi-sao-heading"
    >
      <div className="container mx-auto px-section-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Vì sao chọn AI Life Hub
          </p>
          <h2
            id="vi-sao-heading"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Làm việc với AI, không cần học AI
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: i * 0.1,
                  type: 'spring',
                  stiffness: 120,
                  damping: 16,
                }}
                className="rounded-3xl border border-navy-950/10 bg-navy-950/[0.03] p-6 shadow-sm"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-950/70">
                  {card.desc}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
