'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

const iconMap: Record<string, keyof typeof LucideIcons> = {
  Sparkles: 'Sparkles',
  BookOpen: 'BookOpen',
  Briefcase: 'Briefcase',
  PenTool: 'PenTool',
  Code: 'Code',
  Palette: 'Palette',
  Wallet: 'Wallet',
  HeartPulse: 'HeartPulse',
  Users: 'Users',
  Plane: 'Plane',
  Home: 'Home',
  Baby: 'Baby',
  Scale: 'Scale',
  Rocket: 'Rocket',
  Microscope: 'Microscope',
  Gamepad2: 'Gamepad2',
};

function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  const key = iconMap[iconName] || 'BookOpen';
  return ((LucideIcons as any)[key] || LucideIcons.BookOpen) as React.ComponentType<{ className?: string }>;
}

function getColorClass(color: string) {
  const c = color.toLowerCase();
  if (c.includes('3b82f6') || c.includes('0ea5e9')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  if (c.includes('8b5cf6') || c.includes('a855f7')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
  if (c.includes('ec4899')) return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
  if (c.includes('f43f5e')) return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
  if (c.includes('f59e0b') || c.includes('fbbf24')) return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
  if (c.includes('10b981') || c.includes('059669') || c.includes('34d399')) return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
  if (c.includes('ef4444') || c.includes('f87171')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  if (c.includes('f97316') || c.includes('fb923c')) return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
  if (c.includes('6366f1') || c.includes('818cf8')) return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
  if (c.includes('06b6d4')) return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400';
  if (c.includes('84cc16')) return 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400';
  if (c.includes('d946ef')) return 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400';
  if (c.includes('64748b')) return 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400';
  if (c.includes('14b8a6')) return 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400';
  return 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400';
}

interface CategoryGridProps {
  categories: Category[];
  variant?: 'featured' | 'all';
}

export function CategoryGrid({ categories, variant = 'featured' }: CategoryGridProps) {
  return (
    <section aria-labelledby="categories-heading" className="py-16 lg:py-24">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 id="categories-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text mb-4">
            {variant === 'featured' ? 'Danh mục nổi bật' : 'Tất cả danh mục'}
          </h2>
          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto">
            {variant === 'featured'
              ? 'Khám phá 6 lĩnh vực phổ biến nhất giúp bạn ứng dụng AI ngay vào công việc và đời sống'
              : 'Toàn bộ hệ thống kiến thức AI được tổ chức theo chủ đề'}
          </p>
        </div>

        <div
          className={cn(
            'grid gap-6',
            variant === 'featured'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
          role="list"
        >
          {categories.map((category, index) => (
            <article
              key={category.slug}
              className={cn(
                'group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-bg-surface p-6 transition-all duration-300 shadow-2xs',
                'hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/40',
                'animate-slide-up'
              )}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                borderLeftColor: category.color,
                borderLeftWidth: '4px',
              }}
              role="listitem"
            >
              <Link
                href={`/category/${category.slug}`}
                className="block h-full flex flex-col"
                aria-label={`Xem chi tiết danh mục ${category.name}`}
              >
                <div className="mb-4">
                  <div
                    className={cn(
                      'inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform',
                      getColorClass(category.color)
                    )}
                    aria-hidden="true"
                  >
                    {(() => {
                      const IconComp = getIconComponent(category.icon);
                      return <IconComp className="h-6 w-6" />;
                    })()}
                  </div>
                </div>

                <h3 className="font-heading text-lg font-semibold text-text mb-2 group-hover:text-accent transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-1">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm font-medium text-text-muted">
                    {category.skillCount} kỹ năng · {category.promptCount} câu lệnh
                  </span>
                  <span className="text-sm text-accent font-medium group-hover:underline">
                    Khám phá →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {variant === 'featured' && (
          <div className="mt-10 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors"
            >
              <span>Xem tất cả 16 danh mục</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}