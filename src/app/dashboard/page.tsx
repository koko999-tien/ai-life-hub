import type { Metadata } from 'next';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export const metadata: Metadata = {
  title: 'Tổng quan | AI Life Hub',
  description:
    'Tổng quan hoạt động AI Workspace: tổng phiên làm việc, tokens đã dùng, chi phí ước tính, phiên gần nhất và mục yêu thích đã lưu.',
  alternates: {
    canonical: '/dashboard',
  },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <DashboardOverview />
    </div>
  );
}
