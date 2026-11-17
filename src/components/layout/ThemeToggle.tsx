'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { clsx } from 'clsx'
import { useTheme } from './Providers'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-lg bg-hover text-text-muted transition-colors duration-fast border border-transparent"
        aria-label="Loading theme..."
        disabled
      >
        <Monitor size={18} />
      </button>
    )
  }

  const icons = {
    light: <Sun size={18} className="text-amber-500 transition-transform duration-300 hover:rotate-45" />,
    dark: <Moon size={18} className="text-brand-400 transition-transform duration-300 hover:-rotate-12" />,
    system: <Monitor size={18} className="text-text-muted hover:text-text" />,
  }

  const labels = {
    light: 'Đang dùng giao diện Sáng (Chuyển sang Tối)',
    dark: 'Đang dùng giao diện Tối (Chuyển sang Hệ thống)',
    system: 'Đang theo Hệ thống (Chuyển sang Sáng)',
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={clsx(
        'relative p-2 rounded-lg transition-all duration-fast',
        'text-text-muted hover:text-text hover:bg-hover border border-transparent hover:border-border',
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
