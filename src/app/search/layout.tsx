import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm Kiếm Toàn Trang',
  description:
    'Tìm nhanh kỹ năng ứng dụng AI, câu lệnh mẫu, trợ lý AI cấu hình sẵn, danh mục và tài nguyên học tập.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Tìm Kiếm Toàn Trang | AI Life Hub',
    description:
      'Tra cứu tức thì toàn bộ câu lệnh mẫu, kỹ năng và công cụ AI trên AI Life Hub.',
    url: '/search',
    type: 'website',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
