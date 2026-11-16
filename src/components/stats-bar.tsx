'use client';

import { useEffect, useRef, useState } from 'react';
import { Target, BookOpen, Code2, Database, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
}

const stats: Stat[] = [
  { label: 'Danh mục', value: 8, icon: BookOpen, color: 'brand', delay: 0 },
  { label: 'Kỹ năng', value: 52, icon: Code2, color: 'accent', delay: 100 },
  { label: 'Prompt templates', value: 200, icon: Target, color: 'success', delay: 200 },
  { label: 'Tài nguyên', value: 150, icon: Database, color: 'warning', delay: 300 },
];

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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  };

  const getColorClasses = (color: string) => {
    const map: Record<string, string> = {
      brand: 'text-brand-600 dark:text-brand-400',
      accent: 'text-accent-600 dark:text-accent-400',
      success: 'text-success-600 dark:text-success-400',
      warning: 'text-warning-600 dark:text-warning-400',
    };
    return map[color] || map.brand;
  };

  return (
    <section
      ref={sectionRef}
      className="border-y border-border/50 bg-muted/30 py-12 lg:py-16"
      aria-labelledby="stats-heading"
    >
      <div className="container">
        <h2 id="stats-heading" className="sr-only">
          Thống kê nền tảng
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${stat.delay || index * 100}ms` }}
            >
              <div
                className={cn(
                  'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl',
                  `bg-${stat.color}-100 dark:bg-${stat.color}-900/30`,
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                )}
                aria-hidden="true"
              >
                <stat.icon className={cn('h-7 w-7', getColorClasses(stat.color))} />
              </div>
              <div
                className={cn(
                  'font-mono font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight',
                  getColorClasses(stat.color),
                  isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-4'
                )}
              >
                <AnimatedCounter
                  end={stat.value}
                  duration={2000}
                  isVisible={isVisible}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
  const frameRef = useRef<number>();

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