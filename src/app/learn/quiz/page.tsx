import { Metadata } from 'next';
import { AIQuiz } from '@/components/learn/AIQuiz';

export const metadata: Metadata = {
  title: 'Trắc Nghiệm Kiến Thức AI',
  description: 'Kiểm tra trình độ làm chủ trợ lý AI, kỹ thuật suy luận từng bước, tối ưu bộ nhớ đệm câu lệnh và quy trình đa trợ lý qua 8 tình huống thực tế.',
  alternates: {
    canonical: '/learn/quiz',
  },
  openGraph: {
    title: 'Trắc Nghiệm Kiến Thức AI | AI Life Hub',
    description: 'Thử thách 8 câu hỏi tình huống thực tế về AI và nhận chứng nhận kỹ năng.',
    url: '/learn/quiz',
    type: 'website',
  },
};

export default function QuizPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <AIQuiz />
    </div>
  );
}
