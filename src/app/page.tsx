import { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { AudienceSplitSection } from '@/components/home/AudienceSplitSection';
import { CategoryGrid } from '@/components/category-grid';
import { StatsBar } from '@/components/stats-bar';
import { FeaturedPrompts } from '@/components/featured-prompts';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { getFeaturedCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'AI Life Hub — Trạm Tri Thức & Công Cụ Trí Tuệ Nhân Tạo Thực Chiến',
  description: 'Kho mẫu câu lệnh (Prompts) thực tế, công cụ tính chi phí token, so sánh mô hình AI và kiến trúc Agent giúp tăng hiệu suất làm việc mỗi ngày.',
  openGraph: {
    title: 'AI Life Hub — Trạm Tri Thức & Công Cụ Trí Tuệ Nhân Tạo Thực Chiến',
    description: 'Kho mẫu câu lệnh (Prompts) thực tế, công cụ tính chi phí token, so sánh mô hình AI và kiến trúc Agent giúp tăng hiệu suất làm việc mỗi ngày.',
    type: 'website',
  },
};

export default function HomePage() {
  const featuredCategories = getFeaturedCategories();

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