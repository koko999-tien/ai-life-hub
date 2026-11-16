'use client';

import React, { forwardRef, ButtonHTMLAttributes, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      asChild = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus:ring-brand-500 focus:ring-offset-white dark:focus:ring-offset-gray-950',
      secondary: 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus:ring-gray-500 focus:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-950',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-brand-500 focus:ring-offset-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-950',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-brand-500 focus:ring-offset-white dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-950',
      danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-950',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
      icon: 'p-2 text-sm gap-0',
    };

    const widthStyles = fullWidth ? 'w-full' : '';
    const combinedClassName = cn(baseStyles, variantStyles[variant], sizeStyles[size], widthStyles, className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement<any>, {
        className: cn(combinedClassName, (children.props as any)?.className),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <>
            {iconLeft && !loading && <span className="flex-shrink-0" aria-hidden="true">{iconLeft}</span>}
            {children}
            {iconRight && !loading && <span className="flex-shrink-0" aria-hidden="true">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';