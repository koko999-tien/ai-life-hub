import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSkill, getAllSkills, getCategory } from '@/lib/data';
import { SkillDetail } from '@/components/skill/SkillDetail';
import { SafetyDisclaimer } from '@/components/ui/SafetyDisclaimer';
import { resolveCategoryName } from '@/components/skill/categoryHelpers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const skill = await getSkill(resolvedParams.slug);

  if (!skill) {
    return { title: 'Kỹ năng không tồn tại' };
  }

  const canonicalPath = `/skill/${skill.slug}`;

  return {
    title: skill.name,
    description: skill.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${skill.name} | AI Life Hub`,
      description: skill.description,
      url: canonicalPath,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((skill) => ({ slug: skill.slug }));
}

export default async function SkillPage({ params }: SkillPageProps) {
  const resolvedParams = await params;
  const skill = await getSkill(resolvedParams.slug);

  if (!skill) {
    notFound();
  }

  const [allSkills, category] = await Promise.all([
    getAllSkills(),
    getCategory(skill.categoryId),
  ]);

  const relatedSkills = allSkills
    .filter(
      (s) =>
        skill.relatedSkillIds?.includes(s.id) ||
        (s.categoryId === skill.categoryId && s.id !== skill.id)
    )
    .slice(0, 3);

  const categoryHref = `/category/${category?.slug || skill.categoryId}`;
  const categoryName = category?.name ?? resolveCategoryName(skill.categoryId);

  return (
    <div className="min-h-screen pt-24 pb-8 lg:pb-12">
      <div className="container max-w-5xl">
        <nav aria-label="Điều hướng phân cấp" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={categoryHref} className="hover:text-accent transition-colors">
                {categoryName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text font-medium">
              {skill.name}
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <SafetyDisclaimer categoryId={skill.categoryId} />
        </div>

        <SkillDetail skill={skill} relatedSkills={relatedSkills} />

        <div className="mt-12 text-center">
          <Link
            href={categoryHref}
            className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Quay lại danh mục {categoryName}
          </Link>
        </div>
      </div>
    </div>
  );
}
