'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Brand motion identity (motion-design skill, đã chốt 2026-11-19):
 * - Archetype: calm + premium.
 * - Easing chữ ký: cubic-bezier(0.2, 0, 0.2, 1), dùng cho 80% hiệu ứng.
 * - Thời lượng: nhanh 150ms / chuẩn 300ms / chậm 600ms.
 * - Kiểu vào màn duy nhất: fade + trồi lên 24px, ease-out.
 *
 * Reveal: khối tiêu đề/mục của section.
 * RevealCard: thẻ — thẻ vào trước (fade + trồi 24px, 300ms), bóng đổ
 * xuất hiện sau thẻ 50ms (follow-through), nội dung trong thẻ fade + trồi
 * nhẹ sau thẻ 100ms. Stagger 50-80ms, tổng <500ms.
 * Cả hai đều trả về nội dung tĩnh khi prefers-reduced-motion.
 */

export const EASE_SIGNATURE: [number, number, number, number] = [
  0.2, 0, 0.2, 1,
];

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay, ease: EASE_SIGNATURE }}
    >
      {children}
    </motion.div>
  );
}

/** Bóng đổ lúc đầu: cùng cấu trúc với bóng cuối nhưng mọi alpha = 0,
 *  để Motion nội suy box-shadow mà không bị nhảy. */
function transparentShadow(shadow: string): string {
  return shadow.replace(/rgba?\(([^)]+)\)/g, (_m, inner) => {
    const parts = inner.split(',').map((s: string) => s.trim());
    if (parts.length === 4) return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 0)`;
    return `rgba(${parts.join(', ')}, 0)`;
  });
}

export function RevealCard({
  children,
  delay = 0,
  className,
  innerClassName,
  shadow,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  innerClassName?: string;
  /** Bóng đổ cuối cùng của thẻ; lúc đầu cùng cấu trúc nhưng alpha 0. */
  shadow: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <article className={className} style={{ boxShadow: shadow }}>
        {children}
      </article>
    );
  }
  return (
    <motion.article
      className={className}
      initial={{
        opacity: 0,
        y: 24,
        boxShadow: transparentShadow(shadow),
      }}
      whileInView={{ opacity: 1, y: 0, boxShadow: shadow }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.3,
        delay,
        ease: EASE_SIGNATURE,
        boxShadow: { duration: 0.3, delay: delay + 0.05, ease: EASE_SIGNATURE },
      }}
    >
      <motion.div
        className={innerClassName}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.3, delay: delay + 0.1, ease: EASE_SIGNATURE }}
      >
        {children}
      </motion.div>
    </motion.article>
  );
}
