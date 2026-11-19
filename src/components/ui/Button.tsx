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
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

    const variantStyles = {
      // Nút chính kiểu PeachWeb: pill bo tròn hoàn toàn.
      primary: 'bg-accent text-white shadow-sm hover:bg-accent-hover hover:shadow-glow-accent rounded-full',
      secondary: 'bg-bg-elevated text-text border border-border shadow-sm hover:bg-bg-hover hover:border-border-light',
      outline: 'border border-border bg-transparent text-text hover:bg-bg-hover hover:border-border-light',
      ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-bg-hover',
      danger: 'bg-error-600 text-white shadow-sm hover:bg-error-700 focus-visible:ring-error-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-2.5 text-base rounded-xl gap-2.5',
      icon: 'p-2 text-sm rounded-lg gap-0',
    };

    const widthStyles = fullWidth ? 'w-full' : '';
    // Variant đặt sau size để rounded-full của primary thắng rounded của size.
    const combinedClassName = cn(baseStyles, sizeStyles[size], variantStyles[variant], widthStyles, className);

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
            {iconLeft && !loading && <span className="shrink-0" aria-hidden="true">{iconLeft}</span>}
            {children}
            {iconRight && !loading && <span className="shrink-0" aria-hidden="true">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
