import type { Metadata } from 'next';
import { UsageStats } from '@/components/workspace/UsageStats';

export const metadata: Metadata = {
  title: 'Thống kê sử dụng | AI Life Hub',
  description:
    'Thống kê tokens và chi phí ước tính của AI Workspace theo mô hình, quy trình và ngày — cộng dồn từ các phiên làm việc đã lưu.',
  alternates: {
    canonical: '/workspace/usage',
  },
};

export default function WorkspaceUsagePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <UsageStats />
    </div>
  );
}
