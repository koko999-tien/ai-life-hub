import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryHero } from '@/components/category/category-hero';
import { SkillGrid } from '@/components/category/skill-grid';
import { CategorySidebar } from '@/components/category/category-sidebar';
import { CategoryResources } from '@/components/category/category-resources';
import { getCategory, getSkillsByCategory, getResourcesByCategory, getAllCategories } from '@/lib/data';
import { Category } from '@/lib/data';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.slug);

  if (!category) {
    return { title: 'Danh mục không tồn tại' };
  }

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} | AI Life Hub`,
      description: category.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const skills = getSkillsByCategory(category.slug);
  const resources = getResourcesByCategory(category.slug);

  return (
    <div className="min-h-screen">
      <CategoryHero category={category} />

      <div className="container py-8 lg:py-12">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <CategorySidebar category={category} skills={skills} />
          </aside>

          <main className="lg:col-span-3 order-1 lg:order-2">
            <SkillGrid skills={skills} category={category} />

            {resources.length > 0 && (
              <CategoryResources resources={resources} category={category} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}