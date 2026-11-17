'use client';

import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Layers, 
  Code2, 
  FileText, 
  Plus, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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
    name: 'Kiến trúc sư phần mềm cấp cao (Senior Architect)',
    role: 'Bạn là Senior Software Architect với hơn 15 năm kinh nghiệm về hệ thống phân tán, TypeScript, Next.js, Cloud Native và Clean Architecture.',
    objective: 'Cung cấp giải pháp kỹ thuật có độ tin cậy cao, tối ưu hiệu năng, bảo mật và khả năng mở rộng (scalability). Phân tích trade-off trước khi đề xuất giải pháp.',
    tone: 'Chuyên nghiệp, tư duy kỹ thuật sâu sắc, trung thực về ưu/nhược điểm (trade-offs), tránh buzzword sáo rỗng.',
    format: 'Markdown có cấu trúc rõ ràng: Tóm tắt giải pháp, Kiến trúc đề xuất (mermaid nếu cần), Code mẫu chuẩn TypeScript, và Bảng đánh giá Trade-offs.',
    constraints: [
      'Không bao giờ gợi ý code giả tưởng hoặc thiếu kiểm tra lỗi (error handling).',
      'Nếu thiếu thông tin về tải (traffic/concurrency), hãy hỏi làm rõ trước khi quyết định kiến trúc.',
      'Ưu tiên giải pháp đơn giản nhất đáp ứng yêu cầu (KISS & YAGNI).'
    ],
    examples: [
      {
        user: 'Tôi nên chọn Redis hay Kafka cho message queue?',
        assistant: 'Để chọn đúng giữa Redis và Kafka, cần phân tích 3 yếu tố cốt lõi: 1) Lưu trữ bền vững (Persistence), 2) Throughput yêu cầu, và 3) Kiểu tiêu thụ (Pub/Sub vs Log streaming). Nếu chỉ cần job queue nhẹ và độ trễ dưới 1ms: Redis BullMQ là tối ưu. Nếu cần replay event stream và hàng triệu tin nhắn/giây: Kafka là lựa chọn bắt buộc.'
      }
    ]
  },
  {
    id: 'prompt-engineer',
    name: 'Chuyên gia Tối ưu Prompt (Prompt Engineer)',
    role: 'Bạn là Master Prompt Engineer chuyên thiết kế và tối ưu hóa câu lệnh cho các mô hình ngôn ngữ lớn (Claude 3.5, GPT-4o, DeepSeek).',
    objective: 'Tái cấu trúc các yêu cầu tự nhiên thành Meta-Prompts chất lượng cao theo chuẩn kỹ thuật (CoT, XML Tags, Few-Shot, Guardrails).',
    tone: 'Sắc sảo, chính xác, có hệ thống và minh bạch về phương pháp.',
    format: 'Cấu trúc XML Tags hoàn chỉnh (<context>, <role>, <instructions>, <constraints>, <output_format>).',
    constraints: [
      'Loại bỏ mọi từ ngữ mơ hồ như "làm tốt", "viết hay".',
      'Luôn bổ sung ví dụ Few-Shot đại diện cho trường hợp biên (edge cases).',
      'Thêm cơ chế kiểm soát hallucination rõ ràng.'
    ],
    examples: [
      {
        user: 'Hãy viết một prompt để tóm tắt bài báo y khoa.',
        assistant: '<role>Chuyên gia dịch tễ học và y khoa</role>\n<instructions>Trích xuất 3 thông tin: Mục tiêu nghiên cứu, Phương pháp thử nghiệm (cỡ mẫu, đối chứng), và Kết luận lâm sàng có ý nghĩa thống kê (p < 0.05).</instructions>'
      }
    ]
  },
  {
    id: 'technical-writer',
    name: 'Chuyên viên Viết tài liệu Kỹ thuật (Technical Writer)',
    role: 'Bạn là Lead Technical Writer chuyên viết tài liệu API, hướng dẫn kiến trúc và Developer Documentation chuẩn quốc tế.',
    objective: 'Biến các khái niệm kỹ thuật phức tạp thành tài liệu dễ hiểu, súc tích, có ví dụ thực tế và giải thích rõ ngữ cảnh sử dụng.',
    tone: 'Thân thiện với lập trình viên, rõ ràng, gãy gọn, không lan man.',
    format: 'Markdown chuẩn: Quickstart, Prerequisites, Step-by-Step Guide, Code Samples, và Common Pitfalls.',
    constraints: [
      'Mọi đoạn code phải chạy được thực tế và có chú thích giải thích dòng quan trọng.',
      'Không dùng thuật ngữ nội bộ mà không có định nghĩa hoặc liên kết giải thích.',
      'Luôn có phần xử lý lỗi thường gặp (Troubleshooting).'
    ],
    examples: [
      {
        user: 'Viết hướng dẫn cài đặt webhook.',
        assistant: '### Hướng dẫn tích hợp Webhook trong 3 bước\n\n**Điều kiện tiên quyết:** Endpoint HTTPS sẵn sàng nhận POST request payload JSON.\n\n1. **Xác thực chữ ký:** Kiểm tra header `X-Signature-SHA256`...'
      }
    ]
  },
  {
    id: 'security-auditor',
    name: 'Chuyên gia Bảo mật & Đánh giá Mã nguồn (Security Auditor)',
    role: 'Bạn là chuyên gia an toàn thông tin (AppSec Specialist) với chứng chỉ OSCP và CISSP, chuyên audit smart contract và ứng dụng web.',
    objective: 'Rà soát lỗ hổng bảo mật (OWASP Top 10, CWE), phân tích rủi ro và đưa ra bản vá remediation cụ thể.',
    tone: 'Nghiêm cẩn, cảnh giác cao, nhấn mạnh vào mức độ nghiêm trọng (Severity: Critical/High/Medium/Low) và bằng chứng PoC.',
    format: 'Báo cáo chuẩn: Mô tả lỗ hổng, Mức độ CVSS, Bằng chứng khai thác (PoC), và Đoạn code vá (Remediation).',
    constraints: [
      'Không bao giờ xác nhận an toàn nếu chưa kiểm tra ranh giới dữ liệu đầu vào (Input Boundary).',
      'Đề xuất nguyên tắc Zero-Trust và Least Privilege trong mọi trường hợp.',
      'Cảnh báo rõ các rủi ro liên quan đến injection, SSRF, và broken access control.'
    ],
    examples: [
      {
        user: 'Hàm query SQL này có an toàn không: `SELECT * FROM users WHERE id = ` + req.query.id',
        assistant: '⚠️ **MỨC ĐỘ: CRITICAL (SQL Injection)**\n\nĐoạn code nối chuỗi trực tiếp từ `req.query.id` dẫn đến lỗ hổng SQL Injection kinh điển. Kẻ tấn công có thể bypass xác thực hoặc dump toàn bộ database.\n\n**Cách khắc phục:** Sử dụng Parameterized Query / Prepared Statement ngay lập tức.'
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
        prompt += `\n\n# VÍ DỤ MẪU (FEW-SHOT)\n`;
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

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
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
  };

  return (
    <div className="space-y-8">
      {/* Preset Selector */}
      <div className="card p-6 bg-bg-surface border-border">
        <label className="text-sm font-semibold text-text uppercase tracking-wider block mb-3">
          Chọn bản mẫu (Presets cấu hình sẵn)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                selectedPresetId === p.id
                  ? 'border-accent bg-accent/10 text-accent font-semibold shadow-sm'
                  : 'border-border bg-bg hover:border-accent/40 text-text-muted hover:text-text'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 shrink-0 text-accent" />
                <span className="truncate">{p.name.split('(')[0]}</span>
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
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                1. Vai trò & Danh tính (Identity / Persona)
              </label>
              <span className="text-xs text-text-muted">Ai đang trả lời?</span>
            </div>
            <textarea
              value={role}
              onChange={(e) => setRole(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
              placeholder="Ví dụ: Bạn là Senior Solution Architect..."
            />
          </div>

          {/* Objective & Purpose */}
          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                2. Mục tiêu & Bối cảnh cốt lõi (Mission & Scope)
              </label>
              <span className="text-xs text-text-muted">Mục đích chính</span>
            </div>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
              placeholder="Mô tả nhiệm vụ cụ thể mà AI phải hoàn thành..."
            />
          </div>

          {/* Tone & Style */}
          <div className="card p-6 bg-bg-surface border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                3. Phong cách & Giọng văn (Tone & Style)
              </label>
              <span className="text-xs text-text-muted">Thái độ phản hồi</span>
            </div>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Chuyên nghiệp, ngắn gọn, phân tích sâu..."
            />
          </div>

          {/* Constraints & Guardrails */}
          <div className="card p-6 bg-bg-surface border-border space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                4. Ràng buộc nghiêm ngặt (Negative Constraints / Guardrails)
              </label>
              <span className="text-xs text-text-muted">Ngăn chặn ảo giác & lỗi</span>
            </div>
            <div className="space-y-2">
              {constraints.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-bg border border-border text-sm">
                  <span className="text-accent font-semibold text-xs">#{idx + 1}</span>
                  <span className="flex-1 text-text">{c}</span>
                  <button
                    onClick={() => handleRemoveConstraint(idx)}
                    className="p-1 text-text-muted hover:text-red-400 transition-colors"
                    title="Xóa ràng buộc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddConstraint()}
                placeholder="Thêm ràng buộc mới (ví dụ: Không bao giờ bịa đặt số liệu)..."
                className="flex-1 p-2.5 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
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
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                5. Định dạng đầu ra mong muốn (Output Format)
              </label>
              <span className="text-xs text-text-muted">Cấu trúc kết quả</span>
            </div>
            <textarea
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-lg bg-bg border border-border text-text text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
              placeholder="Định dạng Markdown với tiêu đề rõ ràng, hoặc JSON..."
            />
          </div>

          {/* Few-Shot Examples */}
          <div className="card p-6 bg-bg-surface border-border space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                6. Ví dụ mẫu Few-Shot (Examples)
              </label>
              <span className="text-xs text-text-muted">Tăng độ chính xác lên 40%</span>
            </div>

            {examples.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-bg border border-border space-y-2 text-sm relative">
                <div className="flex justify-between items-center text-xs text-text-muted">
                  <span className="font-semibold text-accent">Ví dụ #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveExample(idx)}
                    className="text-text-muted hover:text-red-400 p-1"
                    title="Xóa ví dụ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <span className="text-xs font-medium text-text-muted">Input người dùng:</span>
                  <p className="text-text mt-0.5">{ex.user}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-text-muted">AI phản hồi mẫu:</span>
                  <p className="text-text mt-0.5 whitespace-pre-line">{ex.assistant}</p>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-lg bg-bg border border-border/80 space-y-3">
              <span className="text-xs font-semibold text-text uppercase">Bổ sung ví dụ mới</span>
              <input
                type="text"
                value={newExampleUser}
                onChange={(e) => setNewExampleUser(e.target.value)}
                placeholder="Câu hỏi / Lệnh của người dùng mẫu..."
                className="w-full p-2.5 rounded-lg bg-bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
              />
              <textarea
                value={newExampleAssistant}
                onChange={(e) => setNewExampleAssistant(e.target.value)}
                rows={2}
                placeholder="Câu trả lời mẫu lý tưởng mà AI cần học theo..."
                className="w-full p-2.5 rounded-lg bg-bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none resize-y"
              />
              <button
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
          <div className="card p-6 bg-bg-surface border-border space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-text flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Live System Prompt
                </h3>
                <span className="text-xs text-text-muted">
                  Ước tính: ~{estimatedTokens} tokens • Chuẩn Claude / GPT / DeepSeek
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseXmlTags(!useXmlTags)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    useXmlTags 
                      ? 'bg-accent/15 border-accent text-accent' 
                      : 'bg-bg border-border text-text-muted hover:text-text'
                  }`}
                  title="Chuyển đổi giữa cấu trúc XML Tags và Markdown tiêu chuẩn"
                >
                  {useXmlTags ? 'XML Tags' : 'Markdown'}
                </button>
              </div>
            </div>

            {/* Code Output Box */}
            <div className="relative">
              <pre className="p-4 rounded-xl bg-bg border border-border text-xs text-text font-mono overflow-x-auto max-h-[520px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {compiledPrompt}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-accent text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent-hover shadow-md transition-all active:scale-[0.98]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Đã sao chép!' : 'Sao chép Prompt'}
              </button>

              <button
                onClick={handleDownload}
                className="py-2.5 px-4 rounded-xl border border-border bg-bg hover:bg-hover text-text font-medium text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-text-muted" />
                Tải file .md
              </button>
            </div>

            {/* Link to Playground */}
            <Link
              href="/playground"
              className="w-full py-3 px-4 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              Mở trong AI Playground để thử nghiệm trực tiếp
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
