import { Metadata } from 'next';
import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhiteCards } from '@/components/home/WhiteCards';
import { ResultsGrid } from '@/components/home/ResultsGrid';
import { UseCases } from '@/components/home/UseCases';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { HomeFinalCta } from '@/components/home/HomeFinalCta';

export const metadata: Metadata = {
  title: 'AI Life Hub — Không Gian Thực Thi Công Việc AI & Builder Lab Tiếng Việt',
  description:
    'Hoàn thành công việc thực tế trong AI Workspace (Email, Tóm tắt họp, Phân tích tài liệu), tra cứu 80+ câu lệnh tiếng Việt và bộ công cụ kỹ thuật xác thực cho lập trình viên.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Life Hub — Không Gian Thực Thi Công Việc AI & Builder Lab Tiếng Việt',
    description:
      'AI không chỉ để trò chuyện — hãy dùng AI để hoàn thành công việc với AI Workspace, 80+ mẫu câu lệnh và Builder Lab xác thực.',
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
