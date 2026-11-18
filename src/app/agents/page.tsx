import { Metadata } from 'next';
import { AgentDirectory } from '@/components/agents/AgentDirectory';

export const metadata: Metadata = {
  title: 'Mẫu Thiết Kế Trợ Lý AI',
  description: 'Thư viện 14 mẫu thiết kế trợ lý AI chuyên trách sẵn sàng triển khai: lập trình, nghiên cứu, viết nội dung, tài chính, giáo dục, vận hành và pháp lý.',
  alternates: {
    canonical: '/agents',
  },
  openGraph: {
    title: 'Mẫu Thiết Kế Trợ Lý AI | AI Life Hub',
    description: 'Bộ sưu tập hướng dẫn hệ thống (System Prompt), công cụ tích hợp và tệp cấu hình .cursorrules / CLAUDE.md cho 14 trợ lý AI chuyên trách.',
    url: '/agents',
    type: 'website',
  },
};

export default function AgentsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <AgentDirectory />
    </div>
  );
}
