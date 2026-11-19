'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { DemoShape } from './Scene';

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-sm text-text-muted">
      Đang tải khung 3D...
    </div>
  ),
});

const COLORS = [
  { name: 'Cam', value: '#f97316' },
  { name: 'Xanh dương', value: '#0ea5e9' },
  { name: 'Xanh lá', value: '#10b981' },
  { name: 'Tím', value: '#8b5cf6' },
];

const SHAPES: { name: string; value: DemoShape }[] = [
  { name: 'Nút thắt', value: 'knot' },
  { name: 'Khối 20 mặt', value: 'ico' },
  { name: 'Vòng xuyến', value: 'torus' },
];

const CARDS = [
  {
    title: 'Chuyển động mượt',
    desc: 'Chữ và thẻ hiện ra lần lượt, có độ nảy nhẹ như lò xo, làm bằng Motion.',
  },
  {
    title: 'Vật thể 3D thật',
    desc: 'Khối 3D xoay liên tục, bấm đổi màu và đổi hình ngay, làm bằng React Three Fiber.',
  },
  {
    title: 'Nhẹ trên điện thoại',
    desc: 'Khung 3D chỉ tải khi mở trang này, không làm chậm các trang khác.',
  },
];

export default function Demo3DPage() {
  const [color, setColor] = useState(COLORS[0].value);
  const [shape, setShape] = useState<DemoShape>('knot');

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold uppercase tracking-widest text-accent"
        >
          Trang thử hiệu ứng
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-3 text-3xl sm:text-5xl font-bold"
        >
          Hiệu ứng chuyển động 3D
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-3 text-text-muted"
        >
          Bấm đổi màu, đổi hình bên dưới để xem vật thể 3D đổi theo ngay.
        </motion.p>
      </section>

      <section className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 16 }}
          className="h-[340px] sm:h-[420px] rounded-3xl border border-border bg-bg-elevated overflow-hidden"
        >
          <Scene color={color} shape={shape} />
        </motion.div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {COLORS.map((c) => (
            <motion.button
              key={c.value}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setColor(c.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                color === c.value
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-bg hover:border-accent/50'
              }`}
            >
              {c.name}
            </motion.button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {SHAPES.map((s) => (
            <motion.button
              key={s.value}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setShape(s.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                shape === s.value
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-bg hover:border-accent/50'
              }`}
            >
              {s.name}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 16 }}
              className="rounded-3xl border border-border bg-bg-elevated p-5"
            >
              <h2 className="font-bold">{card.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-semibold text-accent hover:underline">
            ← Về trang chủ
          </Link>
          <p className="mt-2 text-xs text-text-muted">
            Đây chỉ là trang thử hiệu ứng, chưa phải giao diện chính của web.
          </p>
        </div>
      </section>
    </div>
  );
}
