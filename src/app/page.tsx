import { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhiteCards } from '@/components/home/WhiteCards';
import { ResultsGrid } from '@/components/home/ResultsGrid';
import { UseCases } from '@/components/home/UseCases';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { HomeFinalCta } from '@/components/home/HomeFinalCta';

export const metadata: Metadata = {
  title: 'AI Life Hub — Soạn email, tóm tắt họp và phân tích tài liệu bằng AI',
  description:
    'Làm việc bằng AI tiếng Việt trong AI Workspace (Email, Tóm tắt họp, Phân tích tài liệu), tra cứu 80 câu lệnh và dùng công cụ cho lập trình viên trong Builder Lab.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Life Hub — Soạn email, tóm tắt họp và phân tích tài liệu bằng AI',
    description:
      'Chọn việc, dán nội dung, bấm Tạo ngay. Thư viện 80 câu lệnh tiếng Việt và Builder Lab cho lập trình viên.',
    url: '/',
    type: 'website',
  },
};

/**
 * Trang chủ kiểu PeachWeb lần 2: vài section lớn, không phải danh sách dài.
 * Thứ tự: Hero cuộn dài ghim màn hình → 3 bước (1 lần) → 3 thẻ nền trắng
 * → lưới mẫu kết quả → Use Cases kính mờ so le → dải chip chạy ngang
 * → CTA cuối trong cảnh 3D + footer (footer nằm trong layout).
 * Các section cũ rườm rà (danh mục, thống kê đếm số, mẫu câu lệnh,
 * bản tin) đã bỏ khỏi trang chủ — nội dung của chúng vẫn ở các trang
 * riêng (/categories, /prompts...).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhiteCards />
      <ResultsGrid />
      <UseCases />
      <MarqueeStrip />
      <HomeFinalCta />
    </>
  );
}
