import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ & Hỗ trợ',
  description:
    'Kết nối cùng đội ngũ AI Life Hub để góp ý cải tiến, báo lỗi hoặc đề xuất bổ sung câu lệnh và công cụ AI mới.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Liên hệ & Hỗ trợ | AI Life Hub',
    description:
      'Gửi phản hồi, báo lỗi hoặc đề xuất hợp tác cùng đội ngũ AI Life Hub.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
