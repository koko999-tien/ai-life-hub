'use client';

import { Category } from '@/types';
import { ICON_COMPONENTS } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';

type IconName = keyof typeof ICON_COMPONENTS;

function getIconComponent(iconName: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const componentName = ICON_COMPONENTS[iconName as IconName] as keyof typeof LucideIcons;
  return ((LucideIcons as any)[componentName] || LucideIcons.HelpCircle) as React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  highlighted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function CategoryCard({ category, onClick, highlighted = false, style, className }: CategoryCardProps) {
  const IconComponent = getIconComponent(category.icon);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== 'undefined') {
      window.location.href = `/categories/${category.slug}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const stats = [
    { label: 'Skills', value: category.skillCount },
    { label: 'Prompts', value: category.promptCount },
    { label: 'Agents', value: category.agentCount },
    { label: 'Resources', value: category.resourceCount },
  ];

  const borderColor = highlighted ? category.color : `${category.color}80`;
  const hoverBorderColor = highlighted ? category.color : category.color;

  return (
    <article
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${category.name} category`}
      className={clsx(
        'group relative rounded-xl border-l-4 p-6 bg-white/80 dark:bg-slate-900/80',
        'backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50',
        'transition-all duration-250 ease-out',
        'hover:shadow-xl hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900',
        'cursor-pointer',
        'category-card',
        className
      )}
      style={{
        '--category-border-color': borderColor,
        '--category-hover-border-color': hoverBorderColor,
        ...style,
      } as React.CSSProperties}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        >
          <IconComponent className="w-6 h-6" strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {category.name}
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {category.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Category statistics">
            {stats.map((stat) => (
              <span
                key={stat.label}
                className={clsx(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                  'group-hover:bg-slate-200 dark:group-hover:bg-slate-700',
                  'transition-colors duration-200'
                )}
                role="listitem"
              >
                <span className="font-semibold tabular-nums">{stat.value}</span>
                <span className="text-slate-500 dark:text-slate-500">{stat.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 ease-out pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
          style={{ backgroundColor: category.color }}
        />
      </div>
    </article>
  );
}