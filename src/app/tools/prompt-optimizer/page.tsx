import { Metadata } from 'next';
import { PromptOptimizer } from '@/components/tools/PromptOptimizer';

export const metadata: Metadata = {
  title: 'AI Prompt Optimizer & Enhancer | AI Life Hub',
  description: 'Biến prompt đơn sơ thành prompt chuyên nghiệp chuẩn production theo các framework CoT, CREATE và Guardrails.',
  openGraph: {
    title: 'AI Prompt Optimizer & Enhancer | AI Life Hub',
    description: 'Tối ưu hóa câu lệnh LLM tự động: tăng 10x độ chính xác, loại bỏ hallucination và định hình đầu ra chuẩn mực.',
    type: 'website',
  },
};

export default function PromptOptimizerPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <PromptOptimizer />
    </div>
  );
}
