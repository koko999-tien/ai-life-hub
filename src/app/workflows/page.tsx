import { Metadata } from 'next';
import { WorkflowExplorer } from '@/components/workflows/WorkflowExplorer';

export const metadata: Metadata = {
  title: 'AI Workflows & Pipeline Builder | AI Life Hub',
  description: 'Chuỗi quy trình AI tự động hóa đa bước: Tái chế nội dung, Kiến trúc phần mềm, Nghiên cứu sâu và Launch sản phẩm.',
  openGraph: {
    title: 'AI Workflows & Pipeline Builder | AI Life Hub',
    description: 'Nâng tầm ứng dụng AI từ prompt đơn lẻ thành các chuỗi Pipeline liên hoàn tự động hóa công việc chuyên nghiệp.',
    type: 'website',
  },
};

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <WorkflowExplorer />
    </div>
  );
}
