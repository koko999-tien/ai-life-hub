import type { Metadata } from 'next';
import { AICheatsheet } from '@/components/cheatsheet/AICheatsheet';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sổ Tay Tra Cứu Nhanh',
  description: 'Sổ tay tra cứu nhanh các kỹ thuật viết câu lệnh AI hiệu quả, truy xuất tài liệu (RAG), đầu ra JSON đúng chuẩn, tham số điều chỉnh và bảo mật an toàn.',
  alternates: {
    canonical: '/cheatsheet',
  },
  openGraph: {
    title: 'Sổ Tay Tra Cứu Nhanh | AI Life Hub',
    description: 'Sổ tay tra cứu nhanh các kỹ thuật viết câu lệnh AI hiệu quả, truy xuất tài liệu (RAG), đầu ra JSON đúng chuẩn, tham số điều chỉnh và bảo mật an toàn.',
    url: '/cheatsheet',
    type: 'website',
  },
};

export default function CheatsheetPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sổ Tay Kỹ Thuật &amp; Câu Lệnh AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          Sổ Tay Tra Cứu Nhanh
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Tổng hợp nhanh các kỹ thuật cốt lõi: suy luận từng bước, thẻ phân tách dữ liệu, đưa ví dụ mẫu, ép đầu ra JSON đúng chuẩn, chia đoạn tài liệu theo ngữ nghĩa và bảng tham số sẵn sàng sao chép dùng ngay cho dự án của bạn.
        </p>
      </div>

      <AICheatsheet />
    </div>
  );
}
