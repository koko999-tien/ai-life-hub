'use client';

import { useEffect, useRef, useState } from 'react';
import { Target, BookOpen, Code2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorKey: 'brand' | 'accent' | 'success' | 'warning';
  delay?: number;
}

const stats: Stat[] = [
  { label: 'Lĩnh vực ứng dụng', value: 16, icon: BookOpen, colorKey: 'brand', delay: 0 },
  { label: 'Kỹ năng hướng dẫn chi tiết', value: 55, icon: Code2, colorKey: 'accent', delay: 100 },
  { label: 'Câu lệnh mẫu dùng ngay', value: 80, suffix: '+', icon: Target, colorKey: 'success', delay: 200 },
  { label: 'Tài liệu & mẫu tra cứu', value: 215, icon: Database, colorKey: 'warning', delay: 300 },
];

const colorStyles = {
  brand: {
    bg: 'bg-brand-500/10 dark:bg-brand-500/15',
    text: 'text-brand-600 dark:text-brand-400',
    border: 'border-brand-500/20',
  },
  accent: {
    bg: 'bg-accent/10 dark:bg-accent/15',
    text: 'text-accent',
    border: 'border-accent/20',
  },
  success: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  warning: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
};

export function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-border bg-bg-surface/50 backdrop-blur-xs py-12 lg:py-16"
      aria-labelledby="stats-heading"
    >
      <div className="container mx-auto px-section-x">
        <h2 id="stats-heading" className="sr-only">
          Thống kê nền tảng AI Life Hub
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {stats.map((stat) => {
            const style = colorStyles[stat.colorKey];
            return (
              <div
                key={stat.label}
                className="text-center group"
              >
                <div
                  className={cn(
                    'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-700 ease-out group-hover:scale-110',
                    style.bg,
                    style.border,
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  )}
                  aria-hidden="true"
                >
                  <stat.icon className={cn('h-7 w-7', style.text)} />
                </div>
                <div
                  className={cn(
                    'font-mono font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight transition-all duration-700',
                    style.text,
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                >
                  <AnimatedCounter
                    end={stat.value}
                    duration={1800}
                    isVisible={isVisible}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({
  end,
  duration = 2000,
  isVisible,
  suffix = '',
}: {
  end: number;
  duration?: number;
  isVisible: boolean;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * (end - startValue) + startValue);

      setCount(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, isVisible]);

  return (
    <span aria-live="polite" aria-atomic="true">
      {count.toLocaleString()}{suffix}
    </span>
  );
}
