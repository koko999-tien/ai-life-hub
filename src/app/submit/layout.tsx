import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đóng Góp Câu Lệnh Mới',
  description:
    'Chia sẻ các câu lệnh hiệu quả, cấu hình trợ lý AI và mẹo thực hành bạn đã áp dụng thành công cho cộng đồng AI Life Hub.',
  alternates: {
    canonical: '/submit',
  },
  openGraph: {
    title: 'Đóng Góp Câu Lệnh Mới | AI Life Hub',
    description:
      'Gửi câu lệnh AI thực chiến mới để đóng góp vào thư viện chung của cộng đồng.',
    url: '/submit',
    type: 'website',
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
