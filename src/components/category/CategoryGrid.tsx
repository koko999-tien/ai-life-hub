'use client';

import { Category } from '@/types';
import { CategoryCard } from './CategoryCard';
import { useState } from 'react';
import { clsx } from 'clsx';

export interface CategoryGridProps {
  categories: Category[];
  filterQuery?: string;
  className?: string;
  onCategoryClick?: (category: Category) => void;
}

export function CategoryGrid({
  categories,
  filterQuery = '',
  className = '',
  onCategoryClick,
}: CategoryGridProps) {
  const filteredCategories = categories.filter((category) => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.id.toLowerCase().includes(query)
    );
  });

  const highlightedIds = new Set(
    filterQuery
      ? filteredCategories
          .filter((c) =>
            c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(filterQuery.toLowerCase())
          )
          .map((c) => c.id)
      : []
  );

  if (filteredCategories.length === 0) {
    return (
      <div className={clsx('py-12 text-center', className)}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-slate-600 dark:text-slate-400">
            No categories match "{filterQuery}"
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'grid gap-6',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        className
      )}
      role="list"
      aria-label="Categories"
    >
      {filteredCategories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          highlighted={highlightedIds.has(category.id)}
          onClick={() => onCategoryClick?.(category)}
          style={{
            animationDelay: `${index * 80}ms`,
          } as React.CSSProperties}
          className="animate-fade-in-up"
        />
      ))}
    </div>
  );
}