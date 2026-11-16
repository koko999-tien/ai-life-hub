'use client';

import { Category, DifficultyLevel } from '@/types';
import { DIFFICULTY_LABELS } from '@/lib/constants';
import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, X, Filter, SlidersHorizontal, ChevronLeft } from 'lucide-react';

export interface CategorySidebarProps {
  categories: Category[];
  currentCategory: Category;
  selectedDifficulty?: DifficultyLevel;
  sortBy?: 'popularity' | 'newest' | 'name';
  onDifficultyChange?: (difficulty: DifficultyLevel | undefined) => void;
  onSortChange?: (sort: 'popularity' | 'newest' | 'name') => void;
  onClearFilters?: () => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'popularity' as const, label: 'Most Popular', icon: 'Star' },
  { value: 'newest' as const, label: 'Newest First', icon: 'Clock' },
  { value: 'name' as const, label: 'A-Z', icon: 'Type' },
] as const;

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: 'beginner', label: DIFFICULTY_LABELS.beginner },
  { value: 'intermediate', label: DIFFICULTY_LABELS.intermediate },
  { value: 'advanced', label: DIFFICULTY_LABELS.advanced },
];

export function CategorySidebar({
  categories,
  currentCategory,
  selectedDifficulty,
  sortBy = 'popularity',
  onDifficultyChange,
  onSortChange,
  onClearFilters,
  className = '',
}: CategorySidebarProps) {
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isRelatedOpen, setIsRelatedOpen] = useState(true);

  const hasActiveFilters = !!selectedDifficulty;
  const relatedCategories = categories
    .filter((c) => c.id !== currentCategory.id)
    .slice(0, 6);

  return (
    <aside
      className={clsx(
        'w-full lg:w-72 flex-shrink-0',
        'space-y-6',
        className
      )}
      aria-label="Category filters and navigation"
    >
      <div className="sticky top-24 space-y-6">
        <section aria-labelledby="filters-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="filters-heading" className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
              Filters
            </h2>
            {hasActiveFilters && onClearFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                aria-label="Clear all filters"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="difficulty-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Difficulty
            </label>
            <div className="relative">
              <select
                id="difficulty-filter"
                value={selectedDifficulty || ''}
                onChange={(e) => onDifficultyChange?.(e.target.value as DifficultyLevel || undefined)}
                className={clsx(
                  'w-full appearance-none px-3 py-2 pr-10',
                  'bg-white dark:bg-slate-800',
                  'border border-slate-300 dark:border-slate-600',
                  'rounded-lg text-sm text-slate-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  'focus:border-transparent',
                  'transition-colors duration-150'
                )}
                style={{ '--focus-ring-color': currentCategory.color } as React.CSSProperties}
                aria-label="Filter by difficulty level"
              >
                <option value="">All Levels</option>
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="sort-heading" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 id="sort-heading" className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5" aria-hidden="true" />
            Sort By
          </h3>
          <div className="space-y-2" role="radiogroup" aria-label="Sort options">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150',
                  'border border-slate-200 dark:border-slate-700',
                  'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  {
                    'bg-slate-100 dark:bg-slate-800 border-current':
                      sortBy === option.value,
                    'text-slate-900 dark:text-white': sortBy === option.value,
                    'text-slate-600 dark:text-slate-300': sortBy !== option.value,
                  }
                )}
                style={{
                  borderColor: sortBy === option.value ? currentCategory.color : undefined,
                } as React.CSSProperties}
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => onSortChange?.(option.value)}
                  className={clsx(
                    'w-4 h-4 accent-current',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2'
                  )}
                  style={{
                    accentColor: currentCategory.color,
                  } as React.CSSProperties}
                />
                <span className="text-sm font-medium flex-1">{option.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsRelatedOpen(!isRelatedOpen)}
            className="w-full flex items-center justify-between gap-2"
            aria-expanded={isRelatedOpen}
            aria-controls="related-categories"
            aria-label="Toggle related categories"
          >
            <h3 id="related-heading" className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ChevronDown
                className={clsx(
                  'w-5 h-5 transition-transform duration-200',
                  isRelatedOpen ? 'rotate-180' : ''
                )}
                aria-hidden="true"
              />
              Related Categories
            </h3>
          </button>

          <div
            id="related-categories"
            className={clsx(
              'space-y-2 overflow-hidden transition-all duration-300 ease-in-out',
              isRelatedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
            role="list"
            aria-label="Related categories"
          >
            {relatedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => window.location.href = `/categories/${category.slug}`}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'text-left transition-all duration-150',
                  'hover:bg-slate-100 dark:hover:bg-slate-800/50',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0'
                )}
                style={{
                  '--focus-ring-color': category.color,
                } as React.CSSProperties}
                role="listitem"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                >
                  <span className="text-xs font-medium">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-white truncate">
                  {category.name}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {category.skillCount} skills
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/categories"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150"
            style={{
              backgroundColor: currentCategory.color,
              color: 'white',
            } as React.CSSProperties}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            All Categories
          </a>
        </section>
      </div>
    </aside>
  );
}