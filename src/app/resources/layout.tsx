import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kho Tài Nguyên AI',
  description:
    'Tổng hợp tài liệu, khóa học, công cụ và nghiên cứu hữu ích giúp bạn học và ứng dụng AI hiệu quả hơn.',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Kho Tài Nguyên AI | AI Life Hub',
    description:
      'Tuyển tập tài liệu, khóa học, công cụ và bài viết chọn lọc về ứng dụng AI.',
    url: '/resources',
    type: 'website',
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
