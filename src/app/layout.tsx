import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { SkipLink } from '@/components/layout/SkipLink';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['monospace'],
  weight: ['400', '500', '600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-life-hub-omega.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'AI Life Hub — Ứng dụng AI vào Công việc & Cuộc sống Dễ Hiểu, Dùng Được Ngay',
    template: '%s | AI Life Hub',
  },
  description:
    'Kho câu lệnh AI thực chiến giúp viết email, làm báo cáo, tóm tắt tài liệu trong 30 giây — cùng bộ công cụ tính chi phí, so sánh các dòng AI và thiết kế trợ lý tự động cho lập trình viên.',
  keywords: [
    'AI Life Hub',
    'ứng dụng AI',
    'câu lệnh AI tiếng Việt',
    'thư viện câu lệnh AI',
    'công cụ AI cho người đi làm',
    'viết email bằng AI',
    'so sánh mô hình AI',
    'tính chi phí AI VNĐ',
    'trợ lý AI',
    'học AI cơ bản',
    'ChatGPT',
    'Claude',
    'Gemini',
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
    url: siteUrl,
    siteName: 'AI Life Hub',
    title: 'AI Life Hub — Ứng dụng AI vào Công việc & Cuộc sống Dễ Hiểu, Dùng Được Ngay',
    description:
      'Kho câu lệnh AI thực chiến giúp viết email, làm báo cáo, tóm tắt tài liệu trong 30 giây — cùng bộ công cụ tính chi phí, so sánh các dòng AI và thiết kế trợ lý tự động cho lập trình viên.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Life Hub — Kho câu lệnh và công cụ ứng dụng AI tiếng Việt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Life Hub — Ứng dụng AI vào Công việc & Cuộc sống Dễ Hiểu, Dùng Được Ngay',
    description:
      'Kho câu lệnh AI thực chiến giúp viết email, làm báo cáo, tóm tắt tài liệu trong 30 giây — cùng bộ công cụ chuyên sâu cho lập trình viên.',
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
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <SkipLink />
          <Header />
          <main
            className="flex-1 [&:not(:has(>.pt-24)):not(:has(>.pt-20))]:pt-20 focus:outline-hidden"
            id="main-content"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}