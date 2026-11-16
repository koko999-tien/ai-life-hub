'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { clsx } from 'clsx'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-md bg-hover text-text-muted transition-colors duration-fast"
        aria-label="Loading theme..."
        disabled
      >
        <Monitor size={20} />
      </button>
    )
  }

  const icons = {
    light: <Sun size={20} />,
    dark: <Moon size={20} />,
    system: <Monitor size={20} />,
  }

  const labels = {
    light: 'Switch to dark mode',
    dark: 'Switch to system preference',
    system: 'Switch to light mode',
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={clsx(
        'relative p-2 rounded-lg transition-all duration-fast',
        'text-text-muted hover:text-text hover:bg-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
      )}
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      {icons[theme]}
      <span className="sr-only">{labels[theme]}</span>
    </button>
  )
}