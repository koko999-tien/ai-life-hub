import type { Metadata } from 'next';
import { PlaybooksDirectory } from '@/components/playbooks/PlaybooksDirectory';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cẩm Nang Thực Chiến',
  description: 'Bộ 10 cẩm nang kỹ thuật chuyên sâu biên soạn từ 10 công trình kinh điển: Trợ lý AI tự hành, Khoa học dữ liệu, Toán ứng dụng, Đồ họa Python, Unity, Kiểm thử Agile, Lập trình an toàn, SQL, C và Bảo mật Linux.',
  alternates: {
    canonical: '/playbooks',
  },
  openGraph: {
    title: 'Cẩm Nang Thực Chiến | AI Life Hub',
    description: 'Bộ 10 cẩm nang kỹ thuật chuyên sâu biên soạn từ 10 công trình kinh điển: Trợ lý AI tự hành, Khoa học dữ liệu, Toán ứng dụng, Đồ họa Python, Unity, Kiểm thử Agile, Lập trình an toàn, SQL, C và Bảo mật Linux.',
    url: '/playbooks',
    type: 'website',
  },
};

export default function PlaybooksPage() {
  return (
    <div className="container mx-auto px-section-x pt-24 pb-16">
      <div className="max-w-4xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>10 Cẩm Nang Kỹ Thuật Nền Tảng</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4 tracking-tight">
          Cẩm Nang Thực Chiến
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Được tổng hợp và chuẩn hóa từ 10 đầu sách kỹ thuật kinh điển. Bao quát toàn diện từ Trợ lý AI tự hành, Khoa học Dữ liệu, Đồ họa 3D, Lập trình An toàn, Cơ sở Dữ liệu Đa hệ đến Quản trị Hệ thống Linux.
        </p>
      </div>

      <PlaybooksDirectory />
    </div>
  );
}
