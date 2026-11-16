import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['monospace'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-life-hub.vercel.app'),
  title: {
    default: 'AI Life Hub — Khám phá, Học tập & Triển khai AI cho cuộc sống',
    template: '%s | AI Life Hub',
  },
  description: 'Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI vào cuộc sống và công việc hàng ngày.',
  keywords: [
    'AI', 'Artificial Intelligence', 'Prompt Engineering', 'Machine Learning',
    'LLM', 'Generative AI', 'AI Skills', 'AI Tutorials', 'AI Resources',
    'Prompt Library', 'AI Agents', 'AI Workflow'
  ],
  authors: [{ name: 'AI Life Hub Team' }],
  creator: 'AI Life Hub',
  publisher: 'AI Life Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ai-life-hub.vercel.app',
    siteName: 'AI Life Hub',
    title: 'AI Life Hub — Khám phá, Học tập & Triển khai AI cho cuộc sống',
    description: 'Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI vào cuộc sống và công việc hàng ngày.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Life Hub - Nền tảng kiến thức AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Life Hub — Khám phá, Học tập & Triển khai AI cho cuộc sống',
    description: 'Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI.',
    images: ['/og-image.png'],
    creator: '@ailifehub',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1" id="main-content">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}