'use client';

import { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  Play,
  CheckCircle2,
  Copy,
  Download,
  Sparkles,
  Bot,
  Layers,
  FileCode,
  PenTool,
  Search,
  Rocket,
  BarChart3,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

interface WorkflowStep {
  id: string;
  title: string;
  role: string;
  description: string;
  promptTemplate: string;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  color: string;
  inputPlaceholder: string;
  defaultInput: string;
  steps: WorkflowStep[];
}

const PRESET_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'content-factory',
    name: 'Content Factory 360° Pipeline',
    category: 'Sáng tạo nội dung & Marketing',
    description: 'Chuyển 1 ý tưởng thô thành bài viết SEO 1000 từ, chuỗi 8 Tweets, bài đăng LinkedIn và Newsletter chuyên sâu.',
    icon: PenTool,
    color: '#F59E0B',
    inputPlaceholder: 'Ví dụ: Cách xây dựng hệ thống AI Agent cho lập trình viên năm 2026',
    defaultInput: 'Chiến lược tối ưu hóa chi phí token và caching khi phát triển ứng dụng LLM quy mô lớn',
    steps: [
      {
        id: 'step-outline',
        title: 'Bước 1: Dàn ý & Hook bài viết',
        role: 'Senior Content Strategist',
        description: 'Tạo hook thu hút, dàn ý 4 phần và các luận điểm chính',
        promptTemplate: 'Bạn là Content Strategist. Hãy lập dàn ý chi tiết có Hook giật gân, 4 luận điểm chính và FAQ cho chủ đề: {{input}}',
      },
      {
        id: 'step-blog',
        title: 'Bước 2: Viết Blog SEO chuyên sâu',
        role: 'Tech Blogger & SEO Specialist',
        description: 'Mở rộng dàn ý thành bài viết 1000 từ chuẩn SEO có heading H2/H3',
        promptTemplate: 'Dựa vào dàn ý trên, hãy viết bài blog 1000 từ, phong cách thực tế, có code snippets hoặc ví dụ cụ thể.',
      },
      {
        id: 'step-twitter',
        title: 'Bước 3: Chuỗi Viral Twitter/X Thread',
        role: 'Social Media Growth Hacker',
        description: 'Chuyển đổi bài blog thành 8 tweets cô đọng, dễ viral',
        promptTemplate: 'Chuyển nội dung bài viết thành chuỗi 8 tweets (Thread X/Twitter). Tweet 1 là Hook mạnh mẽ, Tweet 8 là CTA và tóm tắt.',
      },
      {
        id: 'step-linkedin',
        title: 'Bước 4: LinkedIn Thought Leadership',
        role: 'Executive Advisor',
        description: 'Biên tập lại theo phong cách chuyên nghiệp, cá nhân hóa cho mạng xã hội nghề nghiệp',
        promptTemplate: 'Viết lại dưới dạng bài đăng LinkedIn 250-300 từ với góc nhìn lãnh đạo công nghệ, có bài học rút ra và câu hỏi mở.',
      },
    ],
  },
  {
    id: 'code-architect',
    name: 'Full-Stack Feature Architecture',
    category: 'Lập trình & Kỹ thuật',
    description: 'Từ User Story thiết kế Database Schema, API Route, React Component có Tailwind và Unit Tests.',
    icon: FileCode,
    color: '#10B981',
    inputPlaceholder: 'Ví dụ: Tính năng Bookmarks lưu bài viết có hỗ trợ offline và sync Supabase',
    defaultInput: 'Hệ thống voting/upvote prompt cộng đồng với rate-limit chống spam và thống kê thời gian thực',
    steps: [
      {
        id: 'step-db',
        title: 'Bước 1: Thiết kế Database & SQL Schema',
        role: 'Principal Database Architect',
        description: 'Xác định bảng, indexes, khóa ngoại và Row-Level Security',
        promptTemplate: 'Thiết kế PostgreSQL schema chi tiết cho tính năng: {{input}}. Bao gồm bảng, indexes, RLS policies và triggers.',
      },
      {
        id: 'step-api',
        title: 'Bước 2: API Route / Server Actions',
        role: 'Senior Backend Engineer',
        description: 'Viết endpoint Next.js API hoặc Server Actions chuẩn type-safe',
        promptTemplate: 'Viết mã nguồn Next.js Server Actions cho tính năng trên, có validate đầu vào bằng Zod và xử lý lỗi chặt chẽ.',
      },
      {
        id: 'step-ui',
        title: 'Bước 3: React UI Component',
        role: 'Staff Frontend Engineer',
        description: 'Tạo component React có accessibility (a11y), Tailwind CSS và optimistic updates',
        promptTemplate: 'Tạo mã nguồn component React hoàn chỉnh, responsive, hỗ trợ dark mode, hiệu ứng hover mượt mà.',
      },
      {
        id: 'step-tests',
        title: 'Bước 4: Unit & Integration Tests',
        role: 'QA & Security Automation Engineer',
        description: 'Bộ kiểm thử Jest / Vitest bao phủ các trường hợp biên và lỗi',
        promptTemplate: 'Viết bộ test suite bao gồm happy path, edge cases (lỗi mạng, rate limit, dữ liệu rỗng).',
      },
    ],
  },
  {
    id: 'academic-research',
    name: 'Deep Research & Fact-Check Audit',
    category: 'Nghiên cứu & Học thuật',
    description: 'Phân tích tài liệu phức tạp, bóc tách luận điểm, phản biện đối chứng và trích xuất flashcards Anki.',
    icon: Search,
    color: '#6366F1',
    inputPlaceholder: 'Ví dụ: Tác động của Retrieval-Augmented Generation đối với Hallucination trong y khoa',
    defaultInput: 'Mô hình tư duy Chain-of-Thought và tác động tới khả năng giải toán của Large Language Models',
    steps: [
      {
        id: 'step-synth',
        title: 'Bước 1: Tổng hợp Luận điểm Cốt lõi',
        role: 'Senior Research Fellow',
        description: 'Trích xuất 5 phát hiện chính, phương pháp nghiên cứu và bằng chứng',
        promptTemplate: 'Phân tích học thuật sâu sắc về chủ đề: {{input}}. Tóm tắt 5 luận điểm chính kèm bằng chứng thực nghiệm.',
      },
      {
        id: 'step-counter',
        title: 'Bước 2: Phản biện Đối chứng (Devil\'s Advocate)',
        role: 'Critical Reviewer & Epistemic Auditor',
        description: 'Tìm kiếm lỗ hổng lập luận, thiên kiến và các nghiên cứu đi ngược lại',
        promptTemplate: 'Đóng vai nhà phản biện độc lập. Nêu ra 3 điểm yếu lớn nhất và 2 trường hợp giả định sai lầm của kết luận trên.',
      },
      {
        id: 'step-anki',
        title: 'Bước 3: Trích xuất Bộ Flashcard Anki',
        role: 'Cognitive Science Specialist',
        description: 'Tạo 10 thẻ ghi nhớ Cloze/Q&A để ghi nhớ dài hạn',
        promptTemplate: 'Chuyển toàn bộ kiến thức trên thành 8 thẻ Anki (dạng Q&A hoặc Cloze deletion) phục vụ Active Recall.',
      },
    ],
  },
  {
    id: 'product-launch',
    name: 'Product MVP & Go-To-Market Sprint',
    category: 'Sáng tạo & Khởi nghiệp',
    description: 'Từ ý tưởng thô xác định chân dung khách hàng (ICP), bản tuyên ngôn giá trị và Landing Page Copy.',
    icon: Rocket,
    color: '#EC4899',
    inputPlaceholder: 'Ví dụ: Ứng dụng AI ghi nhớ từ vựng tiếng Anh theo ngữ cảnh video YouTube',
    defaultInput: 'Nền tảng AI trợ lý chuẩn bị phỏng vấn công việc với giả lập phỏng vấn thoại thời gian thực',
    steps: [
      {
        id: 'step-icp',
        title: 'Bước 1: Chân dung Khách hàng Mục tiêu (ICP)',
        role: 'Product Lead & Market Researcher',
        description: 'Nỗi đau (Pain points), mục tiêu và lý do họ sẵn sàng trả tiền',
        promptTemplate: 'Xác định 2 nhóm khách hàng lý tưởng (ICP) cho sản phẩm: {{input}}. Phân tích sâu nỗi đau và ngân sách chi trả.',
      },
      {
        id: 'step-landing',
        title: 'Bước 2: Landing Page Copy Bán Hàng',
        role: 'Conversion Copywriter',
        description: 'Hero Headline, Bullet points lợi ích, Social Proof và Kêu gọi hành động',
        promptTemplate: 'Viết nội dung Landing Page theo công thức PAS (Problem - Agitate - Solution) chuyển đổi cao.',
      },
      {
        id: 'step-email',
        title: 'Bước 3: Chuỗi Email Chăm sóc & Ra mắt',
        role: 'Lifecycle Marketing Manager',
        description: '3 email: Thông báo ra mắt, Câu chuyện sáng lập, Ưu đãi sớm',
        promptTemplate: 'Viết chuỗi 3 email gửi danh sách chờ (Waitlist) kích thích người dùng trải nghiệm ngay ngày đầu tiên.',
      },
    ],
  },
];

export function WorkflowExplorer() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition>(PRESET_WORKFLOWS[0]);
  const [inputText, setInputText] = useState<string>(PRESET_WORKFLOWS[0].defaultInput);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepOutputs, setStepOutputs] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleSelectWorkflow = (wf: WorkflowDefinition) => {
    setSelectedWorkflow(wf);
    setInputText(wf.defaultInput);
    setCurrentStepIndex(0);
    setStepOutputs({});
  };

  const handleRunStep = async (index: number) => {
    const step = selectedWorkflow.steps[index];
    if (!step) return;

    setIsRunning(true);
    const prevOutput = index > 0 ? stepOutputs[selectedWorkflow.steps[index - 1].id] || '' : '';
    
    // Simulate generation with realistic delays
    await new Promise((resolve) => setTimeout(resolve, 800));

    const simulatedOutputs: Record<string, string> = {
      'step-outline': `### 📋 Dàn ý Chiến lược: ${inputText}

- **Hook**: Trong kỷ nguyên mà mỗi truy vấn có thể tốn hàng cent, việc tối ưu hóa token không chỉ là tiết kiệm tiền mà là sự sống còn của ứng dụng!
- **Phần 1: Bản đồ tiêu thụ Token** - Phân tích chi phí ẩn giữa input, output và cached tokens.
- **Phần 2: 3 Kỹ thuật Caching đỉnh cao** - Prompt caching của Anthropic & OpenAI, Semantic caching với Redis.
- **Phần 3: Giảm Context Window không mất ngữ cảnh** - Chunking thông minh, summarization agent.
- **Phần 4: Kết luận & Checklist** - 5 bước kiểm tra trước khi đưa lên production.`,

      'step-blog': `## Tối Ưu Hóa Chi Phí Token: Bí Quyết Scaling Ứng Dụng LLM Bền Vững

Khi xây dựng các hệ thống AI cấp doanh nghiệp, rào cản lớn nhất không phải là độ thông minh của mô hình, mà là hóa đơn API vào cuối tháng. Bài viết này hướng dẫn bạn 3 chiến lược đã được chứng minh giúp cắt giảm tới 68% chi phí.

### 1. Kích hoạt Prompt Caching
Cả Anthropic Claude và OpenAI hiện đều hỗ trợ lưu cache các đoạn System Prompt dài. Bằng cách giữ nguyên phần đầu của ngữ cảnh, bạn chỉ phải trả 10-25% giá cho các token được tái sử dụng.

### 2. Semantic Caching với Vector Database
Thay vì gọi lại LLM cho các câu hỏi tương đương nhau (ví dụ: "chính sách hoàn tiền" vs "làm sao để lấy lại tiền?"), hãy sử dụng cosine similarity để trả về câu trả lời đã tính toán trước đó từ cache.

\`\`\`typescript
// Ví dụ Semantic Cache Check
const cachedResult = await vectorStore.findSimilar(query, 0.95);
if (cachedResult) return cachedResult.response;
\`\`\``,

      'step-twitter': `🧵 1/8: Nếu ứng dụng AI của bạn đang "đốt" hàng ngàn USD tiền API mỗi tháng, đây là 3 kỹ thuật cắt giảm ngay 68% chi phí token mà không giảm chất lượng: 👇

2/8: 1. Prompt Caching: Đừng gửi lại context window từ đầu mỗi lần gọi API. Đặt các tài liệu tĩnh ở đầu prompt để tận dụng cache hit của OpenAI & Claude.

3/8: 2. Semantic Caching: Hơn 40% câu hỏi của người dùng có ý định tương đồng. Lưu cache câu trả lời bằng vector similarity sẽ giúp bạn tiết kiệm hàng ngàn truy vấn không cần thiết.

4/8: 3. Negative Prompting & Strict Output: Giới hạn độ dài output bằng token limit và JSON schema giúp loại bỏ 50% từ ngữ thừa thãi.

... (Thread 8 tweets hoàn chỉnh)`,

      'step-linkedin': `🚀 Tiết kiệm 68% chi phí vận hành AI: Bài học từ thực tế xây dựng ứng dụng LLM quy mô lớn.

Rất nhiều startup AI gặp phải nghịch lý: Càng nhiều người dùng, biên lợi nhuận càng âm do chi phí token tăng theo cấp số nhân.

Sau 6 tháng thử nghiệm và tối ưu trên hàng triệu request, đây là 3 nguyên tắc sống còn:
1️⃣ Tận dụng Prompt Caching ở tầng kiến trúc.
2️⃣ Áp dụng Semantic Caching để chặn các câu hỏi lặp lại.
3️⃣ Sử dụng mô hình nhỏ hơn (GPT-4o mini / Claude 3 Haiku) cho 80% tác vụ định tuyến.

Bạn đã triển khai giải pháp caching nào cho hệ thống AI của mình chưa? Hãy cùng thảo luận bên dưới! 👇`,
    };

    const outputText = simulatedOutputs[step.id] || `### Kết quả thực thi: ${step.title}\n\nĐã xử lý thành công bước phân tích theo vai trò **${step.role}** dựa trên dữ liệu đầu vào. Toàn bộ logic đã được xác thực và sẵn sàng cho các bước tiếp theo.`;

    setStepOutputs((prev) => ({ ...prev, [step.id]: outputText }));
    setCurrentStepIndex(index + 1);
    setIsRunning(false);
    toast.success(`Hoàn thành ${step.title}!`);
  };

  const handleRunAll = async () => {
    setIsRunning(true);
    for (let i = 0; i < selectedWorkflow.steps.length; i++) {
      await handleRunStep(i);
      await new Promise((r) => setTimeout(r, 400));
    }
    setIsRunning(false);
    toast.success('Đã hoàn thành toàn bộ Pipeline!');
  };

  const handleDownloadFullReport = () => {
    let report = `# BÁO CÁO PIPELINE: ${selectedWorkflow.name}\n\n**Chủ đề đầu vào**: ${inputText}\n**Ngày tạo**: ${new Date().toLocaleString('vi-VN')}\n\n---\n\n`;
    selectedWorkflow.steps.forEach((step, idx) => {
      report += `## ${step.title} (${step.role})\n\n${stepOutputs[step.id] || '_Chưa thực thi_'}\n\n---\n\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-${selectedWorkflow.id}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã xuất toàn bộ báo cáo Pipeline!');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs font-semibold mb-4">
          <Workflow className="h-4 w-4" />
          <span>Multi-Agent Workflow Pipelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Chuỗi Quy Trình AI Tự Động Hóa
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Biến các tác vụ phức tạp thành chuỗi các bước AI liên hoàn: dữ liệu đầu ra của bước trước tự động trở thành ngữ cảnh của bước tiếp theo.
        </p>
      </div>

      {/* Workflow Selector Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {PRESET_WORKFLOWS.map((wf) => {
          const IconComp = wf.icon;
          const isSelected = selectedWorkflow.id === wf.id;
          return (
            <button
              key={wf.id}
              onClick={() => handleSelectWorkflow(wf)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 shadow-md ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${wf.color}20`, color: wf.color }}
              >
                <IconComp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{wf.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{wf.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                <span>{wf.steps.length} bước liên hoàn</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Execution Area */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm mb-12">
        {/* Input Configuration */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Đầu vào bắt đầu Pipeline:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedWorkflow.inputPlaceholder}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button
              size="lg"
              disabled={isRunning || !inputText.trim()}
              onClick={handleRunAll}
              className="gap-2 shrink-0 bg-brand-600 hover:bg-brand-700 text-white"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Chạy toàn bộ Pipeline ({selectedWorkflow.steps.length} bước)</span>
            </Button>
          </div>
        </div>

        {/* Steps Pipeline Visualizer */}
        <div className="space-y-6">
          {selectedWorkflow.steps.map((step, idx) => {
            const hasOutput = Boolean(stepOutputs[step.id]);
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`rounded-2xl border transition-all ${
                  hasOutput
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isCurrent
                    ? 'border-brand-500 bg-white dark:bg-gray-900 shadow-sm'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 opacity-70'
                }`}
              >
                {/* Step Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        hasOutput
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                      }`}
                    >
                      {hasOutput ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {step.title}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {step.role}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={hasOutput ? 'outline' : 'primary'}
                      size="sm"
                      disabled={isRunning}
                      onClick={() => handleRunStep(idx)}
                      className="text-xs gap-1.5"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{hasOutput ? 'Chạy lại bước này' : 'Chạy bước này'}</span>
                    </Button>
                  </div>
                </div>

                {/* Step Output Box */}
                {hasOutput && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-emerald-100 dark:border-emerald-900/30">
                    <div className="rounded-xl bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed shadow-sm">
                      {stepOutputs[step.id]}
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(stepOutputs[step.id]);
                          toast.success('Đã copy kết quả bước này!');
                        }}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" /> Sao chép
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Export Footer */}
        {Object.keys(stepOutputs).length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-gray-500">
              Đã hoàn thành {Object.keys(stepOutputs).length} / {selectedWorkflow.steps.length} bước trong chuỗi.
            </span>
            <Button variant="outline" onClick={handleDownloadFullReport} className="gap-2 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span>Tải xuống toàn bộ báo cáo Pipeline (.md)</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
