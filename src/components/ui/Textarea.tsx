'use client';

import { forwardRef, TextareaHTMLAttributes, useState, useEffect, useRef } from 'react';
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
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useEffect(() => {
      if (innerRef.current) {
        setCount(innerRef.current.value.length);
      }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-text mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={setRefs}
            id={textareaId}
            onChange={handleChange}
            className={cn(
              'w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-subtle transition-colors duration-150 resize-y min-h-[100px]',
              'focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : showCount ? `${textareaId}-count` : undefined}
            {...props}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          {error && (
            <p id={`${textareaId}-error`} className="text-sm text-error-600 dark:text-error-400" role="alert">
              {error}
            </p>
          )}
          {hint && !error && (
            <p id={`${textareaId}-hint`} className="text-sm text-text-muted">
              {hint}
            </p>
          )}
          {showCount && (
            <p id={`${textareaId}-count`} className={cn('text-sm font-mono', count > (maxLength || 0) ? 'text-error-600' : 'text-text-subtle')}>
              {count}{maxLength ? ` / ${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
