import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryHero } from '@/components/category/CategoryHero';
import { CategorySidebar } from '@/components/category/CategorySidebar';
import { SkillCard } from '@/components/skill/SkillCard';
import { getCategory, getSkillsByCategory, getResourcesByCategory, getAllCategories } from '@/lib/data';
import type { Category } from '@/types';
import { ExternalLink } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

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
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const allCategories = await getAllCategories();
  const skills = await getSkillsByCategory(category.id);
  const resources = await getResourcesByCategory(category.id);

  return (
    <div className="min-h-screen">
      <CategoryHero category={category} />

      <div className="container py-8 lg:py-12">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <CategorySidebar categories={allCategories} currentCategory={category} />
          </aside>

          <main className="lg:col-span-3 order-1 lg:order-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>

            {skills.length === 0 && (
              <p className="text-muted-foreground py-8">Chưa có kỹ năng nào trong danh mục này.</p>
            )}

            {resources.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold mb-4">Tài nguyên tham khảo</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card p-4 block hover:border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-secondary capitalize text-xs">{res.type}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-foreground">{res.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{res.description}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}