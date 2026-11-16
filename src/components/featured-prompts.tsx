'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui';

interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  useCase: string;
}

const featuredPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    title: 'System Prompt Generator',
    description: 'Tạo system prompt chuyên nghiệp cho bất kỳ vai trò nào',
    prompt: `Bạn là một chuyên gia {role} với {experience} năm kinh nghiệm.
Nhiệm vụ: {task}

Nguyên tắc hoạt động:
1. {principle_1}
2. {principle_2}
3. {principle_3}

Định dạng đầu ra: {format}
Phong cách: {tone}
Ngôn ngữ: Tiếng Việt`,
    category: 'Prompt Engineering',
    tags: ['system-prompt', 'template', 'role-play'],
    useCase: 'Thiết lập persona cho AI assistant',
  },
  {
    id: 'prompt-2',
    title: 'Chain-of-Thought Reasoning',
    description: 'Buộc LLM suy luận từng bước để giải quyết bài toán phức tạp',
    prompt: `Hãy giải quyết bài toán sau bằng cách suy luận từng bước (Chain-of-Thought).

Bài toán: {problem}

Hãy làm theo các bước:
Bước 1: Phân tích đề bài - xác định known/unknown
Bước 2: Xác định phương pháp/strategy
Bước 3: Thực hiện từng bước tính toán/suy luận
Bước 4: Kiểm tra lại kết quả
Bước 5: Đưa ra câu trả lời cuối cùng

Format: 
**Bước 1:** ...
**Bước 2:** ...
**Kết quả:** ...`,
    category: 'Advanced Prompting',
    tags: ['cot', 'reasoning', 'problem-solving'],
    useCase: 'Toán học, logic, debug code, phân tích',
  },
  {
    id: 'prompt-3',
    title: 'Code Review Assistant',
    description: 'Review code chuyên nghiệp: security, performance, best practices',
    prompt: `Hãy review code dưới đây với vai trò Senior Software Engineer.

Code:
\`\`\`{language}
{code}
\`\`\`

Hãy kiểm tra và đưa ra feedback theo cấu trúc:
1. **Security Issues** - Lỗ hổng bảo mật tiềm ẩn
2. **Performance** - Điểm nghẽn và tối ưu hóa
3. **Best Practices** - Violation của clean code/SOLID
4. **Bugs/Logic Errors** - Lỗi logic tiềm ẩn
5. **Suggestions** - Gợi ý cải thiện cụ thể

Đánh giá tổng thể: 🟢/🟡/🔴`,
    category: 'AI Productivity',
    tags: ['code-review', 'developer-tools', 'best-practices'],
    useCase: 'Review PR, học code, cải thiện chất lượng',
  },
  {
    id: 'prompt-4',
    title: 'RAG Query Optimizer',
    description: 'Tối ưu truy vấn cho hệ thống RAG: rewrite, decompose, hyde',
    prompt: `Bạn là Query Optimizer cho hệ thống RAG.

Câu hỏi gốc: {query}

Hãy thực hiện:
1. **Query Rewriting**: Viết lại câu hỏi rõ ràng, tách biệt ý định
2. **Query Decomposition**: Tách thành các sub-questions nếu phức tạp
3. **HyDE Generation**: Tạo hypothetical document embedding

Output format:
- Rewritten: ...
- Sub-questions: [...]
- HyDE: ...`,
    category: 'RAG Systems',
    tags: ['rag', 'query-optimization', 'retrieval'],
    useCase: 'Cải thiện độ chính xác retrieval',
  },
  {
    id: 'prompt-5',
    title: 'Content Repurposing Pipeline',
    description: 'Chuyển 1 nội dung thành 10+ format: blog, tweet, linkedin, newsletter',
    prompt: `Bạn là Content Strategist. Chuyển nội dung sau thành nhiều format.

Nguồn: {source_content}
Đối tượng: {audience}
Tone: {tone}

Tạo:
1. Blog post (800-1000 từ, SEO optimized)
2. Twitter thread (8-12 tweets)
3. LinkedIn post (professional, engaging)
4. Newsletter section (personal, actionable)
5. Instagram carousel script (visual-focused)
6. Short video script (TikTok/Reels, 60s)
7. Key takeaways (3 bullet points)`,
    category: 'AI Productivity',
    tags: ['content', 'repurposing', 'marketing', 'social-media'],
    useCase: 'Content marketing, personal branding',
  },
  {
    id: 'prompt-6',
    title: 'Learning Path Designer',
    description: 'Thiết kế lộ trình học tập cá nhân hóa theo mục tiêu',
    prompt: `Bạn là Learning Architect. Thiết kế lộ trình học {topic} cho {learner_profile}.

Mục tiêu: {goal}
Thời gian: {time_available} giờ/tuần
Nền tảng ưu tiên: {platforms}
Ngân sách: {budget}

Output:
1. **Roadmap** (tuần 1-12): Chủ đề, tài nguyên, deliverable
2. **Milestones**: Checkpoint đánh giá tiến độ
3. **Projects**: 3-5 project thực hành tăng dần độ khó
4. **Resources**: Sách, khóa học, paper, community
5. **Accountability**: Phương pháp theo dõi & điều chỉnh`,
    category: 'AI Productivity',
    tags: ['learning', 'roadmap', 'personal-development', 'education'],
    useCase: 'Học kỹ năng mới, chuyển nghề, upskill',
  },
];

export function FeaturedPrompts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsPerView = typeof window !== 'undefined' ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1) : 3;
  const { addToast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      if (newCardsPerView !== cardsPerView) {
        setCurrentIndex(0);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardsPerView]);

  const scrollLeft = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - cardsPerView, 0));
  }, [cardsPerView]);

  const scrollRight = useCallback(() => {
    const maxIndex = featuredPrompts.length - cardsPerView;
    setCurrentIndex((prev) => Math.min(prev + cardsPerView, maxIndex));
  }, [cardsPerView]);

  const copyPrompt = async (prompt: string, id: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    addToast('success', 'Đã sao chép prompt!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const visiblePrompts = featuredPrompts.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <section className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-900/50" aria-labelledby="prompts-heading">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id="prompts-heading" className="heading-2 mb-2">
              Prompt templates nổi bật
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sẵn sàng copy-paste, tùy chỉnh cho ngay lập tức
            </p>
          </div>
          <a
            href="/prompts"
            className="hidden sm:inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            Xem tất cả <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            role="list"
            aria-label="Featured prompts carousel"
          >
            {visiblePrompts.map((prompt, index) => (
              <article
                key={prompt.id}
                className="card flex-shrink-0 w-[320px] sm:w-[360px] snap-start snap-always-center flex flex-col p-6"
                role="listitem"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="badge-base bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">{prompt.category}</span>
                  <Sparkles className="h-4 w-4 text-gray-400/50 shrink-0" aria-hidden="true" />
                </div>

                <h3 className="heading-4 mb-2 text-gray-900 dark:text-white">{prompt.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{prompt.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {prompt.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="badge-base bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 4 && (
                    <span className="badge-base bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">+{prompt.tags.length - 4}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                    aria-label={copiedId === prompt.id ? 'Đã sao chép' : `Sao chép prompt: ${prompt.title}`}
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="h-4 w-4 mr-1" aria-hidden="true" />
                        Đã copy
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
                        Copy prompt
                      </>
                    )}
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {featuredPrompts.length > cardsPerView && (
            <>
              <button
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-10 p-2 rounded-full bg-bg/80 backdrop-blur-sm border border-border shadow-lg hover:bg-bg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Cuộn trái"
                aria-hidden="true"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={currentIndex >= featuredPrompts.length - cardsPerView}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-10 p-2 rounded-full bg-bg/80 backdrop-blur-sm border border-border shadow-lg hover:bg-bg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Cuộn phải"
                aria-hidden="true"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Prompt pagination">
            {Math.ceil(featuredPrompts.length / cardsPerView) > 1 && (
              Array.from({ length: Math.ceil(featuredPrompts.length / cardsPerView) }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === Math.floor(currentIndex / cardsPerView)}
                  aria-label={`Trang ${i + 1}`}
                  onClick={() => setCurrentIndex(i * cardsPerView)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === Math.floor(currentIndex / cardsPerView)
                      ? 'bg-brand-600 w-6'
                      : 'bg-gray-400/30 dark:bg-gray-500/30 hover:bg-gray-400/50 dark:hover:bg-gray-500/50'
                  )}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <a
            href="/prompts"
            className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            Xem tất cả prompt <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}