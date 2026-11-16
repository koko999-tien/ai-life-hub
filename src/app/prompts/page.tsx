import { Metadata } from 'next';
import { getAllSkills } from '@/lib/data';
import { Sparkles } from 'lucide-react';
import { PromptExplorer } from '@/components/skill/PromptExplorer';

export const metadata: Metadata = {
  title: 'Thư viện Prompt Templates | AI Life Hub',
  description: 'Bộ sưu tập Prompt mẫu chuyên nghiệp cho ChatGPT, Claude, Gemini. Sẵn sàng copy và tinh chỉnh cho công việc và học tập.',
  openGraph: {
    title: 'Thư viện Prompt Templates | AI Life Hub',
    description: 'Hàng trăm prompt chuẩn hóa cho lập trình, viết lách, phân tích dữ liệu, tự động hóa và học tập.',
    type: 'website',
  },
};

export default async function PromptsPage() {
  const skills = await getAllSkills();

  // Extract all prompts with skill context
  const allPrompts = skills.flatMap((skill) =>
    (skill.prompts || []).map((prompt) => ({
      ...prompt,
      skillName: skill.name,
      skillSlug: skill.slug,
      categoryId: skill.categoryId,
    }))
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Thư viện Prompt tương tác</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Prompt Templates Thực Chiến
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tuyển tập prompt được tối ưu hóa cho ChatGPT-4o, Claude 3.5 Sonnet và Gemini 1.5. Chọn prompt, điền tham số và bấm chạy trực tiếp!
          </p>
        </div>

        {/* Interactive Explorer */}
        <PromptExplorer initialPrompts={allPrompts} />
      </div>
    </div>
  );
}
