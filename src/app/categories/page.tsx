import { Metadata } from 'next';
import { getAllCategories } from '@/lib/data';
import { CategoryGrid } from '@/components/category-grid';

export const metadata: Metadata = {
  title: 'Tất cả danh mục kiến thức AI | AI Life Hub',
  description: 'Khám phá hơn 16 danh mục kỹ năng, prompt templates và tài nguyên AI ứng dụng toàn diện vào công việc và đời sống.',
  openGraph: {
    title: 'Tất cả danh mục AI | AI Life Hub',
    description: 'Hệ thống kiến thức AI đa ngành từ Prompt Engineering, Coding, Viết lách, Thiết kế đến Tài chính và Y tế.',
    type: 'website',
  },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <CategoryGrid categories={categories} variant="all" />
    </div>
  );
}
