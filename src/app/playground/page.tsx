import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllSkills } from '@/lib/data';
import { PlaygroundClient } from '@/components/playground/PlaygroundClient';

export const metadata: Metadata = {
  title: 'Khu Thử Nghiệm AI',
  description: 'Thử nghiệm, tinh chỉnh câu lệnh và điền thông tin biến số theo chế độ mô phỏng an toàn (Demo), hoặc mở nhanh sang ChatGPT, Claude và Gemini để chạy thật.',
  alternates: {
    canonical: '/playground',
  },
  openGraph: {
    title: 'Khu Thử Nghiệm AI | AI Life Hub',
    description: 'Không gian thử nghiệm câu lệnh AI trực quan với chế độ chạy thử mô phỏng (Demo) và nút chuyển nhanh sang ChatGPT, Claude, Gemini.',
    url: '/playground',
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
    <div className="min-h-screen pt-24 pb-16">
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-text-muted">Đang nạp Khu Thử Nghiệm AI...</div>}>
        <PlaygroundClient presets={presets} />
      </Suspense>
    </div>
  );
}
