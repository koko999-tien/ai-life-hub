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
  Sliders,
  BookOpen,
  Layers,
  GraduationCap,
  Play,
  Briefcase,
  User,
  LayoutDashboard,
  Home,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CommandPaletteTrigger } from './CommandPaletteTrigger'
import { CommandPalette } from '@/components/search/CommandPalette'
import { clsx } from 'clsx'

type NavItem = {
  name: string
  href: string
  desc: string
  icon: typeof Layers
}

type NavSection = {
  label: string
  audience: 'everyday' | 'builder'
  items: NavItem[]
}

type NavGroup = {
  name: string
  sections: NavSection[]
}

const navGroups: NavGroup[] = [
  {
    name: 'Làm việc',
    sections: [
      {
        label: 'Dùng ngay cho mọi người',
        audience: 'everyday',
        items: [
          { name: 'AI Workspace', href: '/workspace', desc: 'Chọn việc, dán nội dung, bấm Tạo ngay', icon: Play },
          { name: '8 Nhóm Công Việc Thực Tế', href: '/ai-work', desc: 'Chọn nhiệm vụ, xem đầu vào & kết quả nhận được', icon: Briefcase },
          { name: 'Thư viện Câu lệnh (80+)', href: '/prompts', desc: 'Câu lệnh dùng ngay & mẫu điền thông tin tương tác', icon: Sparkles },
          { name: 'Viết lại câu lệnh hay hơn', href: '/tools/prompt-optimizer', desc: 'Nâng cấp yêu cầu ngắn thành chỉ dẫn đầy đủ', icon: Sliders },
          { name: '16 Danh mục Ứng dụng', href: '/categories', desc: 'Hướng dẫn chi tiết cho công sở, tài chính & đời sống', icon: Layers },
        ],
      },
    ],
  },
  {
    name: 'Khám phá',
    sections: [
      {
        label: 'Học tập & Thực hành',
        audience: 'everyday',
        items: [
          { name: 'Trắc Nghiệm Kiến Thức AI', href: '/learn/quiz', desc: 'Đánh giá nhanh kỹ năng ra lệnh và ứng dụng AI', icon: GraduationCap },
          { name: 'Kho Tài Nguyên Chọn Lọc', href: '/resources', desc: 'Tài liệu, khóa học và công cụ miễn phí uy tín', icon: BookOpen },
          { name: 'Khu Thử Nghiệm Minh Họa', href: '/playground', desc: 'Xem mô phỏng cách câu lệnh hoạt động trực quan', icon: Sparkles },
          { name: 'Đóng Góp Câu Lệnh Mới', href: '/submit', desc: 'Chia sẻ mẫu câu lệnh hiệu quả của bạn với cộng đồng', icon: PlusCircle },
        ],
      },
    ],
  },
]

// Menu mobile: chỉ 6 link chính, còn lại gom vào "Xem thêm".
const mobileMainLinks: NavItem[] = [
  { name: 'Trang chủ', href: '/', desc: '', icon: Home },
  { name: 'AI Workspace', href: '/workspace', desc: '', icon: Play },
  { name: 'Làm việc', href: '/ai-work', desc: '', icon: Briefcase },
  { name: 'Thư viện câu lệnh', href: '/prompts', desc: '', icon: Sparkles },
  { name: 'Khám phá', href: '/resources', desc: '', icon: BookOpen },
  { name: 'Tổng quan', href: '/dashboard', desc: '', icon: LayoutDashboard },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAllMobileNav, setShowAllMobileNav] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }

    const handleOpenSearch = () => {
      setCommandPaletteOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleOpenSearch)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleOpenSearch)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
    setShowAllMobileNav(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-sticky transition-all duration-base',
          isScrolled || mobileMenuOpen
            ? 'bg-bg/95 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-bg/60 backdrop-blur-md border-b border-border/40'
        )}
        role="banner"
      >
        <nav
          className="container mx-auto px-section-x py-3.5"
          aria-label="Điều hướng chính"
        >
          <div className="flex items-center justify-between gap-3">
            {/* Logo (Trang chủ) */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-text font-display font-bold text-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-lg shrink-0 transition-transform active:scale-95"
              aria-label="Trang chủ AI Life Hub"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-brand-500 via-accent to-accent-600 text-white shadow-sm shadow-accent/25 ring-1 ring-white/20 group-hover:scale-105 transition-all">
                <Sparkles className="w-4 h-4 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center tracking-tight">
                <span className="bg-linear-to-r from-accent to-accent-600 bg-clip-text text-transparent font-extrabold">AI</span>
                <span className="text-text ml-1 font-bold">Life Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation: Trang chủ -> Làm việc -> Khám phá -> Tổng quan -> Tài khoản */}
            <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={clsx(
                  'px-2.5 py-2 text-sm font-medium rounded-lg transition-all',
                  pathname === '/'
                    ? 'text-accent bg-accent/10 font-semibold'
                    : 'text-text-muted hover:text-text hover:bg-hover'
                )}
              >
                Trang chủ
              </Link>

              {/* Làm việc Dropdown */}
              {(() => {
                const group = navGroups[0]
                const isOpen = activeDropdown === group.name
                const isGroupActive = group.sections.some((sec) =>
                  sec.items.some((item) => pathname === item.href)
                )
                return (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : group.name)}
                      className={clsx(
                        'flex items-center gap-1 px-2.5 py-2 text-sm font-medium rounded-lg transition-all',
                        isOpen || isGroupActive
                          ? 'text-accent bg-accent/10 font-semibold'
                          : 'text-text-muted hover:text-text hover:bg-hover'
                      )}
                      aria-expanded={isOpen}
                    >
                      <span>AI Work</span>
                      <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-fast', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-bg-surface border border-border shadow-2xl p-2.5 z-50">
                        {group.sections.map((section) => (
                          <div key={section.label} className="space-y-1">
                            <span className="block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                              {section.label}
                            </span>
                            {section.items.map((item) => {
                              const Icon = item.icon
                              const isActive = pathname === item.href
                              return (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className={clsx(
                                    'flex items-start gap-3 p-2.5 rounded-xl transition-all',
                                    isActive ? 'bg-accent/15 text-accent' : 'hover:bg-hover text-text group'
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
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Khám phá Dropdown */}
              {navGroups.slice(1).map((group) => {
                const isOpen = activeDropdown === group.name
                const isGroupActive = group.sections.some((sec) =>
                  sec.items.some((item) => pathname === item.href)
                )

                return (
                  <div key={group.name} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : group.name)}
                      className={clsx(
                        'flex items-center gap-1 px-2.5 py-2 text-sm font-medium rounded-lg transition-all',
                        isOpen || isGroupActive
                          ? 'text-accent bg-accent/10 font-semibold'
                          : 'text-text-muted hover:text-text hover:bg-hover'
                      )}
                      aria-expanded={isOpen}
                    >
                      <span>{group.name}</span>
                      <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-fast', isOpen && 'rotate-180')} />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-bg-surface border border-border shadow-2xl p-2.5 z-50">
                        <div className="space-y-2">
                          {group.sections.map((section, sIdx) => (
                            <div
                              key={section.label}
                              className={clsx(sIdx > 0 && 'border-t border-border/60 pt-2 mt-2')}
                            >
                              <span
                                className={clsx(
                                  'block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                                  section.audience === 'everyday' ? 'text-accent' : 'text-brand-500'
                                )}
                              >
                                {section.label}
                              </span>
                              <div className="space-y-1">
                                {section.items.map((item) => {
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
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Tổng quan (Dashboard) */}
              <Link
                href="/dashboard"
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-all',
                  pathname === '/dashboard'
                    ? 'text-accent bg-accent/10 font-semibold'
                    : 'text-text-muted hover:text-text hover:bg-hover'
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tổng quan</span>
              </Link>

              {/* Tài khoản (bao gồm đã lưu & lịch sử Workspace) */}
              <Link
                href="/account"
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-all',
                  pathname === '/account' || pathname === '/favorites'
                    ? 'text-accent bg-accent/10 font-semibold'
                    : 'text-text-muted hover:text-text hover:bg-hover'
                )}
              >
                <User className="w-4 h-4" />
                <span>Tài khoản</span>
              </Link>
            </div>

            {/* Right Controls: Search, Favorites Shortcut & Theme */}
            <div className="hidden sm:flex items-center gap-2">
              <CommandPaletteTrigger isOpen={commandPaletteOpen} onOpen={() => setCommandPaletteOpen(true)} />
              <Link
                href="/favorites"
                className={clsx(
                  'p-2 rounded-lg border transition-colors hidden xl:inline-flex',
                  pathname === '/favorites'
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-text-muted hover:text-accent'
                )}
                aria-label="Mục yêu thích đã lưu"
                title="Mục yêu thích đã lưu"
              >
                <Bookmark className="w-4 h-4" />
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <CommandPaletteTrigger isOpen={commandPaletteOpen} onOpen={() => setCommandPaletteOpen(true)} />
              <ThemeToggle />
              <button
                type="button"
                className="p-2 text-text-muted hover:text-text transition-colors rounded-lg border border-border"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
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
              mobileMenuOpen ? 'max-h-[85vh] opacity-100 mt-4 pt-4 pb-6 border-t border-border overflow-y-auto bg-bg/95 backdrop-blur-xl' : 'max-h-0 opacity-0'
            )}
            role="navigation"
            aria-label="Điều hướng di động"
          >
            <div className="space-y-4 pb-4">
              {/* Prominent Mobile AI Workspace CTA */}
              <Link
                href="/workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-accent text-white text-sm font-semibold shadow-sm"
              >
                <Play className="w-4 h-4" />
                <span>Mở AI Workspace</span>
              </Link>

              {/* 6 link chính trên mobile */}
              <div className="space-y-1">
                {mobileMainLinks.map((item) => {
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

              {/* Xem thêm: toàn bộ menu */}
              <button
                type="button"
                onClick={() => setShowAllMobileNav((prev) => !prev)}
                aria-expanded={showAllMobileNav}
                className="flex items-center justify-center gap-1 w-full py-2 px-4 rounded-xl border border-border bg-bg text-xs font-semibold text-text transition-colors"
              >
                <span>{showAllMobileNav ? 'Thu gọn menu' : 'Xem thêm'}</span>
                <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', showAllMobileNav && 'rotate-180')} />
              </button>

              {showAllMobileNav && (
                <div className="space-y-4">
                  {navGroups.map((group) => (
                    <div key={group.name} className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-2 block">
                        {group.name}
                      </span>
                      <div className="space-y-2">
                        {group.sections.map((section) => (
                          <div key={section.label} className="space-y-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-3 block text-accent">
                              {section.label}
                            </span>
                            <div className="grid grid-cols-1 gap-1">
                              {section.items.map((item) => {
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
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-border grid grid-cols-3 gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-border bg-bg text-xs font-medium text-text"
                >
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span>Tài khoản</span>
                </Link>
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-border bg-bg text-xs font-medium text-text"
                >
                  <Bookmark className="w-3.5 h-3.5 text-accent" />
                  <span>Yêu thích</span>
                </Link>
                <Link
                  href="/submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-accent/40 bg-accent/10 text-accent text-xs font-semibold"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Đóng góp</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {commandPaletteOpen && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </>
  )
}
