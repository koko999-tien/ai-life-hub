import { Metadata } from 'next';
import { getAllSkills } from '@/lib/data';
import { Sparkles } from 'lucide-react';
import { PromptExplorer } from '@/components/skill/PromptExplorer';
import type { PromptDifficulty } from '@/types';

export const metadata: Metadata = {
  title: 'Thư Viện Câu Lệnh AI Thực Chiến',
  description:
    'Tuyển tập câu lệnh AI thực chiến bằng tiếng Việt cho ChatGPT, Claude và Gemini. Điền thông tin trực tiếp và sử dụng ngay cho công việc, học tập và đời sống.',
  alternates: {
    canonical: '/prompts',
  },
  openGraph: {
    title: 'Thư Viện Câu Lệnh AI Thực Chiến | AI Life Hub',
    description:
      'Khám phá 80+ câu lệnh AI chuẩn hóa cho công việc văn phòng, học tập, viết lách, tài chính, lập trình và đời sống hằng ngày.',
    url: '/prompts',
    type: 'website',
  },
};

export default async function PromptsPage() {
  const skills = await getAllSkills();

  const allPrompts = skills.flatMap((skill) =>
    (skill.prompts || []).map((prompt) => {
      const rawDiff = prompt.difficulty as string | undefined;
      const normalizedDifficulty: PromptDifficulty =
        rawDiff === 'easy' || rawDiff === 'medium' || rawDiff === 'advanced'
          ? rawDiff
          : 'medium';

      return {
        ...prompt,
        skillId: prompt.skillId || skill.id,
        skillName: skill.name,
        skillSlug: skill.slug,
        categoryId: skill.categoryId,
        tags: skill.tags || [],
        variables: prompt.variables ?? [],
        examples: prompt.examples ?? [],
        useCases: prompt.useCases ?? [],
        tips: prompt.tips ?? [],
        difficulty: normalizedDifficulty,
      };
    })
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Thư viện Câu lệnh Tương tác</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Thư Viện Câu Lệnh AI Thực Chiến
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tuyển tập câu lệnh tối ưu cho ChatGPT, Claude và Gemini. Chọn tình huống, điền nhanh thông tin của bạn và dùng ngay chỉ với một lần bấm!
          </p>
        </div>

        {/* Interactive Explorer */}
        <PromptExplorer initialPrompts={allPrompts} />
      </div>
    </div>
  );
}
