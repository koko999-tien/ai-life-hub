import type { Metadata } from 'next';
import { ModelComparisonArena } from '@/components/compare/ModelComparisonArena';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'So Sánh Sức Mạnh AI',
  description: 'Bảng so sánh chi tiết các mô hình AI hàng đầu 2026: Claude 3.5 Sonnet, GPT-4o, DeepSeek V3/R1, Gemini 1.5/2.0, Llama 3.3 70B — từ giá cước đến khả năng lập trình và suy luận.',
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'So Sánh Sức Mạnh AI | AI Life Hub',
    description: 'So sánh trực quan về giá sử dụng, độ dài văn bản đọc được, chỉ số lập trình thực tế (SWE-bench) và tư vấn chọn mô hình AI phù hợp nhất.',
    url: '/compare',
    type: 'website',
  },
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <Scale className="w-3.5 h-3.5" />
          <span>Dành cho Lập trình viên & Kỹ thuật</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          So Sánh Sức Mạnh AI
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          So sánh toàn diện về chi phí theo từng triệu đơn vị chữ (token) đầu vào, đầu ra và bộ nhớ đệm, lượng văn bản đọc được cùng lúc, điểm kiểm tra lập trình thực tế (SWE-bench, HumanEval) và khả năng suy luận logic giữa các mô hình AI hàng đầu.
        </p>
      </div>

      <ModelComparisonArena />
    </div>
  );
}
