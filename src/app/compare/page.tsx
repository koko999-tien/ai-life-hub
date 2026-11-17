import type { Metadata } from 'next';
import { ModelComparisonArena } from '@/components/compare/ModelComparisonArena';
import { Scale, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Model Matrix & Benchmark Arena 2026 | AI Life Hub',
  description: 'Bảng so sánh chi tiết các mô hình ngôn ngữ lớn (LLM) hàng đầu thế giới 2026: Claude 3.5 Sonnet, GPT-4o, DeepSeek V3/R1, Gemini 1.5/2.0, Llama 3.3 70B.',
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <Scale className="w-3.5 h-3.5" />
          <span>Bản đồ Trí Tuệ Nhân Tạo 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          AI Model Matrix & Comparison Arena
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          So sánh toàn diện về giá cước (Input/Output/Cache), kích thước cửa sổ ngữ cảnh, benchmark lập trình (SWE-bench, HumanEval) và khả năng suy luận logic giữa các model đỉnh cao nhất năm 2026.
        </p>
      </div>

      <ModelComparisonArena />
    </div>
  );
}
