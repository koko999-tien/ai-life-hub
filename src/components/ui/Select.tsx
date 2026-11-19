'use client';

import { forwardRef, SelectHTMLAttributes, useId, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  onChange?: (value: string | string[]) => void;
  clearable?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder = 'Chọn...',
      multiple = false,
      searchable = false,
      onChange,
      clearable = false,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | string[]>(multiple ? [] : '');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    const handleSelect = (value: string) => {
      if (multiple) {
        const current = selectedValue as string[];
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        setSelectedValue(next);
        onChange?.(next);
      } else {
        setSelectedValue(value);
        onChange?.(value);
        setIsOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValue(multiple ? [] : '');
      onChange?.(multiple ? [] : '');
      setIsOpen(false);
    };

    const displayValue = multiple
      ? (selectedValue as string[]).map((v) => options.find((o) => o.value === v)?.label).filter(Boolean).join(', ')
      : options.find((o) => o.value === selectedValue)?.label || '';

    const groupedOptions = filteredOptions.reduce((acc, opt) => {
      const group = opt.group || 'Ungrouped';
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    }, {} as Record<string, SelectOption[]>);

    return (
      <div ref={containerRef} className={cn('w-full', className)}>
        {label && (
          <label htmlFor={selectId} className="label-base">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            id={selectId}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'input-base w-full text-left',
              'py-2.5 pr-10',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              !displayValue && 'text-gray-500 dark:text-gray-400'
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={`${selectId}-listbox`}
            aria-labelledby={label ? `${selectId}-label` : undefined}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                !disabled && setIsOpen(!isOpen);
              } else if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
          >
            {multiple && (selectedValue as string[]).length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {(selectedValue as string[]).slice(0, 3).map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return opt ? (
                    <span key={val} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-100 text-brand-700 text-xs dark:bg-brand-900/30 dark:text-brand-400">
                      {opt.label}
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleSelect(val); }} className="text-brand-500 hover:text-brand-700" aria-label={`Bỏ chọn ${opt.label}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {(selectedValue as string[]).length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                    +{(selectedValue as string[]).length - 3} nữa
                  </span>
                )}
              </div>
            ) : displayValue ? (
              displayValue
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
            </div>
          </button>

          {clearable && selectedValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Xóa lựa chọn"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {isOpen && (
            <div
              id={`${selectId}-listbox`}
              role="listbox"
              aria-multiselectable={multiple}
              aria-labelledby={selectId}
              className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg bg-white border border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700"
            >
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800"
                    autoFocus
                  />
                </div>
              )}
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group}>
                  {group !== 'Ungrouped' && (
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                      {group}
                    </div>
                  )}
                  {groupOptions.map((option) => {
                    const isSelected = multiple
                      ? (selectedValue as string[]).includes(option.value)
                      : selectedValue === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm transition-colors',
                          isSelected
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                          option.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {multiple && (
                            <span className={cn('h-4 w-4 rounded border-2 shrink-0', isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600')}>
                              {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                            </span>
                          )}
                          <span>{option.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';