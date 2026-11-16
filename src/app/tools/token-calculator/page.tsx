import { Metadata } from 'next';
import { TokenCalculator } from '@/components/tools/TokenCalculator';

export const metadata: Metadata = {
  title: 'LLM Token & Cost Calculator 2026 | AI Life Hub',
  description: 'Công cụ tính toán chi phí API chính xác cho GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek V3 và Llama 3.',
  openGraph: {
    title: 'LLM Token & Cost Calculator 2026 | AI Life Hub',
    description: 'So sánh bảng giá API, tính toán tiết kiệm từ Prompt Caching và dự phóng chi phí vận hành AI hàng tháng.',
    type: 'website',
  },
};

export default function TokenCalculatorPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <TokenCalculator />
    </div>
  );
}
