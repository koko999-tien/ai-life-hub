'use client'

import { useEffect, useRef } from 'react'
import { X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Categories', href: '/categories' },
  { name: 'Resources', href: '/resources' },
  { name: 'Favorites', href: '/favorites' },
  { name: 'Submit Tool', href: '/submit' },
]

const categories = [
  { name: 'Chat & Assistants', href: '/categories/chat-assistants', count: 42 },
  { name: 'Image Generation', href: '/categories/image-generation', count: 28 },
  { name: 'Video Generation', href: '/categories/video-generation', count: 15 },
  { name: 'Audio & Voice', href: '/categories/audio-voice', count: 19 },
  { name: 'Code & Development', href: '/categories/code-development', count: 35 },
  { name: 'Productivity', href: '/categories/productivity', count: 31 },
  { name: 'Writing & Content', href: '/categories/writing-content', count: 24 },
  { name: 'Design & Creative', href: '/categories/design-creative', count: 22 },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management and scroll lock
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      // Focus the close button for accessibility
      setTimeout(() => {
        navRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close menu"]')?.focus()
      }, 0)
    } else {
      document.body.style.overflow = ''
      previousActiveElement.current?.focus()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = navRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }

      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname, isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm animate-in fade-in duration-fast"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        ref={navRef}
        className="fixed inset-y-0 right-0 z-modal w-full max-w-sm bg-bg-elevated border-l border-border animate-in slide-in-from-right-full duration-base ease-out"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link
              href="/"
              className="flex items-center gap-2 text-text font-display font-bold text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md"
              onClick={onClose}
              aria-label="AI Life Hub Home"
            >
              <span className="text-accent">AI</span>
              <span className="text-text">Life Hub</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-hover transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center justify-between px-3 py-3 rounded-lg transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                  pathname === item.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-hover'
                )}
              >
                <span className="font-medium">{item.name}</span>
                <ChevronRight size={16} className="text-text-subtle shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {/* Categories Section */}
          <div className="border-t border-border p-4">
            <h3 className="font-semibold text-text mb-4">Categories</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-fast',
                    'text-text-muted hover:text-text hover:bg-hover',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
                  )}
                >
                  <span className="text-sm truncate">{category.name}</span>
                  <span className="text-xs text-text-subtle bg-bg px-2 py-0.5 rounded-full shrink-0">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border p-4 space-y-3">
            <Link
              href="/favorites"
              onClick={onClose}
              className={clsx(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors duration-fast',
                'bg-accent text-text-inverse hover:bg-accent-hover',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
              )}
            >
              <Heart size={18} />
              My Favorites
            </Link>
            <Link
              href="/submit"
              onClick={onClose}
              className={clsx(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors duration-fast',
                'bg-hover text-text hover:bg-hover/80 border border-border',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
              )}
            >
              <Plus size={18} />
              Submit a Tool
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// Inline icons
function Heart({ size = 18, ...props }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function Plus({ size = 18, ...props }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}