import { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { AudienceSplitSection } from '@/components/home/AudienceSplitSection';
import { CategoryGrid } from '@/components/category-grid';
import { StatsBar } from '@/components/stats-bar';
import { FeaturedPrompts } from '@/components/featured-prompts';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { getFeaturedCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'AI Life Hub — Kho Câu Lệnh & Công Cụ AI Thực Chiến Tiếng Việt',
  description:
    'Kho 80+ mẫu câu lệnh AI dùng ngay cho công việc và đời sống, kèm bộ công cụ tính chi phí theo VNĐ, so sánh các dòng AI và mẫu trợ lý tự động cho lập trình viên.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Life Hub — Kho Câu Lệnh & Công Cụ AI Thực Chiến Tiếng Việt',
    description:
      'Kho 80+ mẫu câu lệnh AI dùng ngay cho công việc và đời sống, kèm bộ công cụ tính chi phí theo VNĐ, so sánh các dòng AI và mẫu trợ lý tự động.',
    url: '/',
    type: 'website',
  },
};

export default async function HomePage() {
  const featuredCategories = await getFeaturedCategories();

  return (
    <>
      <Hero />
      <AudienceSplitSection />
      <CategoryGrid categories={featuredCategories} variant="featured" />
      <StatsBar />
      <FeaturedPrompts />
      <NewsletterSignup />
    </>
  );
}