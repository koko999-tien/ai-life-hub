'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type Position = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: Position;
  delay?: number;
  className?: string;
}

export function Tooltip({ content, children, position = 'top', delay = 200, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVisible && childRef.current && tooltipRef.current) {
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const gap = 8;

      let top = 0, left = 0;

      switch (position) {
        case 'top':
          top = childRect.top - tooltipHeight - gap;
          left = childRect.left + childRect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = childRect.bottom + gap;
          left = childRect.left + childRect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = childRect.top + childRect.height / 2 - tooltipHeight / 2;
          left = childRect.left - tooltipWidth - gap;
          break;
        case 'right':
          top = childRect.top + childRect.height / 2 - tooltipHeight / 2;
          left = childRect.right + gap;
          break;
      }

      setTooltipRect(new DOMRect(left, top, tooltipWidth, tooltipHeight));
    }
  }, [isVisible, position]);

  const tooltipStyle: React.CSSProperties = tooltipRect
    ? { top: tooltipRect.top, left: tooltipRect.left }
    : {};

  const tooltipContent = isVisible && tooltipRect ? (
    createPortal(
      <div
        ref={tooltipRef}
        role="tooltip"
        style={tooltipStyle}
        className={cn(
          'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded shadow-lg',
          'animate-fade-in',
          'whitespace-nowrap',
          className
        )}
      >
        {content}
        <div
          className="absolute"
          style={{
            ...getArrowStyle(position),
          }}
        />
      </div>,
      document.body
    )
  ) : null;

  const childWithProps = React.cloneElement(children as React.ReactElement<any>, {
    ref: childRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  });

  return <>{childWithProps}{tooltipContent}</>;
}

function getArrowStyle(position: Position): React.CSSProperties {
  const size = 6;
  switch (position) {
    case 'top':
      return { bottom: -size, left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
    case 'bottom':
      return { top: -size, left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
    case 'left':
      return { right: -size, top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
    case 'right':
      return { left: -size, top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
  }
}