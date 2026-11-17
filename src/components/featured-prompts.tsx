'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    title: 'System Prompt Generator (XML Tags)',
    description: 'Tạo system prompt chuẩn cấu trúc thẻ XML chuyên nghiệp cho bất kỳ vai trò tác tử nào',
    prompt: `<system_prompt>
  <role>Senior AI Solutions Architect</role>
  <task>{task}</task>
  <principles>
    <principle>1. Phân tích ngữ cảnh kỹ lưỡng trước khi đưa giải pháp</principle>
    <principle>2. Áp dụng chuẩn thiết kế mở, bảo mật đa tầng</principle>
    <principle>3. Xuất mã nguồn có chú thích và giải thích ngắn gọn</principle>
  </principles>
  <output_format>Markdown chuẩn</output_format>
</system_prompt>`,
    category: 'Prompt Engineering',
    tags: ['system-prompt', 'xml-tags', 'role-play'],
    useCase: 'Thiết lập persona cho AI assistant & Enterprise Agents',
  },
  {
    id: 'prompt-2',
    title: 'Chain-of-Thought (CoT) Reasoning',
    description: 'Kích hoạt năng lực suy luận chuỗi từng bước giải quyết bài toán phức tạp và logic cao',
    prompt: `Hãy giải quyết bài toán sau bằng phương pháp suy luận từng bước (Chain-of-Thought):

Bài toán: {problem}

Quy trình suy luận:
1. Xác định dữ kiện đã biết và biến số cần tìm
2. Phân tích các ràng buộc logic và giả định biên
3. Thực hiện từng bước tính toán/suy luận có căn cứ
4. Tự kiểm chứng tính hợp lý của kết quả trung gian
5. Đưa ra kết luận tối ưu cuối cùng`,
    category: 'Advanced Prompting',
    tags: ['cot', 'reasoning', 'logic'],
    useCase: 'Toán học, phân tích kinh tế, gỡ lỗi kiến trúc hệ thống',
  },
  {
    id: 'prompt-3',
    title: 'Code Review & Security Audit',
    description: 'Kiểm duyệt mã nguồn chuyên nghiệp: OWASP Top 10, hiệu năng và chuẩn Clean Code',
    prompt: `Hãy đóng vai trò Principal Security Engineer & Code Reviewer.
Phân tích đoạn mã sau:
\`\`\`{language}
{code}
\`\`\`

Báo cáo phân tích bao gồm:
1. Lỗ hổng bảo mật tiềm ẩn (SQL injection, XSS, Memory leak)
2. Độ phức tạp thời gian & không gian (Big-O analysis)
3. Điểm vi phạm nguyên lý SOLID & Clean Code
4. Đề xuất bản vá tối ưu (kèm mã nguồn đã sửa)`,
    category: 'AI Productivity',
    tags: ['code-review', 'security', 'clean-code'],
    useCase: 'Review Pull Request, bảo mật sản phẩm trước release',
  },
  {
    id: 'prompt-4',
    title: 'RAG Query Decomposer & HyDE',
    description: 'Tối ưu hóa truy vấn ngữ nghĩa cho hệ thống RAG: Viết lại, phân rã và tạo văn bản giả định',
    prompt: `Bạn là RAG Query Optimizer engine.
Câu hỏi gốc: {query}

Nhiệm vụ:
1. Query Rewriting: Làm rõ ý định, loại bỏ từ thừa
2. Sub-query Decomposition: Chia nhỏ thành 3 câu hỏi thành phần độc lập
3. HyDE (Hypothetical Document Embeddings): Tạo đoạn tài liệu lý tưởng 100 từ chứa câu trả lời để vector database tìm kiếm chính xác nhất.`,
    category: 'RAG Systems',
    tags: ['rag', 'hyde', 'vector-search'],
    useCase: 'Tăng Recall và Precision trong tìm kiếm tri thức doanh nghiệp',
  },
  {
    id: 'prompt-5',
    title: 'Content Repurposing Multi-Format',
    description: 'Chuyển hóa 1 bài nghiên cứu hoặc bài viết kỹ thuật thành chuỗi ấn phẩm đa kênh',
    prompt: `Bạn là Lead Tech Evangelist & Content Strategist.
Từ nội dung nguồn: {source_content}

Hãy tạo 4 định dạng truyền thông chất lượng cao:
1. Kỹ thuật sâu (Technical Blog 800 từ)
2. Chuỗi súc tích (Twitter/X Thread 6 tweets có hook mạnh)
3. Chuyên gia phân tích (LinkedIn Article có call-to-action)
4. Tóm tắt điều hành (Executive Summary 3 bullet points quan trọng nhất)`,
    category: 'AI Productivity',
    tags: ['content', 'marketing', 'social-media'],
    useCase: 'Lan tỏa tri thức kỹ thuật và xây dựng thương hiệu công nghệ',
  },
  {
    id: 'prompt-6',
    title: 'Personalized AI Learning Roadmap',
    description: 'Thiết kế lộ trình đào tạo cá nhân hóa theo mục tiêu và quỹ thời gian thực tế',
    prompt: `Bạn là Giảng viên Trưởng viện AI.
Thiết kế lộ trình học kỹ thuật {topic} cho học viên có nền tảng: {background}.
Quỹ thời gian: {hours_per_week} giờ/tuần trong {weeks} tuần.

Xuất ra:
- Phân bổ từng tuần: Khái niệm cốt lõi, Dự án thực hành nhỏ (Hands-on Lab)
- 3 Dự án Capstone thực tế đưa vào Portfolio
- Danh sách tài liệu, paper kinh điển và cộng đồng mở hỗ trợ`,
    category: 'Education & Upskill',
    tags: ['learning-path', 'roadmap', 'upskill'],
    useCase: 'Nâng cao trình độ kỹ sư phần mềm sang AI Engineer',
  },
];

export function FeaturedPrompts() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const copyPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      toast.success('Đã sao chép prompt vào bộ nhớ tạm!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Không thể sao chép prompt.');
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-bg-surface/30 border-b border-border/50" aria-labelledby="prompts-heading">
      <div className="container mx-auto px-section-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Templates Thực Chiến</span>
            </div>
            <h2 id="prompts-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text tracking-tight">
              Mẫu Prompt Tuyển Chọn Sẵn Dùng
            </h2>
            <p className="text-text-muted mt-2 text-sm sm:text-base max-w-xl">
              Được chuẩn hóa theo cấu trúc XML, Chain-of-Thought và kiểm chứng thực tế trên Claude 3.5 &amp; GPT-4o.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/prompts"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors mr-2"
            >
              <span>Xem tất cả 80+ prompt</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl border border-border bg-bg-surface hover:bg-hover text-text-muted hover:text-text transition-all shadow-xs active:scale-95"
              aria-label="Cuộn trái"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl border border-border bg-bg-surface hover:bg-hover text-text-muted hover:text-text transition-all shadow-xs active:scale-95"
              aria-label="Cuộn phải"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Native Smooth Snap */}
        <div className="relative -mx-section-x px-section-x">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory scroll-smooth"
            role="list"
            aria-label="Danh sách prompt templates"
          >
            {featuredPrompts.map((prompt) => (
              <article
                key={prompt.id}
                className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[380px] snap-start flex flex-col rounded-2xl border border-border bg-bg-surface p-6 shadow-xs hover:border-accent/40 hover:shadow-card-hover transition-all group"
                role="listitem"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    {prompt.category}
                  </span>
                  <span className="text-[11px] text-text-muted font-medium line-clamp-1 max-w-[140px] text-right">
                    {prompt.useCase}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-text mb-2 group-hover:text-accent transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {prompt.description}
                </p>

                {/* Prompt Preview Code Box */}
                <div className="mb-4 rounded-xl border border-border bg-bg/80 p-3 font-mono text-[11px] text-text-muted line-clamp-3 select-none leading-relaxed">
                  {prompt.prompt}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-bg text-text-muted border border-border text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                  <button
                    type="button"
                    onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-xs',
                      copiedId === prompt.id
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/30'
                    )}
                    aria-label={copiedId === prompt.id ? 'Đã sao chép prompt' : `Sao chép prompt: ${prompt.title}`}
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>Đã sao chép prompt!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Sao chép Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            <span>Xem tất cả 80+ prompt</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
