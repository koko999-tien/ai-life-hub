'use client';

import { forwardRef, TextareaHTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount = false, maxLength, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (ref.current) {
        setCount(ref.current.value.length);
      }
    }, [ref]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="label-base">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            onChange={handleChange}
            className={cn(
              'input-base resize-y min-h-[100px]',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : showCount ? `${textareaId}-count` : undefined}
            {...props}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          {error && (
            <p id={`${textareaId}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          {hint && !error && (
            <p id={`${textareaId}-hint`} className="text-sm text-gray-500 dark:text-gray-400">
              {hint}
            </p>
          )}
          {showCount && (
            <p id={`${textareaId}-count`} className={cn('text-sm font-mono', count > (maxLength || 0) ? 'text-red-600' : 'text-gray-400')}>
              {count}{maxLength ? ` / ${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';