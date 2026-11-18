import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mục Yêu Thích Của Bạn',
  description:
    'Truy cập nhanh tất cả kỹ năng, mẫu câu lệnh và tài nguyên AI bạn đã đánh dấu lưu lại trên trình duyệt.',
  alternates: {
    canonical: '/favorites',
  },
  openGraph: {
    title: 'Mục Yêu Thích Của Bạn | AI Life Hub',
    description:
      'Danh sách kỹ năng, mẫu câu lệnh và tài nguyên AI đã lưu của bạn.',
    url: '/favorites',
    type: 'website',
  },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
