import type { Metadata } from 'next';
import { PlaybooksDirectory } from '@/components/playbooks/PlaybooksDirectory';
import { BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thư viện 10 Cẩm Nang Kỹ Thuật Thực Chiến | AI Life Hub',
  description: 'Bộ cẩm nang kỹ thuật chuyên sâu biên soạn từ 10 công trình kinh điển: Agentic AI, Data Science, Math, Python Graphics, Unity, Agile Testing, Secure Coding, SQL Multi-DB, C Systems, SELinux.',
};

export default function PlaybooksPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kho Tri thức Kỹ thuật Nền tảng (10 Books Master Playbooks)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          Cẩm Nang Kỹ Thuật Thực Chiến (Master Playbooks)
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Được trích xuất và chuẩn hóa từ kho dữ liệu tri thức <code className="text-accent bg-bg-surface px-1.5 py-0.5 rounded font-mono text-xs">D:\AI_Knowledge_Lab</code>. Bao quát toàn diện từ Trí tuệ Nhân tạo Tác tử (Agentic AI), Khoa học Dữ liệu, Đồ họa 3D, An ninh Ứng dụng, Cơ sở Dữ liệu Đa hệ đến Nhân hệ điều hành Linux.
        </p>
      </div>

      <PlaybooksDirectory />
    </div>
  );
}
