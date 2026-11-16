import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Sparkles, BookOpen, Code2, Users } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Danh mục', href: '/category' },
    { name: 'Kỹ năng', href: '/skill' },
    { name: 'Tài nguyên', href: '/resources' },
    { name: 'Tìm kiếm', href: '/search' },
    { name: 'Prompt Library', href: '/prompts' },
  ],
  learn: [
    { name: 'Hướng dẫn bắt đầu', href: '/guides/getting-started' },
    { name: 'Prompt Engineering', href: '/guides/prompt-engineering' },
    { name: 'AI Agents', href: '/guides/ai-agents' },
    { name: 'Best Practices', href: '/guides/best-practices' },
    { name: 'Case Studies', href: '/case-studies' },
  ],
  community: [
    { name: 'GitHub', href: 'https://github.com/ai-life-hub', external: true },
    { name: 'Discord', href: 'https://discord.gg/ai-life-hub', external: true },
    { name: 'Twitter', href: 'https://twitter.com/ailifehub', external: true },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/ai-life-hub', external: true },
    { name: 'Newsletter', href: '/newsletter' },
  ],
  legal: [
    { name: 'Quy định sử dụng', href: '/terms' },
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/ai-life-hub', icon: Github, external: true },
  { name: 'Twitter', href: 'https://twitter.com/ailifehub', icon: Twitter, external: true },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/ai-life-hub', icon: Linkedin, external: true },
  { name: 'Email', href: 'mailto:hello@ai-life-hub.com', icon: Mail, external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30" role="contentinfo">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-4" aria-label="AI Life Hub - Trang chủ">
              <span className="text-gradient">AI Life Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI vào cuộc sống và công việc hàng ngày.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Product">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Sản phẩm</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Learn">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Học tập</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Community">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Cộng đồng</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                    {link.external && <span className="text-xs" aria-hidden="true">↗</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Pháp lý</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Life Hub. Được xây dựng với
              <span className="text-primary" aria-hidden="true"> ❤️ </span>
              và AI.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Next.js 14
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                TypeScript
              </span>
              <span className="flex items-center gap-1">
                <Code2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Tailwind CSS
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}