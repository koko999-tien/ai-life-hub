'use client';

import { useState, useCallback } from 'react';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Copy, Check, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from './Toast';

export interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  successMessage?: string;
  variant?: 'default' | 'icon' | 'inline';
  size?: 'sm' | 'md';
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      text,
      successMessage = 'Đã sao chép!',
      variant = 'default',
      size = 'md',
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      if (disabled) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(successMessage);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Không thể sao chép');
      }
      onClick?.();
    }, [text, disabled, successMessage, onClick]);

    const baseStyles = 'inline-flex items-center justify-center gap-1.5 transition-colors';

    const variantStyles = {
      default: 'rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      icon: 'rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
      inline: 'text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline-offset-2 hover:underline',
    };

    const sizeStyles = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleCopy}
        disabled={disabled || copied}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        aria-label={copied ? 'Đã sao chép' : 'Sao chép vào clipboard'}
        {...props}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
            <span>{variant !== 'icon' ? 'Đã sao chép' : ''}</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden="true" />
            {children || (variant !== 'icon' && 'Sao chép')}
          </>
        )}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';