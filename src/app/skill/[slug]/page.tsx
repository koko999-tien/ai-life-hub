import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, BookOpen, ArrowRight, ExternalLink, Clock, Signal } from 'lucide-react';
import { getSkill, getSkillsByCategory, skills } from '@/lib/data';
import { PromptBuilderButton } from '@/components/skill/prompt-builder';
import { AgentTemplateCard } from '@/components/skill/agent-template-card';
import { RelatedSkills } from '@/components/skill/related-skills';

interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const skill = getSkill(resolvedParams.slug);

  if (!skill) {
    return { title: 'Kỹ năng không tồn tại' };
  }

  return {
    title: skill.name,
    description: skill.description,
    openGraph: {
      title: skill.name,
      description: skill.description,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }));
}

export default async function SkillPage({ params }: SkillPageProps) {
  const resolvedParams = await params;
  const skill = getSkill(resolvedParams.slug);

  if (!skill) {
    notFound();
  }

  const categorySkills = getSkillsByCategory(skill.categorySlug);

  const difficultyColors = {
    beginner: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    intermediate: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    advanced: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
  } as const;

  const difficultyLabels = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao',
  } as const;

  const learningObjectives = [
    'Hiểu rõ mục tiêu học tập và các thành phần chính của chủ đề này',
    'Áp dụng các khái niệm cốt lõi vào thực tế qua các ví dụ',
    'Tự kiểm tra kiến thức của mình bằng cách hoàn thành bài tập',
    'Xây dựng một sản phẩm/kỹ năng mini theo yêu cầu',
  ];

  const category = {
    slug: skill.categorySlug,
    name: skill.category,
  };

  const promptReady = skill.promptTemplate && skill.promptTemplate.trim().length > 0;

  return (
    <div className="min-h-screen">
      <div className="container py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/category" className="hover:text-primary transition-colors">Danh mục</a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href={`/category/${skill.categorySlug}`} className="hover:text-primary transition-colors">
                {skill.category}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground font-medium">{skill.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <article className="card p-6 sm:p-8" aria-labelledby="skill-title">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={difficultyColors[skill.difficulty]} className="badge">
                  {difficultyLabels[skill.difficulty]}
                </span>
                <span className="badge badge-secondary flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {skill.estimatedTime}
                </span>
                {skill.featured && (
                  <span className="badge badge-primary">Nổi bật</span>
                )}
              </div>

              <h1 id="skill-title" className="heading-2 mb-4">{skill.name}</h1>
              <p className="text-fluid-lg text-muted-foreground leading-relaxed mb-8">{skill.longDescription}</p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h2 className="heading-4 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                    Mục tiêu học tập
                  </h2>
                  <ul className="space-y-3" aria-label="Learning objectives">
                    {learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="heading-4 mb-4 flex items-center gap-2">
                    <Signal className="h-5 w-5 text-primary" aria-hidden="true" />
                    Điều kiện tiên quyết
                  </h2>
                  {skill.prerequisites.length > 0 ? (
                    <ul className="space-y-2" aria-label="Prerequisites">
                      {skill.prerequisites.map((prereq) => (
                        <li key={prereq} className="text-sm flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Không có điều kiện tiên quyết.</p>
                  )}
                </div>
              </div>
            </article>

            {promptReady && (
              <div className="mt-8">
                <h2 className="heading-3 mb-4">Prompt mẫu</h2>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-muted-foreground/50">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <pre
                    className="rounded-lg border border-border/50 bg-background p-4 pl-10 text-sm font-mono overflow-x-auto whitespace-pre-wrap"
                    aria-label="Prompt mẫu"
                  >
                    {skill.promptTemplate}
                  </pre>
                  <div className="absolute bottom-3 right-3">
                    <PromptBuilderButton skillName={skill.slug} initialPrompt={skill.promptTemplate} />
                  </div>
                </div>
              </div>
            )}

            {skill.agentTemplate && (
              <div className="mt-8">
                <h2 className="heading-3 mb-4">Agent Template</h2>
                <AgentTemplateCard agent={skill.agentTemplate} onUseAgent={() => {}} />
              </div>
            )}
          </div>

          <aside className="lg:col-span-1" aria-label="Thông tin kỹ năng">
            <div className="card p-6 space-y-4">
              <h2 className="heading-4">Hành động</h2>
              <div className="space-y-2">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => {
                    const el = document.getElementById('prompt-builder-input');
                    el?.focus();
                  }}
                  aria-label="Mở trình xây dựng"
                >
                  Mở trình xây dựng
                </button>
                <button
                  className="btn btn-secondary w-full"
                  onClick={async () => {
                    await navigator.clipboard.writeText(skill.promptTemplate);
                  }}
                >
                  Sao chép prompt
                </button>
              </div>

              <hr className="my-4 border-border" />

              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Thẻ liên quan</h3>
                <ul className="space-y-2">
                  {skill.relatedSkills.map((relatedSlug) => {
                    const related = skills.find((s) => s.slug === relatedSlug);
                    if (!related) return null;
                    return (
                      <li key={relatedSlug}>
                        <a
                          href={`/skill/${relatedSlug}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {related.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Chia sẻ</h3>
                <a
                  href="/share"
                  className="btn btn-outline w-full"
                  onClick={async (e) => e.preventDefault()}
                >
                  Chia sẻ kỹ năng
                </a>
              </div>
            </div>
          </aside>
        </div>

        <RelatedSkills relatedSkills={skill.relatedSkills.map((s) => skills.find((sk) => sk.slug === s)).filter((sk): sk is NonNullable<typeof sk> => Boolean(sk))} />

        <div className="mt-16 text-center">
          <a
            href={`/category/${skill.categorySlug}`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Quay lại danh mục {skill.category}
          </a>
        </div>
      </div>
    </div>
  );
}