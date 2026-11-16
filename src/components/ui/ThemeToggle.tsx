'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/layout/Providers';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="rounded-lg p-2 text-gray-500" aria-label="Đang tải theme">
        <Monitor className="h-5 w-5" />
      </button>
    );
  }

  const themes = [
    { value: 'light', label: 'Sáng', icon: Sun },
    { value: 'dark', label: 'Tối', icon: Moon },
    { value: 'system', label: 'Hệ thống', icon: Monitor },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const resolved = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          const currentIndex = themes.findIndex((t) => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        className={cn(
          'relative flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          'bg-gray-100 text-gray-700 hover:bg-gray-200',
          'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        )}
        aria-label={`Theme hiện tại: ${currentTheme.label}. Nhấn để thay đổi.`}
        aria-haspopup="true"
      >
        <currentTheme.icon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{currentTheme.label}</span>
      </button>

      <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg bg-white border border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700 animate-slide-down">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
              theme === t.value
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
            aria-current={theme === t.value ? 'true' : 'false'}
          >
            <t.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{t.label}</span>
            {theme === t.value && (
              <span className="ml-auto text-brand-600 dark:text-brand-400" aria-hidden="true">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}