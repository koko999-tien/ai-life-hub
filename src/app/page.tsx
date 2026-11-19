import { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AudienceSplitSection } from '@/components/home/AudienceSplitSection';
import { CategoryGrid } from '@/components/category-grid';
import { StatsBar } from '@/components/stats-bar';
import { FeaturedPrompts } from '@/components/featured-prompts';
import { HomeFinalCta } from '@/components/home/HomeFinalCta';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { getFeaturedCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'AI Life Hub — Không Gian Thực Thi Công Việc AI & Builder Lab Tiếng Việt',
  description:
    'Hoàn thành công việc thực tế trong AI Workspace (Email, Tóm tắt họp, Phân tích tài liệu), tra cứu 80+ câu lệnh tiếng Việt và bộ công cụ kỹ thuật xác thực cho lập trình viên.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Life Hub — Không Gian Thực Thi Công Việc AI & Builder Lab Tiếng Việt',
    description:
      'AI không chỉ để trò chuyện — hãy dùng AI để hoàn thành công việc với AI Workspace, 80+ mẫu câu lệnh và Builder Lab xác thực.',
    url: '/',
    type: 'website',
  },
};

export default async function HomePage() {
  const featuredCategories = await getFeaturedCategories();

  return (
    <>
      <Hero />
      <MarqueeStrip />
      <HowItWorks />
      <AudienceSplitSection />
      <CategoryGrid categories={featuredCategories} variant="featured" />
      <StatsBar />
      <FeaturedPrompts />
      <HomeFinalCta />
      <NewsletterSignup />
    </>
  );
}
