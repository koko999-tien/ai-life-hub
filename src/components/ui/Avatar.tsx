'use client';

import * as React from 'react';
import { forwardRef, HTMLAttributes, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  shape?: 'circle' | 'square';
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const pixelSizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      status,
      shape = 'circle',
      className,
      ...props
    },
    ref
  ) => {
    const initials = useMemo(() => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }, [name]);

    const statusStyles = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    };

    const statusSizeStyles = {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    };

    const shapeStyles = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

    return (
      <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800',
            sizeStyles[size],
            shapeStyles
          )}
          aria-label={name ? `Avatar của ${name}` : undefined}
        >
          {src ? (
            <Image
              src={src}
              alt={alt || name || 'Avatar'}
              width={pixelSizes[size]}
              height={pixelSizes[size]}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 border-2 border-white dark:border-gray-900',
              statusStyles[status],
              statusSizeStyles[size],
              shapeStyles
            )}
            aria-label={`Trạng thái: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 5, size = 'md', className, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    const overlapStyles = {
      sm: '-ml-2',
      md: '-ml-3',
      lg: '-ml-4',
      xl: '-ml-5',
    };

    return (
      <div ref={ref} className={cn('flex', className)} {...props}>
        {visibleChildren.map((child, index) =>
          React.isValidElement(child) ? (
            React.cloneElement(child as React.ReactElement<any>, {
              key: child.key || index,
              className: cn((child.props as any)?.className, index > 0 && overlapStyles[size]),
              size,
            })
          ) : null
        )}
        {remainingCount > 0 && (
          <div
            className={cn(
              'flex items-center justify-center font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900',
              sizeStyles[size],
              'rounded-full',
              overlapStyles[size]
            )}
            aria-label={`${remainingCount} người khác`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
