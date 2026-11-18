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
  GraduationCap,
  FolderGit2,
  FileText
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
    name: 'Khám phá',
    sections: [
      {
        label: 'Dùng ngay cho mọi người',
        audience: 'everyday',
        items: [
          { name: 'Tất cả Danh mục', href: '/categories', desc: '16 lĩnh vực ứng dụng AI đời sống & công việc', icon: Layers },
          { name: 'Thư viện Câu lệnh', href: '/prompts', desc: 'Hơn 80+ câu lệnh mẫu thực chiến dùng ngay', icon: Sparkles },
        ],
      },
      {
        label: 'Dành cho Lập trình viên & Kỹ thuật',
        audience: 'builder',
        items: [
          { name: 'Mẫu Thiết Kế Trợ Lý AI', href: '/agents', desc: '14 kiến trúc trợ lý AI chuyên trách công việc', icon: Terminal },
          { name: 'Quy Trình AI Đa Nhiệm', href: '/workflows', desc: 'Phối hợp nhiều trợ lý tự động hóa dự án lớn', icon: FileCode },
          { name: 'Dự Án Nghiên Cứu Mở', href: '/ecosystem', desc: 'Công trình kiểm định, văn thư hành chính & công nghệ', icon: FolderGit2 },
        ],
      },
    ],
  },
  {
    name: 'Công cụ AI',
    sections: [
      {
        label: 'Dùng ngay cho mọi người',
        audience: 'everyday',
        items: [
          { name: 'Tối Ưu Hóa Câu Lệnh', href: '/tools/prompt-optimizer', desc: 'Biến yêu cầu ngắn gọn thành câu lệnh rõ ràng, dễ hiểu', icon: Sliders },
          { name: 'Khu Thử Nghiệm AI', href: '/playground', desc: 'Thử nghiệm câu lệnh trực tiếp trong mô phỏng an toàn', icon: Sparkles },
        ],
      },
      {
        label: 'Dành cho Lập trình viên & Kỹ thuật',
        audience: 'builder',
        items: [
          { name: 'Tính Chi Phí Sử Dụng AI', href: '/tools/token-calculator', desc: 'Bảng quy đổi độ dài chữ & đơn vị xử lý (Token) ra tiền VNĐ', icon: Calculator },
          { name: 'Xưởng Tạo Câu Lệnh Chuẩn', href: '/tools/system-prompt-builder', desc: 'Thiết lập vai trò, quy tắc ràng buộc và định dạng cho AI', icon: Terminal },
          { name: 'So Sánh Sức Mạnh AI', href: '/compare', desc: 'Đối chiếu các dòng AI: Claude, GPT, DeepSeek, Gemini', icon: Scale },
        ],
      },
    ],
  },
  {
    name: 'Học tập & Tri thức',
    sections: [
      {
        label: 'Dùng ngay cho mọi người',
        audience: 'everyday',
        items: [
          { name: 'Trắc Nghiệm Kiến Thức AI', href: '/learn/quiz', desc: 'Kiểm tra mức độ thành thạo ứng dụng AI thực tế', icon: GraduationCap },
          { name: 'Kho Tài Nguyên Chọn Lọc', href: '/resources', desc: 'Khóa học, bài viết và công cụ hữu ích miễn phí', icon: Layers },
        ],
      },
      {
        label: 'Dành cho Lập trình viên & Kỹ thuật',
        audience: 'builder',
        items: [
          { name: 'Cẩm Nang Thực Chiến', href: '/playbooks', desc: 'Phương pháp làm chủ AI từ các tài liệu chuyên sâu', icon: BookOpen },
          { name: 'Sổ Tay Tra Cứu Nhanh', href: '/cheatsheet', desc: 'Mẹo viết câu lệnh, dữ liệu có cấu trúc (JSON) & tham số AI', icon: FileText },
        ],
      },
    ],
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  // Lock body scroll when mobile menu is open
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
    setActiveDropdown(null)
  }, [pathname])

  // Close dropdown on click outside or Escape
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
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-text font-display font-bold text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg shrink-0 transition-transform active:scale-95"
            aria-label="Trang chủ AI Life Hub"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 via-accent to-accent-600 text-white shadow-sm shadow-accent/25 ring-1 ring-white/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center tracking-tight">
              <span className="bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent font-extrabold">AI</span>
              <span className="text-text ml-1 font-bold">Life Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1.5">
            {navGroups.map((group) => {
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
                    <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-bg-surface border border-border shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-fast">
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
            <CommandPaletteTrigger isOpen={commandPaletteOpen} onOpen={() => setCommandPaletteOpen(true)} />
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
            mobileMenuOpen ? 'max-h-[85vh] opacity-100 mt-4 pt-4 pb-6 border-t border-border overflow-y-auto bg-bg/95 backdrop-blur-xl' : 'max-h-0 opacity-0'
          )}
          role="navigation"
          aria-label="Điều hướng di động"
        >
          <div className="space-y-4 pb-4">
            {navGroups.map((group) => (
              <div key={group.name} className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-2 block">
                  {group.name}
                </span>
                <div className="space-y-2">
                  {group.sections.map((section) => (
                    <div key={section.label} className="space-y-1">
                      <span
                        className={clsx(
                          'text-[10px] font-semibold uppercase tracking-wider px-3 block',
                          section.audience === 'everyday' ? 'text-accent' : 'text-brand-500'
                        )}
                      >
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
      {commandPaletteOpen && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </>
  )
}
