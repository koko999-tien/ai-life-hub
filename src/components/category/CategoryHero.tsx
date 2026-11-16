'use client';

import { Category } from '@/types';
import { ICON_COMPONENTS } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

type IconName = keyof typeof ICON_COMPONENTS;

type LucideIconComponent = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
>;

function getIconComponent(iconName: string): LucideIconComponent {
  const componentName = ICON_COMPONENTS[iconName as IconName] as keyof typeof LucideIcons;
  const Icon = LucideIcons[componentName] as LucideIconComponent | undefined;
  return Icon || LucideIcons.HelpCircle;
}

export interface CategoryHeroProps {
  category: Category;
  className?: string;
}

export function CategoryHero({ category, className = '' }: CategoryHeroProps) {
  const IconComponent = getIconComponent(category.icon);

  const stats = [
    { label: 'Skills', value: category.skillCount, icon: 'Code' },
    { label: 'Prompts', value: category.promptCount, icon: 'FileText' },
    { label: 'Agents', value: category.agentCount, icon: 'Bot' },
    { label: 'Resources', value: category.resourceCount, icon: 'BookOpen' },
  ];

  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${category.color}, ${adjustColor(category.color, -20)})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <header
      className={clsx(
        'relative w-full rounded-2xl p-8 md:p-12',
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm',
        'border border-slate-200/50 dark:border-slate-700/50',
        'overflow-hidden',
        className
      )}
      style={{
        '--category-color': category.color,
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${category.color} 0%, transparent 70%)`,
          } as React.CSSProperties}
        />
      </div>

      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: category.color } as React.CSSProperties}
        aria-hidden="true"
      />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start md:items-center gap-5">
          <div
            className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white shadow-xl"
            style={{
              backgroundColor: category.color,
              boxShadow: `0 10px 40px -10px ${category.color}`,
            } as React.CSSProperties}
            aria-hidden="true"
          >
            <IconComponent className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={gradientStyle}
            >
              {category.name}
            </h1>
            <p className="mt-3 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-3 md:gap-4"
          role="list"
          aria-label="Category statistics"
        >
          {stats.map((stat) => {
            const StatIcon = (LucideIcons[stat.icon as keyof typeof LucideIcons] as LucideIconComponent) || LucideIcons.HelpCircle;
            return (
              <div
                key={stat.label}
                className={clsx(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl',
                  'bg-white/90 dark:bg-slate-800/90',
                  'border border-slate-200/50 dark:border-slate-700/50',
                  'backdrop-blur-sm shadow-sm',
                  'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
                )}
                role="listitem"
              >
                <StatIcon
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: category.color } as React.CSSProperties}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <div className="flex flex-col items-start">
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: category.color } as React.CSSProperties}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}