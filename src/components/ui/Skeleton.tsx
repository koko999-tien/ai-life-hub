'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 3 }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const variantStyles = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl',
  };

  if (variant === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className={cn(baseStyles, variantStyles.card, 'h-40 w-full')} />
        <div className="space-y-3 px-2">
          <div className={cn(baseStyles, variantStyles.text, 'h-6 w-3/4')} />
          <div className={cn(baseStyles, variantStyles.text, 'h-4 w-full')} />
          <div className={cn(baseStyles, variantStyles.text, 'h-4 w-5/6')} />
        </div>
        <div className="flex gap-2 px-2">
          <div className={cn(baseStyles, variantStyles.circular, 'h-8 w-8')} />
          <div className="flex-1 space-y-2">
            <div className={cn(baseStyles, variantStyles.text, 'h-4 w-1/3')} />
            <div className={cn(baseStyles, variantStyles.text, 'h-3 w-1/4')} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseStyles,
              variantStyles.text,
              i === lines - 1 && 'w-3/4'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
    />
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="flex flex-wrap gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 px-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
        ))}
      </div>
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export function SkillCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 px-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function PromptCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="px-3 py-2.5 rounded-lg animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}