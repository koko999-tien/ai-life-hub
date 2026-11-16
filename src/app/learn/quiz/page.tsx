import { Metadata } from 'next';
import { AIQuiz } from '@/components/learn/AIQuiz';

export const metadata: Metadata = {
  title: 'Trắc Nghiệm Kiến Thức AI & Prompt Engineering | AI Life Hub',
  description: 'Kiểm tra trình độ làm chủ LLM, Chain-of-Thought, Prompt Caching và Agent Architecture qua bài test thực tế.',
  openGraph: {
    title: 'Trắc Nghiệm Kiến Thức AI & Prompt Engineering | AI Life Hub',
    description: 'Thử thách 8 câu hỏi tình huống thực tế về LLM, Prompt Engineering và nhận chứng nhận kỹ năng.',
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
