'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Check,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

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
    question: 'Khi nào kỹ thuật suy luận từng bước (Chain-of-Thought) mang lại hiệu quả vượt trội nhất?',
    scenario: 'Bạn muốn AI xử lý bài toán logic chính xác mà không bịa thông tin (ảo giác).',
    options: [
      'Khi cần AI viết thơ tình hoặc sáng tạo khẩu hiệu quảng cáo ngắn',
      'Khi giải các bài toán logic, tính toán phức tạp hoặc sửa lỗi thuật toán nhiều bước',
      'Khi cần dịch nhanh 1 từ tiếng Anh sang tiếng Pháp',
      'Khi trích xuất một trường thông tin đơn lẻ từ một đoạn văn ngắn',
    ],
    correctIndex: 1,
    explanation: 'Kỹ thuật suy luận từng bước yêu cầu AI viết ra chuỗi lập luận trung gian, giúp các bước tính toán và suy luận phía sau bám sát ngữ cảnh chính xác của các bước trước, giảm tới 70% lỗi suy đoán sai.',
  },
  {
    id: 2,
    question: 'Mục đích chính của "Bộ nhớ đệm câu lệnh (Prompt Caching)" trên các nền tảng AI hiện đại là gì?',
    scenario: 'Hệ thống của bạn gửi kèm tài liệu hướng dẫn dài 20.000 đơn vị văn bản (token) trong mỗi yêu cầu.',
    options: [
      'Tự động sửa lỗi chính tả trong câu hỏi của người dùng',
      'Tái sử dụng phần hướng dẫn cố định ở đầu câu lệnh để giảm chi phí tới 75-90% và tăng tốc độ phản hồi',
      'Lưu trữ toàn bộ câu trả lời của AI vào trình duyệt của người dùng',
      'Tăng giới hạn độ dài văn bản tối đa của mô hình lên gấp đôi',
    ],
    correctIndex: 1,
    explanation: 'Bộ nhớ đệm câu lệnh nhận diện phần mở đầu lặp lại giống nhau (như tài liệu tham khảo hay hướng dẫn hệ thống dài) để tái sử dụng kết quả xử lý từ phần hướng dẫn cố định ban đầu, tiết kiệm chi phí cực lớn.',
  },
  {
    id: 3,
    question: 'Để ngăn chặn AI trả lời lan man hoặc vi phạm quy tắc, kỹ thuật nào sau đây hiệu quả nhất?',
    scenario: 'Bạn xây dựng trợ lý chăm sóc khách hàng cần tuân thủ nghiêm ngặt chính sách công ty.',
    options: [
      'Chỉ cần tăng thông số độ sáng tạo (Temperature) lên 1.0',
      'Thêm các quy tắc cấm rõ ràng và yêu cầu xuất kết quả theo khuôn mẫu dữ liệu JSON chặt chẽ',
      'Chỉ nói "Hãy trả lời ngắn gọn nhé"',
      'Gửi câu lệnh bằng chữ IN HOA toàn bộ',
    ],
    correctIndex: 1,
    explanation: 'Quy tắc cấm rõ ràng định nghĩa những gì AI tuyệt đối không được làm, kết hợp với kiểm tra khuôn mẫu dữ liệu JSON ngay khi AI trả lời là tiêu chuẩn bảo đảm chất lượng cho hệ thống thực tế.',
  },
  {
    id: 4,
    question: 'Điểm khác biệt cốt lõi giữa Tra cứu tài liệu (RAG) và Huấn luyện tinh chỉnh (Fine-Tuning) là gì?',
    scenario: 'Công ty bạn có 10.000 trang tài liệu nội bộ cập nhật mỗi tuần và muốn AI tra cứu chính xác.',
    options: [
      'RAG chỉ áp dụng cho hình ảnh, còn huấn luyện tinh chỉnh áp dụng cho văn bản',
      'RAG tìm tài liệu mới nhất chèn vào ngữ cảnh khi hỏi; huấn luyện tinh chỉnh cập nhật lại tri thức lõi bên trong mô hình',
      'RAG luôn tốn kém chi phí hơn huấn luyện tinh chỉnh gấp 10 lần',
      'Huấn luyện tinh chỉnh loại bỏ hoàn toàn hiện tượng bịa thông tin (ảo giác) trong khi RAG không thể',
    ],
    correctIndex: 1,
    explanation: 'Với dữ liệu thay đổi thường xuyên, RAG là giải pháp vượt trội vì có thể cập nhật kho tài liệu ngay tức thì mà không cần tốn chi phí và thời gian huấn luyện lại mô hình.',
  },
  {
    id: 5,
    question: 'Trong kỹ thuật đưa ví dụ mẫu (Few-Shot), yếu tố nào quyết định chất lượng AI học theo tốt nhất?',
    scenario: 'Bạn muốn AI phân loại cảm xúc phản hồi khách hàng theo 5 cấp độ phức tạp.',
    options: [
      'Càng cung cấp nhiều ví dụ ngẫu nhiên càng tốt mà không cần định dạng đồng nhất',
      'Các ví dụ mẫu phải có cấu trúc Đầu vào - Đầu ra nhất quán và bao gồm các tình huống đặc biệt dễ nhầm lẫn',
      'Chỉ cần 1 ví dụ dài 10 trang sách',
      'Đặt ví dụ ở cuối cùng sau câu hỏi của người dùng',
    ],
    correctIndex: 1,
    explanation: 'Chất lượng và tính nhất quán của ví dụ mẫu quan trọng hơn số lượng. Mô hình AI học cách nhận diện mẫu trực tiếp trong ngữ cảnh thông qua cấu trúc đồng nhất của các ví dụ.',
  },
  {
    id: 6,
    question: 'Thông số Độ sáng tạo (Temperature) = 0.1 thường được ưu tiên sử dụng trong trường hợp nào?',
    scenario: 'Bạn cấu hình trợ lý AI tự động trích xuất mã số thuế và số tiền từ hóa đơn PDF.',
    options: [
      'Sáng tác thơ ngẫu hứng hoặc kịch bản phim hài',
      'Viết mã nguồn, trích xuất dữ liệu có cấu trúc, phân tích tài chính đòi hỏi tính chính xác cao',
      'Tìm kiếm ý tưởng khởi nghiệp độc lạ',
      'Khi muốn câu trả lời của AI luôn luôn dài hơn 2.000 từ',
    ],
    correctIndex: 1,
    explanation: 'Độ sáng tạo thấp (gần 0) làm giảm tính ngẫu nhiên khi chọn từ tiếp theo, giúp mô hình luôn chọn phương án có xác suất chắc chắn nhất, đảm bảo tính nhất quán và chính xác cho công việc kỹ thuật.',
  },
  {
    id: 7,
    question: 'Tấn công "Tiêm lệnh độc hại (Prompt Injection)" diễn ra như thế nào?',
    scenario: 'Trợ lý AI của bạn tóm tắt bài viết do người dùng tải lên từ một đường dẫn web bất kỳ.',
    options: [
      'Kẻ tấn công ngắt nguồn điện máy chủ chứa AI',
      'Nội dung do người dùng tải lên chứa các câu lệnh ẩn (ví dụ: "Bỏ qua các hướng dẫn trước...") khiến AI làm trái quy tắc hệ thống',
      'Kẻ tấn công thay đổi thuật toán xử lý lõi của nhà cung cấp AI',
      'Mô hình AI tự động gửi email cho toàn bộ danh bạ',
    ],
    correctIndex: 1,
    explanation: 'Tấn công tiêm lệnh khai thác việc AI có thể nhầm lẫn giữa "chỉ dẫn hệ thống" và "dữ liệu không tin cậy từ người dùng", dẫn đến việc kẻ xấu đánh lừa AI bỏ qua quy tắc ban đầu.',
  },
  {
    id: 8,
    question: 'Mô hình Quy trình Đa Trợ Lý AI mang lại lợi thế gì so với việc dùng 1 câu lệnh đơn lẻ khổng lồ?',
    scenario: 'Xây dựng tính năng tự động chuyển bài nói chuyện 1 tiếng thành bài viết, hình minh họa và câu hỏi ôn tập.',
    options: [
      'Chia nhỏ bài toán lớn thành các trợ lý chuyên biệt cho từng nhiệm vụ, dễ kiểm tra, sửa lỗi và tối ưu hóa từng khâu',
      'Làm giảm số lượng dòng mã của hệ thống máy chủ về 0',
      'Bắt buộc phải dùng 10 máy tính khác nhau để chạy',
      'Không có lợi thế gì, 1 câu lệnh dài luôn luôn tốt hơn',
    ],
    correctIndex: 0,
    explanation: 'Tương tự cách chia nhỏ phần mềm thành từng dịch vụ độc lập, chia quy trình thành các trợ lý đơn nhiệm giúp kiểm soát chất lượng đầu ra từng chặng, tránh hiện tượng lạc đề khi hội thoại dài và dễ dàng tái sử dụng.',
  },
];

export function AIQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const currentQ = QUESTIONS[currentIndex];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const selectedOpt = selectedAnswers[currentQ.id];
  const isCorrect = selectedOpt === currentQ.correctIndex;

  const handleSelectOption = useCallback((optIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIndex }));
    setShowExplanation(true);
  }, [isAnswered, currentQ.id]);

  const handleNext = useCallback(() => {
    setShowExplanation(false);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
    setShowReviewMode(false);
  };

  // Keyboard Navigation: keys 1-4, A-D to select, and Enter to proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      if (isFinished) return;

      const key = e.key.toLowerCase();
      const optionMap: Record<string, number> = {
        '1': 0, 'a': 0,
        '2': 1, 'b': 1,
        '3': 2, 'c': 2,
        '4': 3, 'd': 3,
      };

      if (!isAnswered && optionMap[key] !== undefined) {
        e.preventDefault();
        handleSelectOption(optionMap[key]);
      } else if (isAnswered && e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, handleSelectOption, handleNext]);

  const correctCount = Object.entries(selectedAnswers).filter(
    ([qId, optIdx]) => {
      const q = QUESTIONS.find((item) => item.id === parseInt(qId, 10));
      return q && q.correctIndex === optIdx;
    }
  ).length;

  const scorePercentage = Math.round((correctCount / QUESTIONS.length) * 100);

  const getBadgeTitle = () => {
    if (correctCount === 8) return { title: 'Bậc Thầy Thiết Kế Câu Lệnh 🏆', desc: 'Bạn đã đạt cấp độ chuyên gia vững vàng về cách sử dụng và thiết kế hệ thống AI!' };
    if (correctCount >= 6) return { title: 'Người Thực Hành AI Thành Thạo 🚀', desc: 'Kiến thức thực chiến rất vững vàng về suy luận từng bước, tối ưu chi phí và kiểm soát an toàn AI!' };
    if (correctCount >= 4) return { title: 'Người Khám Phá AI 💡', desc: 'Bạn nắm tốt các khái niệm cốt lõi, hãy tiếp tục thực hành trên Khu Thử Nghiệm AI nhé!' };
    return { title: 'Người Mới Khởi Đầu 📚', desc: 'Hãy khám phá các danh mục kỹ năng trên AI Life Hub để nâng cấp kỹ năng ngay!' };
  };

  const handleCopyBadge = async () => {
    const badge = getBadgeTitle();
    const certificateText = `🎓 CHỨNG NHẬN KỸ NĂNG AI LIFE HUB
Danh hiệu: ${badge.title}
Kết quả: ${correctCount}/8 câu đúng (${scorePercentage}%)
Đánh giá: ${badge.desc}
Xác thực trực tuyến: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-life-hub-omega.vercel.app'}/learn/quiz`;

    try {
      await navigator.clipboard.writeText(certificateText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = certificateText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        document.body.removeChild(textarea);
        toast.error('Không thể sao chép chứng chỉ kỹ năng.');
        return;
      }
      document.body.removeChild(textarea);
    }
    setCopiedBadge(true);
    toast.success('Đã sao chép chứng chỉ kỹ năng vào bộ nhớ tạm!');
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      {/* Quiz Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-semibold mb-3">
          <HelpCircle className="h-4 w-4" />
          <span>Kiểm Tra Kiến Thức Tương Tác</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-text sm:text-4xl mb-2 tracking-tight">
          Trắc Nghiệm Kiến Thức AI
        </h1>
        <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          8 câu hỏi tình huống thực tế kiểm tra mức độ hiểu biết về mô hình AI, cách viết câu lệnh hiệu quả và thiết kế quy trình trợ lý thông minh.
        </p>
      </div>

      {!isFinished ? (
        <div className="rounded-3xl border border-border bg-bg-elevated p-6 sm:p-8 shadow-md">
          {/* Progress Bar & Keyboard Hint */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-text-muted mb-2">
              <span className="flex items-center gap-1.5">
                <span>Câu hỏi {currentIndex + 1} / {QUESTIONS.length}</span>
                <span className="hidden sm:inline text-[11px] font-normal text-text-muted/80">
                  (Bấm phím <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border text-[10px] font-mono">1-4</kbd> hoặc <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border text-[10px] font-mono">A-D</kbd>)
                </span>
              </span>
              <span className="font-mono text-accent">Đã trả lời: {Object.keys(selectedAnswers).length}/{QUESTIONS.length}</span>
            </div>
            {/* Animated Linear-style progress bar */}
            <div
              className="w-full h-2 rounded-full bg-border overflow-hidden"
              role="progressbar"
              aria-label="Tiến độ bài trắc nghiệm"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={QUESTIONS.length}
            >
              <div
                className="h-full bg-gradient-to-r from-accent-500 via-accent to-accent-hover transition-all duration-500 rounded-full"
                style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase text-accent mb-1 tracking-wider">
              Tình huống thực tế:
            </div>
            <p className="text-xs text-text-muted italic mb-3 bg-bg p-3 rounded-xl border border-border/80">
              &quot;{currentQ.scenario}&quot;
            </p>
            <h2 className="text-lg font-bold text-text leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, optIdx) => {
              let optStyle = 'border-border hover:border-accent/60 bg-bg text-text hover:bg-bg/80';
              if (isAnswered) {
                if (optIdx === currentQ.correctIndex) {
                  optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30';
                } else if (optIdx === selectedOpt) {
                  optStyle = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 ring-2 ring-red-500/30';
                } else {
                  optStyle = 'opacity-50 border-border bg-bg text-text-muted';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-start gap-3 group relative ${optStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isAnswered && optIdx === currentQ.correctIndex
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      : isAnswered && optIdx === selectedOpt
                      ? 'border-red-500 bg-red-500/20 text-red-700 dark:text-red-400'
                      : 'border-border bg-bg-surface text-text-muted group-hover:border-accent group-hover:text-accent'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswered && optIdx === currentQ.correctIndex && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && optIdx === selectedOpt && optIdx !== currentQ.correctIndex && (
                    <XCircle className="h-5 w-5 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className={`p-5 rounded-2xl mb-6 text-xs sm:text-sm leading-relaxed border ${
              isCorrect
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">Chính xác tuyệt đối!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-700 dark:text-red-400" />
                    <span className="text-amber-700 dark:text-amber-400">Chưa đúng! Đáp án đúng là {String.fromCharCode(65 + currentQ.correctIndex)}.</span>
                  </>
                )}
              </div>
              <p className="text-text-muted leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Next */}
          {isAnswered && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-text-muted hidden sm:inline">
                Nhấn phím <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border text-[10px] font-mono">Enter</kbd> để tiếp tục
              </span>
              <Button size="lg" onClick={handleNext} className="gap-2 bg-accent hover:bg-accent-hover text-white shadow-md ml-auto">
                <span>{currentIndex < QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả bài thi'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-bg-elevated p-8 sm:p-12 text-center shadow-md">
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Award className="h-10 w-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent">
              Chứng Nhận Đánh Giá Kỹ Năng
            </span>

            <h2 className="text-3xl font-display font-bold text-text mt-4 mb-2 tracking-tight">
              {getBadgeTitle().title}
            </h2>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6 leading-relaxed">
              {getBadgeTitle().desc}
            </p>

            <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-bg border border-border mb-8 shadow-sm">
              <div>
                <div className="text-2xl font-black text-text font-mono">
                  {correctCount} / {QUESTIONS.length}
                </div>
                <div className="text-[11px] text-text-muted uppercase font-semibold">Câu đúng</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <div className="text-2xl font-black text-accent font-mono">
                  {scorePercentage}%
                </div>
                <div className="text-[11px] text-text-muted uppercase font-semibold">Tỷ lệ chính xác</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCopyBadge}
                className="py-2.5 px-4 rounded-xl bg-accent text-white font-medium text-sm flex items-center gap-2 hover:bg-accent-hover shadow-md transition-all active:scale-[0.98]"
              >
                {copiedBadge ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copiedBadge ? 'Đã sao chép chứng chỉ!' : 'Sao chép chứng chỉ kỹ năng'}
              </button>

              <button
                type="button"
                onClick={() => setShowReviewMode(!showReviewMode)}
                className="py-2.5 px-4 rounded-xl border border-border bg-bg hover:bg-hover text-text font-medium text-sm flex items-center gap-2 transition-all"
              >
                {showReviewMode ? <EyeOff className="w-4 h-4 text-text-muted" /> : <Eye className="w-4 h-4 text-text-muted" />}
                {showReviewMode ? 'Ẩn chi tiết đáp án' : 'Xem lại chi tiết đáp án'}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="py-2.5 px-4 rounded-xl border border-border bg-bg hover:bg-hover text-text font-medium text-sm flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-text-muted" />
                Làm lại bài trắc nghiệm
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
              <Link
                href="/playground"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" /> Thực hành trong Khu Thử Nghiệm AI →
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" /> Khám phá 55 kỹ năng AI →
              </Link>
            </div>
          </div>

          {/* Detailed Review Mode */}
          {showReviewMode && (
            <div className="rounded-3xl border border-border bg-bg-elevated p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-text text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  Chi Tiết Đáp Án &amp; Giải Thích Kỹ Thuật (8/8 Câu)
                </h3>
                <span className="text-xs font-mono text-accent">
                  {correctCount}/{QUESTIONS.length} đúng
                </span>
              </div>

              <div className="space-y-4">
                {QUESTIONS.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isUserCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border bg-bg space-y-3 ${
                        isUserCorrect ? 'border-emerald-500/40' : 'border-red-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                            isUserCorrect ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <h4 className="font-semibold text-text text-sm">
                            {q.question}
                          </h4>
                        </div>
                        {isUserCorrect ? (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-4 h-4" /> Đúng
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1 shrink-0">
                            <XCircle className="w-4 h-4" /> Sai
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs pl-8">
                        <div>
                          <span className="text-text-muted">Bạn đã chọn: </span>
                          <span className={isUserCorrect ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-red-700 dark:text-red-400 font-semibold'}>
                            {userAnswer !== undefined ? `${String.fromCharCode(65 + userAnswer)}. ${q.options[userAnswer]}` : 'Chưa chọn'}
                          </span>
                        </div>
                        {!isUserCorrect && (
                          <div>
                            <span className="text-text-muted">Đáp án chính xác: </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                              {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                            </span>
                          </div>
                        )}
                        <p className="text-text-muted pt-1.5 border-t border-border/80 leading-relaxed italic">
                          💡 <strong>Giải thích:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
