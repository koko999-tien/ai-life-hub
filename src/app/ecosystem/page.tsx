import type { Metadata } from 'next';
import { EcosystemHub } from '@/components/ecosystem/EcosystemHub';
import { HardDrive, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hệ Sinh Thái Dự Án Thực Chiến Ổ D | AI Life Hub',
  description: 'Tổng quan các dự án và phòng nghiên cứu kỹ thuật thực tế tại ổ D: Reality Science, UniDoc Studio, AI Knowledge Lab, Telegram Harvester, Lofi Pomodoro.',
};

export default function EcosystemPage() {
  return (
    <div className="container mx-auto px-section-x py-12">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <HardDrive className="w-3.5 h-3.5" />
          <span>Local Workstation Projects (Ổ D)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          Hệ Sinh Thái Dự Án Thực Chiến
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Không chỉ là lý thuyết — toàn bộ hệ sinh thái dự án tại <code className="text-accent bg-bg-surface px-1.5 py-0.5 rounded font-mono text-xs">D:\</code> bao gồm nền tảng khoa học nhận thức, studio tự động hóa văn bản hành chính Việt Nam, kho tri thức 10 cẩm nang và công cụ bóc tách dữ liệu OSINT.
        </p>
      </div>

      <EcosystemHub />
    </div>
  );
}
