'use client';

import { useRef, useEffect, useState, useId } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  group?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (value: string) => void;
  align?: 'left' | 'right';
  width?: number | 'trigger';
  closeOnSelect?: boolean;
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  align = 'left',
  width = 'trigger',
  closeOnSelect = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.divider) return;
    onSelect?.(item.value);
    if (closeOnSelect) setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    const enabledItems = items.filter((i) => !i.disabled && !i.divider);
    const focusedIndex = enabledItems.findIndex((i) => i.value === (e.target as HTMLElement).dataset.value);
    
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(focusedIndex + 1, enabledItems.length - 1);
      (document.querySelector(`[data-value="${enabledItems[nextIndex].value}"]`) as HTMLElement)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(focusedIndex - 1, 0);
      (document.querySelector(`[data-value="${enabledItems[prevIndex].value}"]`) as HTMLElement)?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0) handleItemClick(enabledItems[focusedIndex]);
    }
  };

  const dropdownContent = (
    <div
      id={`${id}-dropdown`}
      role="menu"
      aria-orientation="vertical"
      className={cn(
        'absolute z-50 top-full mt-1.5 p-1 rounded-xl bg-bg-surface border border-border shadow-card animate-fade-in',
        'min-w-[160px] max-w-[320px]',
        align === 'right' ? 'right-0' : 'left-0',
        typeof width === 'number' && `w-[${width}px]`
      )}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return <div key={`divider-${index}`} className="my-1 border-t border-border" role="separator" />;
        }
        if (item.group) {
          return (
            <div key={`group-${index}`} className="px-3 py-1.5 text-xs font-semibold text-text-subtle uppercase tracking-wider">
              {item.group}
            </div>
          );
        }
        return (
          <button
            key={item.value}
            role="menuitem"
            tabIndex={-1}
            data-value={item.value}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className={cn(
              'w-full px-3 py-2 text-left text-sm transition-colors rounded-lg',
              'focus:outline-hidden focus:bg-bg-hover',
              item.disabled ? 'opacity-50 cursor-not-allowed text-text-subtle' : 'text-text hover:bg-bg-hover',
              item.danger && 'text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20'
            )}
            aria-disabled={item.disabled}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span className="h-4 w-4 shrink-0" aria-hidden="true">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
            </div>
          </button>
        );
      })}
      {items.length === 0 && (
        <div className="px-3 py-4 text-center text-text-muted text-sm">Không có tùy chọn</div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={`${id}-dropdown`}
        className="flex items-center gap-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
      >
        {trigger}
        <ChevronDown className={cn('h-4 w-4 text-text-muted transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>
      {isOpen && dropdownContent}
    </div>
  );
}
