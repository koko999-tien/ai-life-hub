import type { Metadata } from 'next';
import { EcosystemHub } from '@/components/ecosystem/EcosystemHub';
import { FolderGit2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dự Án Nghiên Cứu Mở',
  description: 'Tổng quan các dự án mã nguồn mở và công cụ ứng dụng thực tế: Reality Science, UniDoc Studio, AI Knowledge Lab, Telegram Harvester, Lofi Pomodoro.',
  alternates: {
    canonical: '/ecosystem',
  },
  openGraph: {
    title: 'Dự Án Nghiên Cứu Mở | AI Life Hub',
    description: 'Tổng quan các dự án mã nguồn mở và công cụ ứng dụng thực tế: Reality Science, UniDoc Studio, AI Knowledge Lab, Telegram Harvester, Lofi Pomodoro.',
    url: '/ecosystem',
    type: 'website',
  },
};

export default function EcosystemPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Kho Dự Án &amp; Phòng Nghiên Cứu Mở</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          Dự Án Nghiên Cứu Mở
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Không chỉ là lý thuyết — bộ sưu tập các dự án mã nguồn mở và công cụ thực tế gồm nền tảng kiểm chứng khoa học, studio tự động hóa văn bản hành chính Việt Nam, kho tri thức 10 cẩm nang và công cụ tổng hợp tài nguyên công nghệ.
        </p>
      </div>

      <EcosystemHub />
    </div>
  );
}
