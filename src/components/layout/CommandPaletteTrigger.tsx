'use client'

import { Search, Command } from 'lucide-react'
import { clsx } from 'clsx'

interface CommandPaletteTriggerProps {
  className?: string
  isOpen?: boolean
  onOpen?: () => void
}

export function CommandPaletteTrigger({
  className,
  isOpen = false,
  onOpen,
}: CommandPaletteTriggerProps) {
  const handleClick = () => {
    if (onOpen) {
      onOpen()
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-command-palette'))
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-fast text-xs font-medium',
        'bg-bg-surface/80 hover:bg-hover text-text-muted hover:text-text border border-border shadow-xs hover:border-accent/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg',
        className
      )}
      aria-label="Tìm kiếm nhanh (⌘K)"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <Search size={14} className="text-text-muted" />
      <span className="hidden sm:inline text-text-muted">Tìm kiếm...</span>
      <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-text-subtle bg-bg/80 rounded border border-border">
        <Command size={10} />
        <span>K</span>
      </kbd>
    </button>
  )
}
