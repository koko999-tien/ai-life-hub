import type { Metadata } from 'next';
import { WorkspaceHistory } from '@/components/workspace/WorkspaceHistory';

export const metadata: Metadata = {
  title: 'Lịch sử phiên làm việc | AI Life Hub',
  description:
    'Xem lại, mở lại và xóa các phiên làm việc AI Workspace đã lưu — Trợ lý Email, Tóm tắt cuộc họp, Phân tích tài liệu và Câu lệnh tùy chọn.',
  alternates: {
    canonical: '/workspace/history',
  },
};

export default function WorkspaceHistoryPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <WorkspaceHistory />
    </div>
  );
}
