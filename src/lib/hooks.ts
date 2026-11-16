'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTheme as useThemeContext } from '@/components/layout/Providers';

export function useTheme() {
  return useThemeContext();
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
    setIsInitialized(true);
  }, [key]);

  const set = useCallback(
    (newValue: T) => {
      setValue(newValue);
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // Ignore
      }
    },
    [key]
  );

  const remove = useCallback(() => {
    setValue(defaultValue);
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }, [key, defaultValue]);

  return [value, set, remove, isInitialized] as const;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  active = true
) {
  useEffect(() => {
    if (!active) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, active]);
}

export function useKeyboardShortcut(key: string, callback: () => void, modifiers: string[] = []) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const hasModifiers = modifiers.every((m) => {
        if (m === 'ctrl') return e.ctrlKey;
        if (m === 'meta') return e.metaKey;
        if (m === 'alt') return e.altKey;
        return e.key === m;
      });
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (hasModifiers && e.key.toLowerCase() === key && !isInput) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifiers]);
}

export function useThemePreference() {
  const { resolvedTheme } = useTheme();
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (resolvedTheme) setResolved(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (value: 'light' | 'dark' | 'system') => {
    setThemeState(value);
  };

  const toggle = useCallback(() => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  }, [theme]);

  return { theme, setTheme, resolved, toggle };
}

export function useCountdown(seconds: number, isRunning: boolean, onComplete: () => void) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds, onComplete]);

  return remaining;
}

export function useFocusTrap(
  ref: React.RefObject<HTMLElement>,
  active: boolean,
  onClose: () => void,
  contains: (el: HTMLElement) => boolean
) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [ref, active, onClose, contains]);
}
