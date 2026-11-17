'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Bookmark, 
  PlusCircle, 
  Sparkles, 
  Terminal, 
  Calculator, 
  Sliders, 
  Scale, 
  BookOpen, 
  Layers, 
  FileCode,
  GraduationCap
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CommandPaletteTrigger } from './CommandPaletteTrigger'
import { clsx } from 'clsx'

const navGroups = [
  {
    name: 'Khám phá',
    items: [
      { name: 'Tất cả Danh mục', href: '/categories', desc: '16 lĩnh vực ứng dụng AI đời sống & kỹ thuật', icon: Layers },
      { name: 'Thư viện Prompts', href: '/prompts', desc: 'Hơn 80+ mẫu prompt tối ưu sẵn', icon: Sparkles },
      { name: 'Agent Blueprints', href: '/agents', desc: '8 kiến trúc AI Agent doanh nghiệp', icon: Terminal },
      { name: 'Multi-Agent Workflows', href: '/workflows', desc: 'Quy trình tự động hóa đa tác nhân', icon: FileCode },
    ]
  },
  {
    name: 'Công cụ AI',
    items: [
      { name: 'AI Playground', href: '/playground', desc: 'Thử nghiệm prompt streaming trực tiếp', icon: Sparkles },
      { name: 'Tính Chi phí Token 2026', href: '/tools/token-calculator', desc: 'Bảng quy đổi chi phí USD & VNĐ các model', icon: Calculator },
      { name: 'Tối ưu Hóa Prompt', href: '/tools/prompt-optimizer', desc: 'Chuyển đổi yêu cầu thành Prompt chuẩn CoT', icon: Sliders },
      { name: 'System Prompt Studio', href: '/tools/system-prompt-builder', desc: 'Thiết kế System Prompt chuẩn XML Tags & Few-shot', icon: Terminal },
      { name: 'So sánh Model Arena', href: '/compare', desc: 'Ma trận đối đầu Claude, GPT, DeepSeek, Gemini', icon: Scale },
    ]
  },
  {
    name: 'Học tập',
    items: [
      { name: 'AI Engineering Cheatsheet', href: '/cheatsheet', desc: 'Sổ tay tra cứu CoT, RAG, JSON Schema, tham số', icon: BookOpen },
      { name: 'Trắc nghiệm AI Quiz', href: '/learn/quiz', desc: 'Kiểm tra trình độ Prompt & LLM thực tế', icon: GraduationCap },
      { name: 'Kho Tài nguyên Tuyển chọn', href: '/resources', desc: 'Khóa học, tài liệu, công cụ hữu ích', icon: Layers },
    ]
  }
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-sticky transition-all duration-base',
        isScrolled
          ? 'bg-bg/85 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-bg/40 backdrop-blur-sm border-b border-border/40'
      )}
      role="banner"
    >
      <nav
        className="container mx-auto px-section-x py-3.5"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-text font-display font-bold text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md shrink-0"
            aria-label="AI Life Hub Home"
          >
            <span className="text-accent">AI</span>
            <span className="text-text">Life Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1.5">
            {navGroups.map((group) => {
              const isOpen = activeDropdown === group.name
              const isGroupActive = group.items.some(item => pathname === item.href)

              return (
                <div key={group.name} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : group.name)}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                      isOpen || isGroupActive
                        ? 'text-accent bg-accent/10 font-semibold'
                        : 'text-text-muted hover:text-text hover:bg-hover'
                    )}
                    aria-expanded={isOpen}
                  >
                    {group.name}
                    <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-fast', isOpen && 'rotate-180')} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-bg-surface border border-border shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-fast">
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon
                          const isActive = pathname === item.href

                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={clsx(
                                'flex items-start gap-3 p-2.5 rounded-xl transition-all',
                                isActive 
                                  ? 'bg-accent/15 text-accent' 
                                  : 'hover:bg-hover text-text group'
                              )}
                            >
                              <div className={clsx(
                                'p-2 rounded-lg shrink-0 mt-0.5',
                                isActive ? 'bg-accent text-white' : 'bg-bg border border-border text-text-muted group-hover:text-accent'
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={clsx('block text-xs font-bold leading-snug', isActive ? 'text-accent' : 'text-text group-hover:text-accent')}>
                                  {item.name}
                                </span>
                                <span className="block text-[11px] text-text-muted line-clamp-1 mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Standalone Favorites Link */}
            <Link
              href="/favorites"
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                pathname === '/favorites'
                  ? 'text-accent bg-accent/10 font-semibold'
                  : 'text-text-muted hover:text-text hover:bg-hover'
              )}
            >
              <Bookmark className="w-4 h-4" />
              Yêu thích
            </Link>

            {/* Submit Button */}
            <Link
              href="/submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all ml-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Đóng góp
            </Link>
          </div>

          {/* Right Controls: Search & Theme */}
          <div className="hidden sm:flex items-center gap-3">
            <CommandPaletteTrigger />
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <CommandPaletteTrigger />
            <ThemeToggle />
            <button
              type="button"
              className="p-2 text-text-muted hover:text-text transition-colors rounded-lg border border-border"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          id="mobile-menu"
          className={clsx(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[640px] opacity-100 mt-4 pt-4 border-t border-border overflow-y-auto' : 'max-h-0 opacity-0'
          )}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="space-y-4 pb-4">
            {navGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-2 block mb-1">
                  {group.name}
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={clsx(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                          isActive 
                            ? 'bg-accent/15 text-accent font-semibold' 
                            : 'text-text hover:bg-hover'
                        )}
                      >
                        <Icon className="w-4 h-4 text-accent shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border bg-bg text-sm font-medium text-text"
              >
                <Bookmark className="w-4 h-4 text-accent" />
                Yêu thích
              </Link>

              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent text-white text-sm font-semibold"
              >
                <PlusCircle className="w-4 h-4" />
                Đóng góp
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
