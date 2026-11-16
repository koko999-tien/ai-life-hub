'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

const iconMap: Record<string, keyof typeof LucideIcons> = {
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
  // Convert hex to a tailwind color class based on the hue
  // For now use brand colors as fallback
  if (color.includes('3B82F6') || color.includes('0ea5e9')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  if (color.includes('8B5CF6') || color.includes('a855f7')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
  if (color.includes('EC4899') || color.includes('f43f5e')) return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
  if (color.includes('F59E0B') || color.includes('fbbf24')) return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
  if (color.includes('10B981') || color.includes('34d399')) return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
  if (color.includes('EF4444') || color.includes('f87171')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  if (color.includes('F97316') || color.includes('fb923c')) return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
  if (color.includes('6366F1') || color.includes('818cf8')) return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
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
          <h2 id="categories-heading" className="text-fluid-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {variant === 'featured' ? 'Danh mục nổi bật' : 'Tất cả danh mục'}
          </h2>
          <p className="text-fluid-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {variant === 'featured'
              ? 'Khám phá 6 lĩnh vực AI cốt lõi được thiết kế cho hành trình học tập của bạn'
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
                'group relative flex flex-col h-full overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-300',
                'hover:shadow-card-hover hover:-translate-y-1',
                'dark:bg-gray-900 dark:border-gray-800',
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

                <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-500">
                    {category.skillCount} kỹ năng
                  </span>
                  <span className="text-sm text-brand-600 dark:text-brand-400 font-medium group-hover:underline">
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
              href="/category"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              Xem tất cả 15 danh mục
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}