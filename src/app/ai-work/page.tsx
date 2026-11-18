import { Metadata } from 'next';
import { Briefcase } from 'lucide-react';
import { getAllSkills } from '@/lib/data';
import { AIWorkHub } from '@/components/work/AIWorkHub';

export const metadata: Metadata = {
  title: 'Công Việc AI — Giải Pháp AI Theo Nhiệm Vụ Thực Tế',
  description:
    'Khám phá 8 nhóm công việc thực tế với AI: biết rõ cần chuẩn bị đầu vào gì, kết quả nhận được ra sao và thực thi trực tiếp trong AI Workspace.',
  alternates: {
    canonical: '/ai-work',
  },
  openGraph: {
    title: 'Công Việc AI — Giải Pháp AI Theo Nhiệm Vụ Thực Tế | AI Life Hub',
    description:
      'Chọn nhóm nhiệm vụ của bạn từ Viết email, Họp văn phòng, Học tập, Phân tích dữ liệu đến Kinh doanh và thực thi ngay trong AI Workspace.',
    url: '/ai-work',
    type: 'website',
  },
};

export default async function AIWorkPage() {
  const skills = await getAllSkills();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Trụ cột 1 • AI Cho Công Việc Hằng Ngày</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text mb-4">
            Chọn Công Việc Bạn Cần Hoàn Thành Với AI
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            Thay vì phải tự đoán cách trò chuyện với AI, hãy chọn đúng nhóm việc của bạn: xem rõ thông tin cần đưa vào, kết quả sẽ nhận về và bấm chạy ngay trong AI Workspace.
          </p>
        </div>

        <AIWorkHub skills={skills} />
      </div>
    </div>
  );
}
