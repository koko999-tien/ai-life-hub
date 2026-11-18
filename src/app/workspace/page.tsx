import { Suspense } from 'react';
import { Metadata } from 'next';
import { WorkspaceClient } from '@/components/workspace/WorkspaceClient';

export const metadata: Metadata = {
  title: 'AI Workspace — Không Gian Thực Thi Công Việc AI Trực Tuyến',
  description:
    'Thực thi trực tiếp Trợ lý Email AI, Tóm tắt biên bản cuộc họp, Phân tích tài liệu bám sát nguồn và lưu lịch sử phiên làm việc ngay trên AI Life Hub.',
  alternates: {
    canonical: '/workspace',
  },
  openGraph: {
    title: 'AI Workspace — Không Gian Thực Thi Công Việc AI Trực Tuyến | AI Life Hub',
    description:
      'Hoàn thành công việc thực tế với AI: viết email, tóm tắt cuộc họp, phân tích tài liệu và chỉnh sửa kết quả ngay trên trình duyệt.',
    url: '/workspace',
    type: 'website',
  },
};

export default function WorkspacePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16 text-center text-sm text-text-muted">
            Đang khởi tạo AI Workspace...
          </div>
        }
      >
        <WorkspaceClient />
      </Suspense>
    </div>
  );
}
