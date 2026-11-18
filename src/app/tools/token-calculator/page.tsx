import { Metadata } from 'next';
import { TokenCalculator } from '@/components/tools/TokenCalculator';

export const metadata: Metadata = {
  title: 'Tính Chi Phí Sử Dụng AI',
  description: 'Ước tính chi phí gọi API theo đơn vị chữ (Token) và bộ nhớ đệm (Prompt Caching) cho GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek V3 và Llama 3.3.',
  alternates: {
    canonical: '/tools/token-calculator',
  },
  openGraph: {
    title: 'Tính Chi Phí Sử Dụng AI | AI Life Hub',
    description: 'So sánh bảng giá các mô hình AI, tính mức tiết kiệm nhờ bộ nhớ đệm (Prompt Caching) và dự phóng chi phí vận hành hàng tháng theo USD và VNĐ.',
    url: '/tools/token-calculator',
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
