import Link from 'next/link'
import { Github, Twitter, MessageSquare, Mail, ArrowRight, Heart, BookOpen, Code, Zap, Brain, Globe, Shield } from 'lucide-react'
import { clsx } from 'clsx'

const footerLinks = {
  product: [
    { name: 'Categories', href: '/categories' },
    { name: 'Resources', href: '/resources' },
    { name: 'Favorites', href: '/favorites' },
    { name: 'Submit Tool', href: '/submit' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
}

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/ai-life-hub', icon: Github, external: true },
  { name: 'Twitter', href: 'https://twitter.com/ailifehub', icon: Twitter, external: true },
  { name: 'Discord', href: 'https://discord.gg/ailifehub', icon: MessageSquare, external: true },
  { name: 'Email', href: 'mailto:hello@ailifehub.dev', icon: Mail, external: true },
]

const categories = [
  { name: 'Chat & Assistants', count: 42, icon: Brain, href: '/categories/chat-assistants' },
  { name: 'Image Generation', count: 28, icon: Zap, href: '/categories/image-generation' },
  { name: 'Video Generation', count: 15, icon: Code, href: '/categories/video-generation' },
  { name: 'Audio & Voice', count: 19, icon: Globe, href: '/categories/audio-voice' },
  { name: 'Code & Development', count: 35, icon: Code, href: '/categories/code-development' },
  { name: 'Productivity', count: 31, icon: Zap, href: '/categories/productivity' },
  { name: 'Writing & Content', count: 24, icon: BookOpen, href: '/categories/writing-content' },
  { name: 'Design & Creative', count: 22, icon: Heart, href: '/categories/design-creative' },
  { name: 'Data & Analytics', count: 18, icon: Brain, href: '/categories/data-analytics' },
  { name: 'Marketing & SEO', count: 20, icon: Zap, href: '/categories/marketing-seo' },
  { name: 'Learning & Education', count: 16, icon: BookOpen, href: '/categories/learning-education' },
  { name: 'Research & Analysis', count: 14, icon: Shield, href: '/categories/research-analysis' },
]

export function Footer() {
  return (
    <footer className="bg-bg-elevated border-t border-border" role="contentinfo">
      <div className="container mx-auto px-section-x py-section-y">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-text font-display font-bold text-xl mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md"
              aria-label="AI Life Hub Home"
            >
              <span className="text-accent">AI</span>
              <span className="text-text">Life Hub</span>
            </Link>
            <p className="text-text-muted text-base mb-6 max-w-xs leading-relaxed">
              Discover the best AI tools and resources to supercharge your workflow. Curated, categorized, and kept up to date.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={clsx(
                    'p-2 rounded-lg transition-all duration-fast',
                    'text-text-muted hover:text-text hover:bg-hover',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
                  )}
                  aria-label={link.name}
                >
                  <link.icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <nav aria-label="Product">
            <h3 className="font-semibold text-text mb-4">Product</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'text-text-muted hover:text-accent transition-colors duration-fast',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Links */}
          <nav aria-label="Company">
            <h3 className="font-semibold text-text mb-4">Company</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'text-text-muted hover:text-accent transition-colors duration-fast',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal">
            <h3 className="font-semibold text-text mb-4">Legal</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'text-text-muted hover:text-accent transition-colors duration-fast',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Categories Grid */}
        <div className="border-t border-border pt-12 mb-12">
          <h3 className="font-semibold text-text mb-6">Browse Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-fast',
                  'bg-hover text-text-muted hover:text-text hover:bg-hover/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                  'border border-border'
                )}
              >
                <category.icon size={16} className="text-accent shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium truncate">{category.name}</span>
                <span className="text-xs text-text-subtle bg-bg px-1.5 py-0.5 rounded-full shrink-0">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border pt-12 mb-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-semibold text-text mb-2">Stay Updated</h3>
            <p className="text-text-muted mb-6">
              Get the latest AI tools and resources delivered to your inbox weekly. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/api/newsletter" method="POST">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className={clsx(
                  'flex-1 px-4 py-3 rounded-lg',
                  'bg-bg border border-border text-text placeholder-text-subtle',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent',
                  'transition-colors duration-fast'
                )}
                autoComplete="email"
              />
              <button
                type="submit"
                className={clsx(
                  'px-6 py-3 rounded-lg font-medium',
                  'bg-accent text-text-inverse hover:bg-accent-hover',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                  'transition-colors duration-fast flex items-center gap-2 justify-center'
                )}
              >
                Subscribe
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
            <p className="text-xs text-text-subtle mt-4">
              By subscribing, you agree to our{' '}
              <Link href="/privacy" className="underline hover:text-accent">Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-text-subtle text-sm">
            © {new Date().getFullYear()} AI Life Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-text-subtle hover:text-accent transition-colors duration-fast"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-text-subtle hover:text-accent transition-colors duration-fast"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-text-subtle hover:text-accent transition-colors duration-fast"
            >
              Cookies
            </Link>
            <span className="text-text-subtle" aria-hidden="true">
              Made with ❤️ for the AI community
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
