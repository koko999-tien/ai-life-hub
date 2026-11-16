'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Code, FileText, Users } from 'lucide-react';

const stats = [
  { icon: BookOpen, label: 'Danh mục', value: 15, suffix: '' },
  { icon: Code, label: 'Skills', value: 50, suffix: '+' },
  { icon: FileText, label: 'Prompts', value: 200, suffix: '+' },
  { icon: Users, label: 'Tài nguyên', value: 100, suffix: '+' },
];

export function StatsBar() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(stats.map((stat) => Math.floor(stat.value * eased)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCounts(stats.map((s) => s.value));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-bar');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-bar" className="py-12 bg-gray-50 dark:bg-gray-900/50" aria-label="Thống kê">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="text-fluid-3xl font-heading font-bold text-gray-900 dark:text-white" aria-live="polite">
                {mounted ? counts[index].toLocaleString() : '0'}
                <span className="text-xl font-normal text-gray-500 dark:text-gray-400">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}