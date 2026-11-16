import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSkill, getAllSkills } from '@/lib/data';
import { SkillDetail } from '@/components/skill/SkillDetail';
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

  return {
    title: `${skill.name} | AI Life Hub`,
    description: skill.description,
    openGraph: {
      title: `${skill.name} | AI Life Hub`,
      description: skill.description,
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

  const allSkills = await getAllSkills();
  const relatedSkills = allSkills.filter(
    (s) => skill.relatedSkillIds?.includes(s.id) || (s.categoryId === skill.categoryId && s.id !== skill.id)
  ).slice(0, 3);

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="container max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/category/${skill.categoryId}`} className="hover:text-primary transition-colors capitalize">
                {skill.categoryId}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground font-medium">
              {skill.name}
            </li>
          </ol>
        </nav>

        <SkillDetail skill={skill} relatedSkills={relatedSkills} />

        <div className="mt-12 text-center">
          <Link
            href={`/category/${skill.categoryId}`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Quay lại danh mục
          </Link>
        </div>
      </div>
    </div>
  );
}