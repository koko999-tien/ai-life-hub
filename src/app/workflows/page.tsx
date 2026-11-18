import { Metadata } from 'next';
import { WorkflowExplorer } from '@/components/workflows/WorkflowExplorer';

export const metadata: Metadata = {
  title: 'Quy Trình AI Đa Nhiệm',
  description: 'Mô phỏng chuỗi quy trình AI đa bước giúp tự động hóa công việc: sản xuất nội dung, thiết kế phần mềm, nghiên cứu đối chứng và ra mắt sản phẩm.',
  alternates: {
    canonical: '/workflows',
  },
  openGraph: {
    title: 'Quy Trình AI Đa Nhiệm | AI Life Hub',
    description: 'Khám phá cách phối hợp nhiều trợ lý AI nối tiếp nhau để giải quyết trọn vẹn công việc từ ý tưởng đến kết quả hoàn chỉnh.',
    url: '/workflows',
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
