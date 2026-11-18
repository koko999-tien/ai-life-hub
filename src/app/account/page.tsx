import { Metadata } from 'next';
import { AccountClient } from '@/components/account/AccountClient';

export const metadata: Metadata = {
  title: 'Tài Khoản & Dữ Liệu Cá Nhân',
  description:
    'Quản lý lịch sử phiên AI Workspace, mẫu câu lệnh cá nhân, mục yêu thích, xuất bản sao lưu JSON và quyền xóa toàn bộ dữ liệu cá nhân một chạm.',
  alternates: {
    canonical: '/account',
  },
  openGraph: {
    title: 'Tài Khoản & Dữ Liệu Cá Nhân | AI Life Hub',
    description:
      'Kiểm soát minh bạch toàn bộ dữ liệu phiên làm việc AI Workspace, mẫu câu lệnh cá nhân và mục đã lưu trên AI Life Hub.',
    url: '/account',
    type: 'website',
  },
};

export default function AccountPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <AccountClient />
      </div>
    </div>
  );
}
