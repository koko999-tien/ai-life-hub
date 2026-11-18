import { Metadata } from 'next';
import { getAllCategories } from '@/lib/data';
import { CategoryGrid } from '@/components/category-grid';

export const metadata: Metadata = {
  title: 'Tất cả Danh mục',
  description: 'Khám phá 16 danh mục kỹ năng, câu lệnh mẫu và tài nguyên AI ứng dụng toàn diện vào công việc và đời sống.',
  alternates: {
    canonical: '/categories',
  },
  openGraph: {
    title: 'Tất cả Danh mục | AI Life Hub',
    description: 'Hệ thống kiến thức AI đa ngành từ cách viết câu lệnh hiệu quả, lập trình, viết lách, thiết kế đến tài chính và y tế.',
    url: '/categories',
    type: 'website',
  },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <h1 className="sr-only">Tất cả Danh mục</h1>
      <CategoryGrid categories={categories} variant="all" />
    </div>
  );
}
