import { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { CategoryGrid } from '@/components/category-grid';
import { StatsBar } from '@/components/stats-bar';
import { FeaturedPrompts } from '@/components/featured-prompts';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { getFeaturedCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Khám phá, Học tập & Triển khai AI cho cuộc sống',
  description: 'Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI vào cuộc sống và công việc hàng ngày.',
  openGraph: {
    title: 'AI Life Hub — Khám phá, Học tập & Triển khai AI cho cuộc sống',
    description: 'Nền tảng tổng hợp kiến thức AI, prompt engineering, kỹ năng thực hành và tài nguyên triển khai AI.',
    type: 'website',
  },
};

export default function HomePage() {
  const featuredCategories = getFeaturedCategories();

  return (
    <>
      <Hero />
      <CategoryGrid categories={featuredCategories} variant="featured" />
      <StatsBar />
      <FeaturedPrompts />
      <NewsletterSignup />
    </>
  );
}