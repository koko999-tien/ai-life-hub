import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryHero } from '@/components/category/CategoryHero';
import { CategoryContentClient } from '@/components/category/CategoryContentClient';
import { SafetyDisclaimer } from '@/components/ui/SafetyDisclaimer';
import { getCategory, getSkillsByCategory, getResourcesByCategory, getAllCategories } from '@/lib/data';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    return { title: 'Danh mục không tồn tại' };
  }

  const canonicalPath = `/category/${category.slug}`;

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${category.name} | AI Life Hub`,
      description: category.description,
      url: canonicalPath,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const [allCategories, skills, resources] = await Promise.all([
    getAllCategories(),
    getSkillsByCategory(category.id),
    getResourcesByCategory(category.id),
  ]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container pt-2 pb-8 lg:pb-12 space-y-8 lg:space-y-10">
        <CategoryHero category={category} />

        <SafetyDisclaimer categoryId={category.id} />

        <CategoryContentClient
          categories={allCategories}
          currentCategory={category}
          skills={skills}
          resources={resources}
        />
      </div>
    </div>
  );
}
