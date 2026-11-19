import { Metadata } from 'next';
import { PromptOptimizer } from '@/components/tools/PromptOptimizer';

export const metadata: Metadata = {
  title: 'Viết lại câu lệnh hay hơn',
  description: 'Biến yêu cầu ngắn gọn thành câu lệnh rõ ràng, có vai trò, quy tắc và ví dụ mẫu để AI trả lời chính xác hơn cho cả công việc hằng ngày lẫn lập trình.',
  alternates: {
    canonical: '/tools/prompt-optimizer',
  },
  openGraph: {
    title: 'Viết lại câu lệnh hay hơn | AI Life Hub',
    description: 'Nâng cấp câu lệnh AI tự động theo cấu trúc rõ ràng: tăng độ chính xác, hạn chế AI bịa đặt thông tin và định hình đầu ra dễ dùng ngay.',
    url: '/tools/prompt-optimizer',
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
