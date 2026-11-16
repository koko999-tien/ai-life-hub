'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui';

interface Question {
  id: number;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Khi nào kỹ thuật Chain-of-Thought (CoT) mang lại hiệu quả vượt trội nhất?',
    scenario: 'Bạn muốn mô hình AI xử lý bài toán một cách chính xác mà không bị hallucinate.',
    options: [
      'Khi cần AI viết thơ tình hoặc sáng tạo slogan quảng cáo ngắn',
      'Khi giải các bài toán logic, toán học phức tạp hoặc debug thuật toán đa bước',
      'Khi cần dịch nhanh 1 từ tiếng Anh sang tiếng Pháp',
      'Khi trích xuất một trường thông tin đơn lẻ từ một văn bản ngắn',
    ],
    correctIndex: 1,
    explanation: 'CoT ép buộc mô hình sinh ra chuỗi lập luận trung gian, giúp các bước tính toán và suy luận logic sau được thừa hưởng ngữ cảnh chính xác của các bước trước, giảm tới 70% lỗi ảo giác.',
  },
  {
    id: 2,
    question: 'Mục đích chính của "Prompt Caching" (như trên Anthropic Claude và OpenAI) là gì?',
    scenario: 'Hệ thống của bạn gửi kèm tài liệu API dài 20,000 tokens trong mỗi yêu cầu.',
    options: [
      'Tự động sửa lỗi chính tả trong câu hỏi của người dùng',
      'Tái sử dụng các token tĩnh ở đầu prompt để giảm chi phí API tới 75-90% và tăng tốc độ phản hồi',
      'Lưu trữ toàn bộ câu trả lời của AI vào trình duyệt của người dùng',
      'Tăng giới hạn context window của mô hình lên gấp đôi',
    ],
    correctIndex: 1,
    explanation: 'Prompt Caching nhận diện các tiền tố (prefix) trùng lặp trong prompt (như tài liệu tham khảo, system prompt dài) để không cần tính toán lại ma trận attention, tiết kiệm chi phí cực lớn.',
  },
  {
    id: 3,
    question: 'Để ngăn chặn LLM trả lời lan man hoặc vi phạm quy tắc, kỹ thuật nào sau đây hiệu quả nhất?',
    scenario: 'Bạn xây dựng chatbot dịch vụ khách hàng cần tuân thủ nghiêm ngặt chính sách công ty.',
    options: [
      'Chỉ cần tăng thông số Temperature lên 1.0',
      'Thêm "Negative Constraints" (Điều cấm kỵ rõ ràng) và yêu cầu xuất ra định dạng JSON Schema chặt chẽ',
      'Chỉ nói "Hãy trả lời ngắn gọn nhé"',
      'Gửi prompt bằng chữ IN HOA toàn bộ',
    ],
    correctIndex: 1,
    explanation: 'Negative constraints quy định những gì AI TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM, kết hợp cùng JSON schema validation ở tầng inference là tiêu chuẩn vàng của AI sản xuất.',
  },
  {
    id: 4,
    question: 'Điểm khác biệt cốt lõi giữa RAG (Retrieval-Augmented Generation) và Fine-Tuning là gì?',
    scenario: 'Công ty bạn có 10,000 trang tài liệu nội bộ cập nhật mỗi tuần và muốn AI tra cứu chính xác.',
    options: [
      'RAG chỉ áp dụng cho hình ảnh, còn Fine-Tuning áp dụng cho văn bản',
      'RAG truy xuất tài liệu động vào ngữ cảnh prompt lúc truy vấn; Fine-Tuning cập nhật lại trọng số mô hình qua huấn luyện',
      'RAG luôn tốn kém chi phí hơn Fine-Tuning gấp 10 lần',
      'Fine-Tuning loại bỏ hoàn toàn hiện tượng hallucination trong khi RAG không thể',
    ],
    correctIndex: 1,
    explanation: 'Với dữ liệu thay đổi thường xuyên, RAG là giải pháp vượt trội vì có thể cập nhật cơ sở dữ liệu vector ngay tức thì mà không cần tốn chi phí và thời gian đào tạo lại trọng số mô hình.',
  },
  {
    id: 5,
    question: 'Trong kỹ thuật "Few-Shot Prompting", yếu tố nào quyết định chất lượng học tập ngữ cảnh cao nhất?',
    scenario: 'Bạn muốn AI phân loại cảm xúc phản hồi khách hàng theo 5 cấp độ phức tạp.',
    options: [
      'Càng cung cấp nhiều ví dụ ngẫu nhiên càng tốt mà không cần định dạng đồng nhất',
      'Các ví dụ mẫu (Exemplars) phải có cấu trúc Input-Output nhất quán và phản ánh các trường hợp biên khó (Edge cases)',
      'Chỉ cần 1 ví dụ dài 10 trang sách',
      'Đặt ví dụ ở cuối cùng sau câu hỏi của người dùng',
    ],
    correctIndex: 1,
    explanation: 'Chất lượng và tính nhất quán của mẫu ví dụ quan trọng hơn số lượng. Mô hình LLM học nhận diện mẫu (in-context pattern recognition) qua cấu trúc đồng nhất của các exemplar.',
  },
  {
    id: 6,
    question: 'Thông số "Temperature" = 0.1 thường được ưu tiên sử dụng trong trường hợp nào?',
    scenario: 'Bạn cấu hình AI Agent tự động trích xuất mã số thuế và số tiền từ hóa đơn PDF.',
    options: [
      'Sáng tác thơ ngẫu hứng hoặc kịch bản phim hài',
      'Viết code, trích xuất dữ liệu có cấu trúc, phân tích tài chính đòi hỏi tính xác định cao',
      'Tìm kiếm ý tưởng khởi nghiệp độc lạ',
      'Khi muốn câu trả lời của AI luôn luôn dài hơn 2000 từ',
    ],
    correctIndex: 1,
    explanation: 'Temperature thấp (gần 0) làm giảm độ ngẫu nhiên của việc chọn token tiếp theo, giúp mô hình luôn chọn các token có xác suất cao nhất, đảm bảo tính nhất quán và chính xác cho các tác vụ kỹ thuật.',
  },
  {
    id: 7,
    question: 'Tấn công "Prompt Injection" (Tiêm lệnh) diễn ra như thế nào?',
    scenario: 'Chatbot của bạn tóm tắt bài viết do người dùng tải lên từ đường dẫn web bất kỳ.',
    options: [
      'Hacker ngắt nguồn điện máy chủ chứa AI',
      'Nội dung do người dùng tải lên chứa các câu lệnh độc hại (ví dụ: "Bỏ qua các hướng dẫn trước...") làm AI vi phạm system prompt',
      'Hacker thay đổi thuật toán Transformer của OpenAI',
      'Mô hình AI tự động gửi email cho toàn bộ danh bạ',
    ],
    correctIndex: 1,
    explanation: 'Prompt Injection khai thác việc LLM không thể phân biệt hoàn toàn giữa "chỉ dẫn hệ thống" (system instructions) và "dữ liệu không tin cậy" (untrusted user input), dẫn đến việc kẻ tấn công chiếm quyền điều khiển hành vi của AI.',
  },
  {
    id: 8,
    question: 'Kiến trúc Multi-Agent Workflows mang lại lợi thế gì so với việc dùng 1 prompt đơn lẻ khổng lồ?',
    scenario: 'Xây dựng tính năng tự động chuyển bài nói chuyện 1 tiếng thành bài blog, infographics và quiz.',
    options: [
      'Chia nhỏ bài toán lớn thành các sub-agents chuyên biệt hóa từng nhiệm vụ, dễ kiểm thử, debug và tối ưu hóa từng khâu',
      'Làm giảm số lượng dòng code của backend về 0',
      'Bắt buộc phải dùng 10 máy tính khác nhau để chạy',
      'Không có lợi thế gì, 1 prompt dài luôn luôn tốt hơn',
    ],
    correctIndex: 0,
    explanation: 'Tương tự nguyên tắc Microservices trong kỹ thuật phần mềm, chia nhỏ quy trình thành các Agent đơn nhiệm giúp kiểm soát chất lượng đầu ra từng chặng, tránh hiện tượng context drift và dễ dàng tái sử dụng.',
  },
];

export function AIQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUESTIONS[currentIndex];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const selectedOpt = selectedAnswers[currentQ.id];
  const isCorrect = selectedOpt === currentQ.correctIndex;

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIndex }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([qId, optIdx]) => {
      const q = QUESTIONS.find((item) => item.id === parseInt(qId));
      return q && q.correctIndex === optIdx;
    }
  ).length;

  const scorePercentage = Math.round((correctCount / QUESTIONS.length) * 100);

  const getBadgeTitle = () => {
    if (correctCount === 8) return { title: 'Grandmaster Prompt Architect 🏆', desc: 'Bạn đã đạt cấp độ chuyên gia thượng thừa về LLM và Prompt Architecture!' };
    if (correctCount >= 6) return { title: 'Senior AI Practitioner 🚀', desc: 'Kiến thức thực chiến rất vững vàng về CoT, Caching và Guardrails!' };
    if (correctCount >= 4) return { title: 'AI Explorer 💡', desc: 'Bạn nắm tốt các khái niệm cốt lõi, tiếp tục thực hành trên Playground nhé!' };
    return { title: 'Apprentice in Training 📚', desc: 'Hãy khám phá các danh mục kỹ năng trên AI Life Hub để nâng cấp kỹ năng ngay!' };
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      {/* Quiz Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-800">
          <HelpCircle className="h-4 w-4" />
          <span>Interactive Knowledge Assessment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-2">
          Thử Thách Kiến Thức AI & Prompt Engineering
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          8 câu hỏi tình huống thực tế kiểm tra độ am hiểu về mô hình ngôn ngữ lớn, prompt engineering và kiến trúc agent.
        </p>
      </div>

      {!isFinished ? (
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
              <span>Câu hỏi {currentIndex + 1} / {QUESTIONS.length}</span>
              <span>Đã trả lời: {Object.keys(selectedAnswers).length}/{QUESTIONS.length}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400 mb-1">
              Tình huống:
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-2">
              &quot;{currentQ.scenario}&quot;
            </p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, optIdx) => {
              let optStyle = 'border-gray-200 dark:border-gray-800 hover:border-brand-500 bg-gray-50/50 dark:bg-gray-950/50 text-gray-800 dark:text-gray-200';
              if (isAnswered) {
                if (optIdx === currentQ.correctIndex) {
                  optStyle = 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/30';
                } else if (optIdx === selectedOpt) {
                  optStyle = 'border-red-500 bg-red-50/40 dark:bg-red-950/30 text-red-900 dark:text-red-300';
                } else {
                  optStyle = 'opacity-50 border-gray-200 dark:border-gray-800';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-start gap-3 ${optStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswered && optIdx === currentQ.correctIndex && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && optIdx === selectedOpt && optIdx !== currentQ.correctIndex && (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className={`p-5 rounded-2xl mb-6 text-xs sm:text-sm leading-relaxed border ${
              isCorrect
                ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Chính xác tuyệt đối!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Chưa đúng! Đáp án đúng là {String.fromCharCode(65 + currentQ.correctIndex)}.</span>
                  </>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Next */}
          {isAnswered && (
            <div className="flex justify-end">
              <Button size="lg" onClick={handleNext} className="gap-2">
                <span>{currentIndex < QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả bài thi'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            Kết quả bài thi trắc nghiệm
          </span>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2">
            {getBadgeTitle().title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            {getBadgeTitle().desc}
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 mb-8">
            <div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {correctCount} / {QUESTIONS.length}
              </div>
              <div className="text-[11px] text-gray-400 uppercase font-semibold">Câu đúng</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <div>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                {scorePercentage}%
              </div>
              <div className="text-[11px] text-gray-400 uppercase font-semibold">Tỷ lệ chính xác</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={handleRestart} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Làm lại bài test
            </Button>
            <Button asChild className="gap-2">
              <Link href="/playground">
                <Sparkles className="h-4 w-4" /> Thực hành trong Playground
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/categories">Khám phá các kỹ năng</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
