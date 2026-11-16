'use client';

import { useState } from 'react';
import {
  Wand2,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Bot,
  ShieldCheck,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

interface FrameworkOption {
  id: string;
  name: string;
  badge: string;
  description: string;
}

const FRAMEWORKS: FrameworkOption[] = [
  {
    id: 'cot',
    name: 'Chain-of-Thought (CoT)',
    badge: 'Độ chính xác cao',
    description: 'Thêm vai trò chuyên gia, ép buộc suy luận từng bước trước khi đưa ra kết luận.',
  },
  {
    id: 'create',
    name: 'CREATE Framework',
    badge: 'Toàn diện nhất',
    description: 'Context, Role, Explicit instructions, Avoid, Tone, Examples.',
  },
  {
    id: 'guardrails',
    name: 'Production Guardrails',
    badge: 'Chống Hallucination',
    description: 'Thiết lập các ranh giới cấm kỵ nghiêm ngặt và định dạng đầu ra có cấu trúc.',
  },
  {
    id: 'few-shot',
    name: 'Few-Shot Learning',
    badge: 'Chuẩn format',
    description: 'Bổ sung các cặp mẫu Input -> Output minh họa cụ thể cho mô hình học tập.',
  },
];

const PRESETS_RAW = [
  { label: 'Viết bài review công nghệ', text: 'Viết bài review về điện thoại mới ra mắt' },
  { label: 'Debug mã nguồn', text: 'Tìm lỗi trong đoạn code này giúp tôi và sửa nó' },
  { label: 'Kế hoạch học tập', text: 'Lập kế hoạch tự học lập trình AI trong 3 tháng' },
  { label: 'Viết email đàm phán lương', text: 'Viết email xin tăng lương gửi cho sếp' },
];

export function PromptOptimizer() {
  const [rawPrompt, setRawPrompt] = useState<string>(PRESETS_RAW[0].text);
  const [selectedFramework, setSelectedFramework] = useState<string>('create');
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleOptimize = async () => {
    if (!rawPrompt.trim()) {
      toast.error('Vui lòng nhập prompt cần tối ưu!');
      return;
    }

    setIsOptimizing(true);
    setOptimizedPrompt('');
    setImprovements([]);

    await new Promise((r) => setTimeout(r, 600));

    let enhanced = '';
    let notes: string[] = [];

    if (selectedFramework === 'cot') {
      enhanced = `### BỐI CẢNH & VAI TRÒ
Bạn là một chuyên gia hàng đầu trong lĩnh vực này với hơn 10 năm kinh nghiệm thực chiến.

### NHIỆM VỤ
${rawPrompt}

### QUY TRÌNH SUY LUẬN TỪNG BƯỚC (Chain-of-Thought)
Trước khi đưa ra câu trả lời cuối cùng, bạn BẮT BUỘC phải thực hiện các bước sau:
1. **Bước 1 (Phân tích bối cảnh & đối tượng)**: Xác định rõ mục tiêu cốt lõi và đối tượng tiếp nhận.
2. **Bước 2 (Bóc tách tiêu chí)**: Liệt kê các tiêu chí đánh giá khách quan và các trường hợp ngoại lệ.
3. **Bước 3 (Thực thi chi tiết)**: Trình bày nội dung có cấu trúc, luận điểm đi kèm dẫn chứng thực tế.
4. **Bước 4 (Phản biện & Tối ưu)**: Rà soát lại tính logic và loại bỏ các thông tin mơ hồ hoặc thiếu căn cứ.

### ĐỊNH DẠNG ĐẦU RA
Trình bày bằng Markdown chuyên nghiệp, có bullet points, bảng biểu so sánh (nếu phù hợp) và tóm tắt hành động cụ thể.`;
      notes = [
        'Định hình danh tính chuyên gia chuyên sâu',
        'Kích hoạt cơ chế suy luận 4 bước Chain-of-Thought',
        'Yêu cầu phản biện và rà soát lỗi logic trước khi kết luận',
      ];
    } else if (selectedFramework === 'create') {
      enhanced = `### CONTEXT (Bối cảnh)
Tôi đang cần thực hiện nhiệm vụ: "${rawPrompt}". Yêu cầu chất lượng cao, có thể ứng dụng vào công việc ngay lập tức.

### ROLE (Vai trò)
Đóng vai một chuyên gia tư vấn cao cấp, phong cách sắc bén, tư duy logic và thực dụng.

### EXPLICIT INSTRUCTIONS (Chỉ dẫn cụ thể)
- Phân tích cặn kẽ các khía cạnh chính.
- Đưa ra giải pháp kèm lộ trình hành động chi tiết từng bước.
- Sử dụng các ví dụ minh họa thực tế dễ hiểu.

### AVOID (Điều cần tránh - Negative Constraints)
- TUYỆT ĐỐI KHÔNG dùng sáo rỗng, lời mở đầu dài dòng hay văn phong lý thuyết chung chung.
- Không đưa ra số liệu giả mạo; nếu không chắc chắn, hãy ghi chú rõ ràng.

### TONE (Giọng văn)
Chuyên nghiệp, truyền cảm hứng, ngắn gọn, súc tích và có tính định hướng hành động cao.

### EXAMPLES (Cấu trúc mẫu)
- Vấn đề cốt lõi: ...
- Phương án giải quyết: [1], [2], [3]
- Kế hoạch thực hiện: ...`;
      notes = [
        'Áp dụng đầy đủ 6 thành tố CREATE chuẩn mực',
        'Bổ sung ràng buộc phủ định (Negative Constraints) chống sáo rỗng',
        'Quy định giọng văn và cấu trúc đầu ra rõ ràng',
      ];
    } else if (selectedFramework === 'guardrails') {
      enhanced = `[SYSTEM INSTRUCTION: STRICT PRODUCTION GUARDRAILS]
Bạn là một AI an toàn, chính xác và có trách nhiệm cao.

Nhiệm vụ:
"""
${rawPrompt}
"""

CÁC NGUYÊN TẮC BẢO VỆ BẮT BUỘC (CRITICAL GUARDRAILS):
1. **Factuality Constraint**: Chỉ khẳng định những điều có căn cứ xác thực. Nếu thông tin không thể kiểm chứng, phải tuyên bố "Chưa có đủ dữ liệu xác thực".
2. **Format Adherence**: Không xuất các câu chào xã giao ("Chào bạn", "Tôi hy vọng điều này giúp ích"). Đi thẳng vào nội dung chính.
3. **Structured Response**:
   - Tóm tắt điều hành (Executive Summary): Tối đa 3 câu.
   - Nội dung chi tiết: Đánh số thứ tự rõ ràng.
   - Rủi ro tiềm ẩn & Giải pháp phòng ngừa.
4. **Language**: Tiếng Việt chuẩn mực, thuật ngữ kỹ thuật giữ nguyên tiếng Anh nếu cần thiết.`;
      notes = [
        'Thêm Guardrails phòng chống bịa đặt (Hallucination)',
        'Cắt bỏ lời chào vô bổ, tiết kiệm token',
        'Bổ sung phần cảnh báo rủi ro tiềm ẩn',
      ];
    } else {
      enhanced = `### VAI TRÒ & YÊU CẦU
Bạn là trợ lý AI chuyên nghiệp. Hãy xử lý yêu cầu sau theo đúng mẫu ví dụ được cung cấp:
Yêu cầu: ${rawPrompt}

### VÍ DỤ MINH HỌA (FEW-SHOT EXAMPLES)

**Ví dụ 1:**
- Đầu vào: Viết thông báo bảo trì hệ thống
- Đầu ra:
  📢 **THÔNG BÁO BẢO TRÌ HỆ THỐNG**
  - Thời gian: 00:00 - 02:00 ngày 20/11/2026
  - Ảnh hưởng: Tạm ngắt kết nối dịch vụ thanh toán
  - Hỗ trợ khẩn cấp: support@ailifehub.dev

**Ví dụ 2:**
- Đầu vào: [Nhiệm vụ của bạn: ${rawPrompt}]
- Đầu ra mong đợi: [Áp dụng cấu trúc tương tự, chuẩn xác, đầy đủ thông số]`;
      notes = [
        'Cung cấp mẫu Input-Output cụ thể (Few-shot)',
        'Giúp mô hình hiểu chính xác cấu trúc mong muốn mà không cần giải thích dài',
      ];
    }

    setOptimizedPrompt(enhanced);
    setImprovements(notes);
    setIsOptimizing(false);
    toast.success('Đã tối ưu hóa prompt thành công!');
  };

  const handleCopy = () => {
    if (!optimizedPrompt) return;
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    toast.success('Đã sao chép prompt tối ưu!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs font-semibold mb-3 border border-brand-200 dark:border-brand-800">
          <Wand2 className="h-4 w-4" />
          <span>Prompt Engineering Transformer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Bộ Tối Ưu Hóa Prompt Chuyên Sâu
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Chuyển hóa các câu lệnh thô sơ, ngắn ngủi thành prompt chuyên gia chuẩn production giúp LLM phản hồi sắc bén và chính xác gấp 10 lần.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="text-xs text-gray-400 font-medium">Thử nhanh câu lệnh mẫu:</span>
        {PRESETS_RAW.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setRawPrompt(p.text)}
            className="px-3 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Framework Chooser */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {FRAMEWORKS.map((fw) => (
          <button
            key={fw.id}
            type="button"
            onClick={() => setSelectedFramework(fw.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedFramework === fw.id
                ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 shadow-sm ring-2 ring-brand-500/20'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-gray-900 dark:text-white">{fw.name}</span>
            </div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mb-2">
              {fw.badge}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{fw.description}</p>
          </button>
        ))}
      </div>

      {/* Main Transformer Section */}
      <div className="grid gap-6 lg:grid-cols-2 items-start mb-10">
        {/* Raw Prompt Input */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Prompt Ban Đầu (Thô)
            </label>
            <button
              onClick={() => setRawPrompt('')}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Xóa
            </button>
          </div>
          <textarea
            rows={8}
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="Nhập câu lệnh bạn thường dùng, ví dụ: 'viết bài đăng bán khóa học AI'..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
          />

          <div className="mt-4">
            <Button
              size="lg"
              disabled={isOptimizing || !rawPrompt.trim()}
              onClick={handleOptimize}
              className="w-full gap-2 bg-brand-600 hover:bg-brand-700 text-white"
            >
              <Wand2 className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Đang phân tích và tối ưu hóa...' : 'Nâng cấp Prompt Ngay'}</span>
            </Button>
          </div>
        </div>

        {/* Optimized Prompt Output */}
        <div className="rounded-3xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/10 dark:bg-brand-950/10 p-6 shadow-sm min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                  Prompt Tối Ưu Chuẩn Production
                </span>
              </div>
              {optimizedPrompt && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-brand-500 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Copy'}</span>
                </button>
              )}
            </div>

            {optimizedPrompt ? (
              <>
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed shadow-inner">
                  {optimizedPrompt}
                </div>

                {improvements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-brand-100 dark:border-brand-900/40">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Những điểm đã được tối ưu:
                    </p>
                    <ul className="space-y-1.5">
                      {improvements.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center text-gray-400 text-xs">
                <Wand2 className="h-8 w-8 mx-auto mb-2 opacity-40 text-brand-500" />
                <p>Nhập prompt ở bên trái và bấm &quot;Nâng cấp Prompt Ngay&quot; để tạo phiên bản chuẩn production.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
