import Link from 'next/link'
import { Github, Mail, Sparkles, BookOpen, Code, Zap, Brain, Globe, Shield, Heart } from 'lucide-react'

const footerNav = {
  explore: [
    { name: 'AI Workspace (Làm việc ngay)', href: '/workspace' },
    { name: 'Công Việc AI (8 nhóm việc)', href: '/ai-work' },
    { name: 'Thư viện Câu lệnh', href: '/prompts' },
    { name: 'Tất cả danh mục', href: '/categories' },
    { name: 'Dự Án Nghiên Cứu Mở', href: '/ecosystem' },
  ],
  tools: [
    { name: 'Trung tâm Builder Lab', href: '/builder-lab' },
    { name: 'So Sánh Sức Mạnh AI', href: '/compare' },
    { name: 'Tính Chi Phí Sử Dụng AI', href: '/tools/token-calculator' },
    { name: 'Xưởng Tạo Câu Lệnh Chuẩn', href: '/tools/system-prompt-builder' },
    { name: 'Tối Ưu Hóa Câu Lệnh', href: '/tools/prompt-optimizer' },
    { name: 'Mẫu Thiết Kế Trợ Lý AI', href: '/agents' },
  ],
  learn: [
    { name: 'Tài khoản & Dữ liệu cá nhân', href: '/account' },
    { name: 'Danh sách Yêu thích', href: '/favorites' },
    { name: 'Cẩm Nang Thực Chiến', href: '/playbooks' },
    { name: 'Sổ Tay Tra Cứu Nhanh', href: '/cheatsheet' },
    { name: 'Trắc Nghiệm Kiến Thức AI', href: '/learn/quiz' },
    { name: 'Đóng góp câu lệnh mới', href: '/submit' },
  ],
  about: [
    { name: 'Về AI Life Hub', href: '/about' },
    { name: 'Liên hệ & Hỗ trợ', href: '/contact' },
    { name: 'Chính sách Quyền riêng tư', href: '/privacy' },
    { name: 'Điều khoản Dịch vụ', href: '/terms' },
  ]
}

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/koko999-tien/ai-life-hub', icon: Github, external: true },
  { name: 'Email liên hệ', href: 'mailto:contact@ailifehub.dev', icon: Mail, external: true },
]

const categories = [
  { name: 'Kỹ năng đặt câu lệnh AI', icon: Brain, href: '/category/prompt-engineering' },
  { name: 'Học tập & Tự học', icon: BookOpen, href: '/category/learning' },
  { name: 'Lập trình & Kỹ thuật', icon: Code, href: '/category/coding' },
  { name: 'Viết lách & Nội dung', icon: Zap, href: '/category/writing' },
  { name: 'Thiết kế & Sáng tạo', icon: Heart, href: '/category/design' },
  { name: 'Công việc & Sự nghiệp', icon: Zap, href: '/category/work' },
  { name: 'Tài chính & Đầu tư', icon: Brain, href: '/category/finance' },
  { name: 'Sức khỏe & Thể chất', icon: Heart, href: '/category/health' },
  { name: 'Nghiên cứu & Phân tích', icon: Shield, href: '/category/research' },
  { name: 'Khởi nghiệp & Dự án phụ', icon: Globe, href: '/category/sideproject' },
  { name: 'Gia đình & Đời sống', icon: Heart, href: '/category/family' },
  { name: 'Tất cả danh mục', icon: BookOpen, href: '/categories' },
]

export function Footer() {
  return (
    <footer className="bg-bg-elevated border-t border-border mt-20" role="contentinfo">
      <div className="container mx-auto px-section-x py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-text font-display font-bold text-2xl transition-transform active:scale-95"
              aria-label="Trang chủ AI Life Hub"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 via-accent to-accent-600 text-white shadow-sm shadow-accent/25 ring-1 ring-white/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center tracking-tight">
                <span className="bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent font-extrabold">AI</span>
                <span className="text-text ml-1 font-bold">Life Hub</span>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              Nền tảng chia sẻ câu lệnh mẫu thực chiến, thư viện kỹ năng và bộ công cụ ứng dụng AI dành cho người đi làm &amp; cộng đồng sáng tạo Việt Nam.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="p-2.5 rounded-xl border border-border bg-bg text-text-muted hover:text-accent hover:border-accent/40 transition-all shadow-sm"
                  aria-label={link.name}
                >
                  <link.icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: Explore */}
          <nav aria-label="Khám phá">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider mb-4">Khám phá</h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {footerNav.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2: Tools */}
          <nav aria-label="Công cụ AI">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider mb-4">Công cụ AI</h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {footerNav.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Learn */}
          <nav aria-label="Học tập">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider mb-4">Học tập &amp; Hướng dẫn</h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {footerNav.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: About & Legal */}
          <nav aria-label="Thông tin">
            <h3 className="font-bold text-sm text-text uppercase tracking-wider mb-4">Thông tin</h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {footerNav.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-border pt-10 mb-10">
          <h3 className="font-bold text-sm text-text uppercase tracking-wider mb-5">Danh mục Kỹ năng Phổ biến</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-bg border border-border text-text-muted hover:text-accent hover:border-accent/40 transition-all text-xs font-medium"
              >
                <category.icon size={15} className="text-accent shrink-0" aria-hidden="true" />
                <span className="truncate">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-xs text-text-muted">
          <p>
            © {new Date().getFullYear()} AI Life Hub. Bản quyền mã nguồn mở dành cho cộng đồng.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Quyền riêng tư
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Điều khoản
            </Link>
            <Link href="/contact" className="hover:text-accent transition-colors">
              Liên hệ
            </Link>
            <span className="text-text-subtle font-medium">
              Xây dựng bằng ❤️ vì Người đi làm &amp; Cộng đồng Thực hành AI Việt Nam
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
