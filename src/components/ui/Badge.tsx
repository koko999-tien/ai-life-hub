'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import {
  DIFFICULTY_COLORS,
  PROMPT_DIFFICULTY_COLORS,
  RESOURCE_TYPE_COLORS,
} from '@/lib/constants';
import { DifficultyLevel, PromptDifficulty, ResourceType } from '@/types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'difficulty' | 'prompt-difficulty' | 'resource-type';
  level?: DifficultyLevel;
  promptDifficulty?: PromptDifficulty;
  resourceType?: ResourceType;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      level,
      promptDifficulty,
      resourceType,
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
      difficulty: level ? DIFFICULTY_COLORS[level] : 'bg-gray-100 text-gray-700',
      'prompt-difficulty': promptDifficulty
        ? PROMPT_DIFFICULTY_COLORS[promptDifficulty]
        : 'bg-gray-100 text-gray-700',
      'resource-type': resourceType
        ? RESOURCE_TYPE_COLORS[resourceType]
        : 'bg-gray-100 text-gray-700',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';