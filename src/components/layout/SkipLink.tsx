'use client'

import { clsx } from 'clsx'

interface SkipLinkProps {
  targetId?: string
  children?: React.ReactNode
}

/**
 * Skip to main content link for accessibility.
 * Allows keyboard users to bypass navigation and jump directly to main content.
 */
export function SkipLink({ targetId = 'main-content', children = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={clsx(
        'sr-only focus:not-sr-only',
        'fixed top-4 left-4 z-toast',
        'px-4 py-2 rounded-lg',
        'bg-accent text-text-inverse font-medium',
        'shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'transition-all duration-fast'
      )}
    >
      {children}
    </a>
  )
}

/**
 * Main content wrapper that provides the skip link target.
 * Use this to wrap your page's main content area.
 */
interface MainContentProps {
  children: React.ReactNode
  id?: string
}

export function MainContent({ children, id = 'main-content' }: MainContentProps) {
  return (
    <main id={id} tabIndex={-1} className="focus:outline-none">
      {children}
    </main>
  )
}