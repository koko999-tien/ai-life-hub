'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  ShieldAlert,
  Sliders,
  Layers,
  Code2,
  FileText,
  Plus,
  Trash2,
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui';
import { DEFAULT_USD_TO_VND, formatVndRounded } from '@/lib/models/registry';

interface FewShotExample {
  user: string;
  assistant: string;
}

interface PromptPreset {
  id: string;
  name: string;
  role: string;
  objective: string;
  tone: string;
  format: string;
  constraints: string[];
  examples: FewShotExample[];
}

const PRESETS: PromptPreset[] = [
  {
    id: 'software-architect',
    name: 'Kiến trúc sư phần mềm cấp cao',
    role: 'Bạn là Kiến trúc sư phần mềm cấp cao với hơn 15 năm kinh nghiệm về hệ thống phân tán, TypeScript, Next.js và hạ tầng đám mây.',
    objective: 'Cung cấp giải pháp kỹ thuật tin cậy cao, tối ưu hiệu năng, bảo mật và khả năng mở rộng. Phân tích rõ sự đánh đổi giữa các phương án trước khi đề xuất.',
    tone: 'Chuyên nghiệp, tư duy kỹ thuật sâu, trung thực về ưu và nhược điểm, tránh dùng từ ngữ sáo rỗng.',
    format: 'Markdown có bố cục rõ ràng: Tóm tắt giải pháp, Kiến trúc đề xuất, Mã mẫu chuẩn TypeScript và Bảng so sánh ưu/nhược điểm.',
    constraints: [
      'Không bao giờ gợi ý mã giả tưởng hoặc bỏ qua bước kiểm tra và xử lý lỗi.',
      'Nếu thiếu thông tin về lượng truy cập thực tế, hãy hỏi làm rõ trước khi chốt kiến trúc.',
      'Ưu tiên giải pháp đơn giản, vừa đủ dùng nhất nhưng vẫn đáp ứng trọn vẹn yêu cầu.'
    ],
    examples: [
      {
        user: 'Tôi nên chọn Redis hay Kafka cho hàng đợi xử lý tác vụ?',
        assistant: 'Để chọn đúng giữa Redis và Kafka, cần cân nhắc 3 yếu tố: 1) Nhu cầu lưu trữ lâu dài, 2) Lưu lượng tin nhắn mỗi giây, và 3) Mô hình xử lý (hàng đợi tác vụ hay luồng sự kiện). Nếu chỉ cần hàng đợi tác vụ nhẹ và phản hồi dưới 1ms: Redis BullMQ là lựa chọn gọn nhẹ nhất. Nếu cần phát lại lịch sử sự kiện và hàng triệu tin nhắn/giây: hãy chọn Kafka.'
      }
    ]
  },
  {
    id: 'prompt-engineer',
    name: 'Chuyên gia tối ưu câu lệnh AI',
    role: 'Bạn là chuyên gia thiết kế và tối ưu câu lệnh hệ thống cho các mô hình AI lớn (Claude Sonnet 4.6, GPT-4.1, Gemini 2.5 Pro, DeepSeek).',
    objective: 'Chuyển đổi các yêu cầu thông thường thành bộ chỉ dẫn nền chất lượng cao, có thẻ cấu trúc rõ ràng, ví dụ minh họa và quy tắc chống sai lệch.',
    tone: 'Sắc sảo, chính xác, có hệ thống và minh bạch về lý do thiết kế.',
    format: 'Cấu trúc thẻ XML hoàn chỉnh (<context>, <role>, <instructions>, <constraints>, <output_format>).',
    constraints: [
      'Loại bỏ mọi cách diễn đạt mơ hồ như "làm tốt lên" hay "viết thật hay".',
      'Luôn bổ sung ví dụ mẫu minh họa cho các tình huống ngoại lệ dễ nhầm lẫn.',
      'Thêm quy tắc rõ ràng để ngăn AI tự suy diễn hoặc bịa đặt thông tin.'
    ],
    examples: [
      {
        user: 'Hãy viết một câu lệnh để tóm tắt bài báo y khoa.',
        assistant: '<role>Chuyên gia dịch tễ học và y khoa</role>\n<instructions>Trích xuất 3 thông tin chính: Mục tiêu nghiên cứu, Phương pháp thử nghiệm (cỡ mẫu, nhóm đối chứng), và Kết luận lâm sàng có ý nghĩa thống kê (p < 0.05).</instructions>'
      }
    ]
  },
  {
    id: 'technical-writer',
    name: 'Chuyên viên viết tài liệu kỹ thuật',
    role: 'Bạn là chuyên viên viết tài liệu kỹ thuật giàu kinh nghiệm, chuyên soạn hướng dẫn API, kiến trúc hệ thống và tài liệu cho lập trình viên.',
    objective: 'Biến các khái niệm kỹ thuật phức tạp thành hướng dẫn dễ hiểu, súc tích, có ví dụ chạy được ngay và nêu rõ bối cảnh áp dụng.',
    tone: 'Thân thiện với lập trình viên, rõ ràng, gãy gọn, không lan man.',
    format: 'Markdown tiêu chuẩn gồm: Bắt đầu nhanh, Điều kiện cần có, Hướng dẫn từng bước, Ví dụ mã nguồn và Các lỗi thường gặp.',
    constraints: [
      'Mọi đoạn mã mẫu phải chạy được thực tế và có chú thích ở các dòng quan trọng.',
      'Không dùng thuật ngữ nội bộ mà chưa kèm giải thích ngắn gọn.',
      'Luôn có mục hướng dẫn xử lý các sự cố phổ biến.'
    ],
    examples: [
      {
        user: 'Viết hướng dẫn cài đặt webhook.',
        assistant: '### Hướng dẫn tích hợp Webhook trong 3 bước\n\n**Điều kiện cần có:** Địa chỉ máy chủ HTTPS sẵn sàng nhận dữ liệu POST dạng JSON.\n\n1. **Xác thực chữ ký bảo mật:** Kiểm tra mã xác nhận trong tiêu đề `X-Signature-SHA256`...'
      }
    ]
  },
  {
    id: 'security-auditor',
    name: 'Chuyên gia bảo mật & kiểm tra mã nguồn',
    role: 'Bạn là chuyên gia an toàn thông tin chuyên rà soát lỗ hổng bảo mật cho ứng dụng web và hợp đồng thông minh.',
    objective: 'Phát hiện sớm các lỗ hổng bảo mật phổ biến (như 10 rủi ro bảo mật web phổ biến nhất — OWASP Top 10), đánh giá mức độ rủi ro và đề xuất đoạn mã vá lỗi cụ thể.',
    tone: 'Nghiêm cẩn, cảnh giác cao, phân loại rõ mức độ nghiêm trọng (Nghiêm trọng / Cao / Trung bình / Thấp) kèm minh chứng cụ thể.',
    format: 'Báo cáo chuẩn gồm: Mô tả lỗ hổng, Mức độ rủi ro, Kịch bản khai thác minh họa và Mã nguồn khắc phục.',
    constraints: [
      'Không bao giờ kết luận an toàn nếu chưa kiểm tra ranh giới dữ liệu đầu vào từ người dùng.',
      'Luôn ưu tiên nguyên tắc kiểm tra tin cậy ở mọi bước và cấp quyền tối thiểu cần thiết.',
      'Cảnh báo rõ các rủi ro chèn mã độc (Injection), giả mạo yêu cầu máy chủ (SSRF) và phân quyền lỏng lẻo.'
    ],
    examples: [
      {
        user: 'Hàm truy vấn SQL này có an toàn không: `SELECT * FROM users WHERE id = ` + req.query.id',
        assistant: '⚠️ **MỨC ĐỘ: NGHIÊM TRỌNG (Lỗ hổng SQL Injection)**\n\nĐoạn mã nối chuỗi trực tiếp từ `req.query.id` cho phép kẻ tấn công chèn lệnh SQL để vượt qua bước xác thực hoặc đọc toàn bộ dữ liệu.\n\n**Cách khắc phục:** Sử dụng truy vấn tham số hóa (Parameterized Query) ngay lập tức.'
      }
    ]
  }
];

export function SystemPromptBuilder() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('software-architect');
  const [role, setRole] = useState<string>(PRESETS[0].role);
  const [objective, setObjective] = useState<string>(PRESETS[0].objective);
  const [tone, setTone] = useState<string>(PRESETS[0].tone);
  const [format, setFormat] = useState<string>(PRESETS[0].format);
  const [constraints, setConstraints] = useState<string[]>(PRESETS[0].constraints);
  const [newConstraint, setNewConstraint] = useState<string>('');
  const [examples, setExamples] = useState<FewShotExample[]>(PRESETS[0].examples);
  const [newExampleUser, setNewExampleUser] = useState<string>('');
  const [newExampleAssistant, setNewExampleAssistant] = useState<string>('');
  const [useXmlTags, setUseXmlTags] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = PRESETS.find(item => item.id === presetId);
    if (p) {
      setRole(p.role);
      setObjective(p.objective);
      setTone(p.tone);
      setFormat(p.format);
      setConstraints(p.constraints);
      setExamples(p.examples);
    }
  };

  const handleAddConstraint = () => {
    if (!newConstraint.trim()) return;
    setConstraints(prev => [...prev, newConstraint.trim()]);
    setNewConstraint('');
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddExample = () => {
    if (!newExampleUser.trim() || !newExampleAssistant.trim()) return;
    setExamples(prev => [...prev, { user: newExampleUser.trim(), assistant: newExampleAssistant.trim() }]);
    setNewExampleUser('');
    setNewExampleAssistant('');
  };

  const handleRemoveExample = (index: number) => {
    setExamples(prev => prev.filter((_, i) => i !== index));
  };

  const compiledPrompt = useMemo(() => {
    if (useXmlTags) {
      let prompt = `<identity>\n${role.trim()}\n</identity>\n\n`;
      prompt += `<purpose_and_context>\n${objective.trim()}\n</purpose_and_context>\n\n`;
      prompt += `<tone_and_style>\n${tone.trim()}\n</tone_and_style>\n\n`;
      
      if (constraints.length > 0) {
        prompt += `<strict_constraints>\n${constraints.map(c => `- ${c}`).join('\n')}\n</strict_constraints>\n\n`;
      }

      prompt += `<response_format>\n${format.trim()}\n</response_format>`;

      if (examples.length > 0) {
        prompt += `\n\n<examples>\n`;
        examples.forEach((ex, idx) => {
          prompt += `<example_${idx + 1}>\n<input>${ex.user}</input>\n<ideal_response>${ex.assistant}</ideal_response>\n</example_${idx + 1}>\n`;
        });
        prompt += `</examples>`;
      }

      return prompt;
    } else {
      let prompt = `# VAI TRÒ & DANH TÍNH\n${role.trim()}\n\n`;
      prompt += `# MỤC TIÊU & BỐI CẢNH\n${objective.trim()}\n\n`;
      prompt += `# PHONG CÁCH & GIỌNG VĂN\n${tone.trim()}\n\n`;

      if (constraints.length > 0) {
        prompt += `# RÀNG BUỘC NGHIÊM NGẶT\n${constraints.map(c => `- ${c}`).join('\n')}\n\n`;
      }

      prompt += `# ĐỊNH DẠNG ĐẦU RA\n${format.trim()}`;

      if (examples.length > 0) {
        prompt += `\n\n# VÍ DỤ MẪU\n`;
        examples.forEach((ex, idx) => {
          prompt += `### Ví dụ ${idx + 1}:\n**Đầu vào:** ${ex.user}\n**Phản hồi mẫu:** ${ex.assistant}\n\n`;
        });
      }

      return prompt;
    }
  }, [role, objective, tone, format, constraints, examples, useXmlTags]);

  const estimatedTokens = useMemo(() => {
    return Math.ceil(compiledPrompt.length / 3.8);
  }, [compiledPrompt]);

  const liveCostEstimate = useMemo(() => {
    // Standard baseline at $2.50 / 1M input tokens (OpenAI GPT-4o reference)
    const costPer1kCalls = (estimatedTokens / 1_000_000) * 2.5 * 1000;
    return {
      usd: costPer1kCalls.toFixed(3),
      vndDisplay: formatVndRounded(costPer1kCalls, DEFAULT_USD_TO_VND),
    };
  }, [estimatedTokens]);

  // Keyboard navigation for presets (keys 1 - 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (PRESETS[index]) {
          handleSelectPreset(PRESETS[index].id);
          toast.success(`Đã chuyển bản mẫu: ${PRESETS[index].name}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    toast.success('Đã sao chép chỉ dẫn hệ thống vào bộ nhớ tạm!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([compiledPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-prompt-${selectedPresetId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống tệp system-prompt-' + selectedPresetId + '.md');
  };

  return (
    <div className="space-y-8">
      {/* Preset Selector */}
      <div className="card p-6 bg-bg-surface border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            Chọn bản mẫu cấu hình sẵn
          </h2>
          <span className="text-xs text-text-muted hidden sm:inline-flex items-center gap-1.5">
            Bấm phím tắt <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border text-[10px] font-mono">1</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border text-[10px] font-mono">4</kbd> để đổi nhanh
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={selectedPresetId === p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`group text-left p-3.5 rounded-xl border text-sm font-medium transition-all relative ${
                selectedPresetId === p.id
                  ? 'border-accent bg-accent/10 text-accent font-semibold shadow-[0_0_15px_rgba(249,115,22,0.18)] ring-1 ring-accent/50'
                  : 'border-border bg-bg hover:border-accent/40 text-text-muted hover:text-text'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 truncate">
                  <Sparkles className="w-4 h-4 shrink-0 text-accent" />
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg border border-border text-text-muted group-hover:border-accent/40 group-hover:text-accent">
                  {idx + 1}
                </span>
              </div>
              <p className="text-xs text-text-muted line-clamp-1">{p.objective}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Configurations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity & Role */}
          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="sp-role" className="text-sm font-semibold text-text flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                1. Vai trò & Danh tính
              </label>
              <span className="text-xs text-text-muted">Ai đang trả lời?</span>
            </div>
            <textarea
              id="sp-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent resize-y"
              placeholder="Ví dụ: Bạn là Kiến trúc sư phần mềm cấp cao..."
            />
          </div>

          {/* Objective & Purpose */}
          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="sp-objective" className="text-sm font-semibold text-text flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                2. Mục tiêu & Bối cảnh cốt lõi
              </label>
              <span className="text-xs text-text-muted">Mục đích chính</span>
            </div>
            <textarea
              id="sp-objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent resize-y"
              placeholder="Mô tả nhiệm vụ cụ thể mà AI phải hoàn thành..."
            />
          </div>

          {/* Tone & Style */}
          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="sp-tone" className="text-sm font-semibold text-text flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                3. Phong cách & Giọng văn
              </label>
              <span className="text-xs text-text-muted">Thái độ phản hồi</span>
            </div>
            <input
              id="sp-tone"
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent"
              placeholder="Chuyên nghiệp, ngắn gọn, phân tích sâu..."
            />
          </div>

          {/* Constraints & Guardrails */}
          <div className="card p-6 bg-bg-surface border-border space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="sp-constraint-input" className="text-sm font-semibold text-text flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                4. Ràng buộc nghiêm ngặt (Chống bịa đặt)
              </label>
              <span className="text-xs text-text-muted">Ngăn chặn sai lệch & lỗi</span>
            </div>
            <div className="space-y-2">
              {constraints.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-bg border border-border text-sm">
                  <span className="text-accent font-semibold text-xs">#{idx + 1}</span>
                  <span className="flex-1 text-text">{c}</span>
                  <button
                    type="button"
                    aria-label="Xóa ràng buộc"
                    onClick={() => handleRemoveConstraint(idx)}
                    className="p-1 text-text-muted hover:text-red-500 transition-colors"
                    title="Xóa ràng buộc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="sp-constraint-input"
                type="text"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddConstraint()}
                placeholder="Thêm ràng buộc mới (ví dụ: Không bao giờ bịa đặt số liệu)..."
                className="flex-1 p-2.5 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-4 py-2.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white font-medium text-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm
              </button>
            </div>
          </div>

          {/* Response Format */}
          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="sp-format" className="text-sm font-semibold text-text flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                5. Định dạng đầu ra mong muốn
              </label>
              <span className="text-xs text-text-muted">Cấu trúc kết quả</span>
            </div>
            <textarea
              id="sp-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-hidden focus:ring-1 focus:ring-accent resize-y"
              placeholder="Định dạng Markdown với tiêu đề rõ ràng, hoặc JSON..."
            />
          </div>

          {/* Examples */}
          <div className="card p-6 bg-bg-surface border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                6. Ví dụ mẫu minh họa
              </h3>
              <span className="text-xs text-text-muted">Tăng độ chính xác đáng kể</span>
            </div>

            {examples.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-bg border border-border space-y-2 text-sm relative">
                <div className="flex justify-between items-center text-xs text-text-muted">
                  <span className="font-semibold text-accent">Ví dụ #{idx + 1}</span>
                  <button
                    type="button"
                    aria-label="Xóa ví dụ"
                    onClick={() => handleRemoveExample(idx)}
                    className="text-text-muted hover:text-red-500 p-1"
                    title="Xóa ví dụ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <span className="text-xs font-medium text-text-muted">Đầu vào người dùng:</span>
                  <p className="text-text mt-0.5">{ex.user}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-text-muted">AI phản hồi mẫu:</span>
                  <p className="text-text mt-0.5 whitespace-pre-line">{ex.assistant}</p>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-lg bg-bg border border-border/80 space-y-3">
              <span className="text-xs font-semibold text-text uppercase block">Bổ sung ví dụ mới</span>
              <div>
                <label htmlFor="sp-example-user" className="block text-xs text-text-muted mb-1">
                  Câu hỏi mẫu của người dùng
                </label>
                <input
                  id="sp-example-user"
                  type="text"
                  value={newExampleUser}
                  onChange={(e) => setNewExampleUser(e.target.value)}
                  placeholder="Câu hỏi / Yêu cầu mẫu của người dùng..."
                  className="w-full p-2.5 rounded-lg bg-bg-surface border border-border text-text text-sm focus:border-accent focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor="sp-example-assistant" className="block text-xs text-text-muted mb-1">
                  Câu trả lời mẫu lý tưởng
                </label>
                <textarea
                  id="sp-example-assistant"
                  value={newExampleAssistant}
                  onChange={(e) => setNewExampleAssistant(e.target.value)}
                  rows={2}
                  placeholder="Câu trả lời mẫu lý tưởng mà AI cần học theo..."
                  className="w-full p-2.5 rounded-lg bg-bg-surface border border-border text-text text-sm focus:border-accent focus:outline-hidden resize-y"
                />
              </div>
              <button
                type="button"
                onClick={handleAddExample}
                disabled={!newExampleUser.trim() || !newExampleAssistant.trim()}
                className="w-full py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Lưu ví dụ mẫu
              </button>
            </div>
          </div>
        </div>

        {/* Right Output: Live Preview & Exports */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="card p-6 bg-bg-surface border-border space-y-4 shadow-xl">
            {/* Header with Title and Mode Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-border gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm">
                    Xem Trước Câu Lệnh
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-text-muted">
                    <span className="inline-flex items-center gap-1 font-mono text-accent">
                      <Cpu className="w-3 h-3" /> ~{estimatedTokens} đơn vị chữ (token)
                    </span>
                    <span>•</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      ~${liveCostEstimate.usd} (~{liveCostEstimate.vndDisplay}) / 1.000 lượt
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-pressed={useXmlTags}
                  onClick={() => setUseXmlTags(!useXmlTags)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    useXmlTags
                      ? 'bg-accent/15 border-accent text-accent shadow-sm'
                      : 'bg-bg border-border text-text-muted hover:text-text'
                  }`}
                  title="Chuyển đổi giữa cấu trúc thẻ XML và Markdown tiêu chuẩn"
                >
                  {useXmlTags ? 'Thẻ XML (Khuyên dùng)' : 'Markdown'}
                </button>
              </div>
            </div>

            {/* IDE-style Code Box Container */}
            <div className="rounded-xl border border-border/80 overflow-hidden bg-[#05070f] shadow-inner">
              {/* Window Header Bar */}
              <div className="px-4 py-2.5 bg-[#090d1a] border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    {useXmlTags ? 'system-prompt.xml' : 'system-prompt.md'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/10 border border-accent/20 text-accent">
                    {useXmlTags ? 'Cấu trúc XML' : 'Markdown'}
                  </span>
                </div>
              </div>

              {/* Code Pre Box */}
              <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[480px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-all text-emerald-300/90 selection:bg-accent/30 selection:text-white">
                {compiledPrompt}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-accent text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent-hover shadow-md transition-all active:scale-[0.98]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Đã sao chép!' : 'Sao chép câu lệnh'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-4 rounded-xl border border-border bg-bg hover:bg-hover text-text font-medium text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-text-muted" />
                Tải tệp .md
              </button>
            </div>

            {/* Action Links to AI Workspace & Playground */}
            <div className="space-y-2">
              <Link
                href="/workspace"
                className="w-full py-3 px-4 rounded-xl bg-accent/15 border border-accent/40 hover:bg-accent/20 text-accent font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                Thực thi thật trong AI Workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/playground"
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-bg hover:border-accent/30 text-text-muted hover:text-text font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                Hoặc xem minh họa giao diện tại Khu Thử Nghiệm
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
