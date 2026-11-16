import { Metadata } from 'next';
import { getAllSkills } from '@/lib/data';
import { PlaygroundClient } from '@/components/playground/PlaygroundClient';

export const metadata: Metadata = {
  title: 'AI Prompt Playground | AI Life Hub',
  description: 'Thử nghiệm, tinh chỉnh và chạy trực tiếp các Prompt & Agent Templates với GPT-4o, Claude 3.5 Sonnet và Gemini 1.5 Pro.',
  openGraph: {
    title: 'AI Prompt Playground | AI Life Hub',
    description: 'Môi trường sandbox thử nghiệm prompt tương tác thời gian thực với giả lập streaming hoặc kết nối API cá nhân.',
    type: 'website',
  },
};

export default async function PlaygroundPage() {
  const skills = await getAllSkills();

  // Extract all prompts as presets
  const presets = skills.flatMap((s) =>
    (s.prompts || []).map((p) => ({
      id: p.id,
      name: p.name,
      skillName: s.name,
      category: s.categoryId,
      template: p.template,
      systemPrompt: s.agentTemplate?.systemPrompt || 'Bạn là trợ lý AI chuyên nghiệp, súc tích và giải quyết bài toán từng bước.',
      model: s.agentTemplate?.model || 'gpt-4o',
      temperature: s.agentTemplate?.temperature ?? 0.7,
    }))
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <PlaygroundClient presets={presets} />
    </div>
  );
}
