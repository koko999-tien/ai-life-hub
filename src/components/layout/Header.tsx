'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, Monitor, Search, Command } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CommandPaletteTrigger } from './CommandPaletteTrigger'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Danh mục', href: '/categories' },
  { name: 'Prompts', href: '/prompts' },
  { name: 'Agents', href: '/agents' },
  { name: 'Playground', href: '/playground' },
  { name: 'Workflows', href: '/workflows' },
  { name: 'Tính Token', href: '/tools/token-calculator' },
  { name: 'Tối ưu Prompt', href: '/tools/prompt-optimizer' },
  { name: 'Quiz', href: '/learn/quiz' },
  { name: 'Yêu thích', href: '/favorites' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-sticky transition-all duration-base',
        isScrolled
          ? 'bg-bg/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      )}
      role="banner"
    >
      <nav
        className="container mx-auto px-section-x py-4"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-text font-display font-bold text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md"
            aria-label="AI Life Hub Home"
          >
            <span className="text-accent">AI</span>
            <span className="text-text">Life Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'text-sm font-medium transition-colors duration-fast',
                  'hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md px-2 py-1',
                  pathname === item.href
                    ? 'text-accent'
                    : 'text-text-muted'
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Search Button (Desktop) */}
            <CommandPaletteTrigger className="hidden sm:flex" />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <CommandPaletteTrigger />
            <ThemeToggle />
            <button
              type="button"
              className="p-2 text-text-muted hover:text-text transition-colors duration-fast rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-base ease-out',
            mobileMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'px-3 py-2 text-base font-medium rounded-lg transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                  pathname === item.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-hover'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <CommandPaletteTrigger className="w-full justify-start" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}