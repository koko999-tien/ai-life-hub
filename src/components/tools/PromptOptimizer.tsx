'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wand2,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Bot,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Brain,
  ShieldAlert,
  Zap,
  Target
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

interface FrameworkOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: typeof Brain;
}

const FRAMEWORKS: FrameworkOption[] = [
  {
    id: 'cot',
    name: 'Tư Duy Từng Bước',
    badge: 'Độ chính xác cao',
    description: 'Đặt vai trò chuyên gia và hướng dẫn AI suy nghĩ từng bước trước khi đưa ra kết luận.',
    icon: Brain,
  },
  {
    id: 'create',
    name: 'Công Thức 6 Bước Toàn Diện',
    badge: 'Đầy đủ nhất',
    description: 'Xác định rõ: Bối cảnh, Vai trò, Chỉ dẫn, Điều cần tránh, Giọng văn và Ví dụ mẫu.',
    icon: Layers,
  },
  {
    id: 'guardrails',
    name: 'Khung An Toàn Chống Bịa Đặt',
    badge: 'Kiểm soát sai lệch',
    description: 'Thiết lập quy tắc cấm đoán rõ ràng và bố cục trả lời mạch lạc, không suy diễn.',
    icon: ShieldAlert,
  },
  {
    id: 'few-shot',
    name: 'Học Theo Ví Dụ Mẫu',
    badge: 'Chuẩn bố cục',
    description: 'Kèm cặp Đầu vào → Đầu ra minh họa để AI bắt chước đúng mẫu bạn mong muốn.',
    icon: Sparkles,
  },
];

const PRESETS_RAW = [
  { label: 'Viết bài đánh giá sản phẩm', text: 'Viết bài đánh giá chi tiết về điện thoại mới ra mắt' },
  { label: 'Tìm và sửa lỗi lập trình', text: 'Tìm lỗi trong đoạn mã này giúp tôi và sửa lại cho chạy đúng' },
  { label: 'Lập kế hoạch học tập', text: 'Lập kế hoạch tự học ứng dụng AI trong 3 tháng' },
  { label: 'Viết email xin tăng lương', text: 'Viết email xin tăng lương gửi cho quản lý trực tiếp' },
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
      toast.error('Vui lòng nhập câu lệnh cần tối ưu!');
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
Bạn là một chuyên gia hàng đầu trong lĩnh vực này với hơn 10 năm kinh nghiệm thực tế.

### NHIỆM VỤ
${rawPrompt}

### QUY TRÌNH SUY LUẬN TỪNG BƯỚC
Trước khi đưa ra câu trả lời cuối cùng, bạn BẮT BUỘC phải thực hiện tuần tự các bước sau:
1. **Bước 1 — Phân tích bối cảnh & đối tượng**: Xác định rõ mục tiêu cốt lõi và người đọc cuối cùng.
2. **Bước 2 — Bóc tách tiêu chí**: Liệt kê các tiêu chí đánh giá khách quan và các trường hợp ngoại lệ cần lưu ý.
3. **Bước 3 — Thực thi chi tiết**: Trình bày nội dung có bố cục rõ ràng, mỗi luận điểm đều có dẫn chứng cụ thể.
4. **Bước 4 — Tự kiểm tra & Tối ưu**: Rà soát lại tính hợp lý và loại bỏ thông tin mơ hồ hoặc thiếu căn cứ.

### ĐỊNH DẠNG ĐẦU RA
Trình bày rõ ràng bằng gạch đầu dòng, kèm bảng so sánh (nếu phù hợp) và danh sách việc cần làm cụ thể.`;
      notes = [
        'Định hình vai trò chuyên gia có kinh nghiệm thực tế',
        'Kích hoạt quy trình suy nghĩ từng bước rõ ràng (4 bước)',
        'Yêu cầu AI tự rà soát lại lỗi lập luận trước khi kết luận',
      ];
    } else if (selectedFramework === 'create') {
      enhanced = `### BỐI CẢNH
Tôi đang cần thực hiện nhiệm vụ: "${rawPrompt}". Yêu cầu nội dung rõ ràng, chất lượng cao, có thể áp dụng ngay vào công việc.

### VAI TRÒ
Đóng vai một chuyên gia tư vấn dày dặn kinh nghiệm, phân tích sắc bén, thực tế và đi thẳng vào trọng tâm.

### CHỈ DẪN CỤ THỂ
- Phân tích đầy đủ các khía cạnh quan trọng nhất.
- Đưa ra giải pháp kèm lộ trình từng bước dễ làm theo.
- Bổ sung ví dụ minh họa gần gũi, dễ hiểu.

### ĐIỀU CẦN TRÁNH
- TUYỆT ĐỐI KHÔNG viết sáo rỗng, mở đầu dài dòng hay nói lý thuyết chung chung.
- Không tự bịa số liệu hoặc trích dẫn không có thật; nếu chưa chắc chắn, hãy ghi chú rõ.

### GIỌNG VĂN
Chuyên nghiệp, tự nhiên, súc tích và hướng thẳng vào hành động.

### CẤU TRÚC MẪU
- Vấn đề cốt lõi: ...
- Phương án giải quyết: [1], [2], [3]
- Kế hoạch thực hiện: ...`;
      notes = [
        'Áp dụng đầy đủ 6 bước cấu trúc hoàn chỉnh',
        'Bổ sung quy tắc điều cần tránh giúp câu trả lời súc tích, không sáo rỗng',
        'Quy định rõ giọng văn và bố cục đầu ra mong muốn',
      ];
    } else if (selectedFramework === 'guardrails') {
      enhanced = `[HƯỚNG DẪN HỆ THỐNG: KIỂM SOÁT CHÍNH XÁC & AN TOÀN]
Bạn là một trợ lý AI trung thực, chính xác và có trách nhiệm cao.

Nhiệm vụ:
"""
${rawPrompt}
"""

CÁC NGUYÊN TẮC BẢO VỆ BẮT BUỘC:
1. **Trung thực dữ kiện**: Chỉ khẳng định những thông tin có căn cứ rõ ràng. Nếu thiếu dữ liệu để kiểm chứng, phải nêu rõ "Chưa có đủ dữ liệu xác thực".
2. **Đúng trọng tâm**: Không xuất các câu chào xã giao ("Chào bạn", "Tôi hy vọng điều này giúp ích"). Đi thẳng vào nội dung chính.
3. **Bố cục câu trả lời**:
   - Tóm tắt ngắn gọn: Tối đa 3 câu nêu ý chính.
   - Nội dung chi tiết: Đánh số thứ tự mạch lạc.
   - Rủi ro tiềm ẩn & Cách phòng tránh.
4. **Ngôn ngữ**: Tiếng Việt chuẩn mực, tự nhiên; giữ nguyên thuật ngữ chuyên ngành kèm giải thích ngắn nếu cần.`;
      notes = [
        'Thêm quy tắc chống bịa đặt và suy diễn thông tin sai lệch',
        'Loại bỏ lời chào thừa, giữ câu trả lời gọn và tiết kiệm thời gian',
        'Bổ sung phần cảnh báo rủi ro tiềm ẩn và cách xử lý',
      ];
    } else {
      enhanced = `### VAI TRÒ & YÊU CẦU
Bạn là trợ lý AI chuyên nghiệp. Hãy xử lý yêu cầu sau theo đúng mẫu ví dụ được cung cấp bên dưới:
Yêu cầu: ${rawPrompt}

### VÍ DỤ MINH HỌA (ĐẦU VÀO → ĐẦU RA)

**Ví dụ 1:**
- Đầu vào: Viết thông báo bảo trì hệ thống
- Đầu ra:
  📢 **THÔNG BÁO BẢO TRÌ HỆ THỐNG**
  - Thời gian: 00:00 - 02:00 ngày 20/11/2026
  - Ảnh hưởng: Tạm ngắt kết nối cổng thanh toán trực tuyến
  - Liên hệ hỗ trợ: contact@ailifehub.dev

**Ví dụ 2:**
- Đầu vào: [Nhiệm vụ của bạn: ${rawPrompt}]
- Đầu ra mong đợi: [Áp dụng đúng bố cục tương tự, rõ ràng, đầy đủ thông tin]`;
      notes = [
        'Cung cấp cặp ví dụ Đầu vào → Đầu ra cụ thể để AI làm theo',
        'Giúp AI nắm bắt đúng bố cục mong muốn mà không cần giải thích dài dòng',
      ];
    }

    setOptimizedPrompt(enhanced);
    setImprovements(notes);
    setIsOptimizing(false);
    toast.success('Đã nâng cấp câu lệnh thành công!');
  };

  const handleCopy = async () => {
    if (!optimizedPrompt) return;
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = optimizedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success('Đã sao chép câu lệnh tối ưu!');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedFrameworkLabel =
    selectedFramework === 'cot'
      ? 'Tư duy từng bước'
      : selectedFramework === 'create'
      ? '6 bước toàn diện'
      : selectedFramework === 'guardrails'
      ? 'Chống bịa đặt'
      : 'Theo ví dụ mẫu';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-semibold mb-3">
          <Wand2 className="h-4 w-4" />
          <span>Trợ lý nâng cấp câu lệnh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text mb-4">
          Tối Ưu Hóa Câu Lệnh
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Biến ý tưởng ngắn gọn thành câu lệnh đầy đủ vai trò, ngữ cảnh và quy tắc — giúp cả người mới viết email, lập kế hoạch lẫn lập trình viên nhận kết quả AI sát ý ngay lần đầu.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="text-xs text-text-muted font-medium">Thử nhanh câu lệnh mẫu:</span>
        {PRESETS_RAW.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setRawPrompt(p.text)}
            className="px-3 py-1.5 rounded-full text-xs border border-border bg-bg-surface text-text hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Raycast-style Framework Selector Pills */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {FRAMEWORKS.map((fw) => {
          const Icon = fw.icon;
          const isSelected = selectedFramework === fw.id;
          return (
            <button
              key={fw.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedFramework(fw.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative group ${
                isSelected
                  ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent/50 shadow-[0_0_15px_rgba(249,115,22,0.18)]'
                  : 'border-border bg-bg-surface hover:border-accent/40 text-text-muted hover:text-text'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isSelected ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-bg border-border text-text-muted group-hover:text-text'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-text">{fw.name}</span>
                </div>
              </div>
              <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-bg border border-border text-accent mb-2">
                {fw.badge}
              </span>
              <p className="text-xs text-text-muted leading-relaxed">{fw.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Transformer Section */}
      <div className="grid gap-6 lg:grid-cols-2 items-start mb-10">
        {/* Raw Prompt Input */}
        <div className="rounded-3xl border border-border bg-bg-elevated p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="raw-prompt-input" className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <Bot className="w-4 h-4 text-accent" />
              Câu lệnh ban đầu của bạn
            </label>
            <button
              type="button"
              onClick={() => setRawPrompt('')}
              className="text-xs text-text-muted hover:text-red-500 transition-colors"
            >
              Xóa
            </button>
          </div>
          <textarea
            id="raw-prompt-input"
            rows={8}
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="Nhập yêu cầu ngắn gọn của bạn, ví dụ: 'viết bài đăng giới thiệu sản phẩm mới'..."
            className="w-full px-4 py-3 rounded-2xl border border-border bg-bg text-sm text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent leading-relaxed resize-y"
          />

          <div>
            <Button
              size="lg"
              disabled={isOptimizing || !rawPrompt.trim()}
              onClick={handleOptimize}
              className="w-full gap-2 bg-accent hover:bg-accent-hover text-white shadow-md active:scale-[0.99] transition-all"
            >
              <Wand2 className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Đang phân tích và nâng cấp...' : 'Nâng Cấp Câu Lệnh Ngay'}</span>
            </Button>
          </div>
        </div>

        {/* Optimized Prompt Output */}
        <div className="rounded-3xl border border-border bg-bg-elevated p-6 shadow-md min-h-[420px] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Câu Lệnh Đã Tối Ưu
                </span>
              </div>
              {optimizedPrompt && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white hover:bg-accent-hover transition-all active:scale-[0.98] shadow-sm"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              )}
            </div>

            {/* Shimmer loading state during optimization delay */}
            {isOptimizing ? (
              <div className="rounded-2xl border border-border bg-bg p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-accent/40 animate-ping" />
                  <span className="text-xs font-mono text-accent">Đang tối ưu theo phương pháp {selectedFrameworkLabel}...</span>
                </div>
                <div className="space-y-2.5 pt-2">
                  <div className="h-4 bg-bg-surface rounded-md w-3/4" />
                  <div className="h-4 bg-bg-surface rounded-md w-full" />
                  <div className="h-4 bg-bg-surface rounded-md w-5/6" />
                  <div className="h-4 bg-bg-surface rounded-md w-2/3" />
                </div>
              </div>
            ) : optimizedPrompt ? (
              <div className="space-y-4">
                {/* Quality Metrics Badge Bar */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-bg border border-border/80 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Target className="w-3.5 h-3.5" /> Cấu trúc: Đầy đủ
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Kiểm soát: Đang bật
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent font-semibold">
                    <Zap className="w-3.5 h-3.5" /> {selectedFrameworkLabel}
                  </span>
                </div>

                {/* Prompt Preview Container */}
                <div className="rounded-2xl bg-[#05070f] border border-border p-4 font-mono text-xs text-emerald-300/90 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed shadow-inner">
                  {optimizedPrompt}
                </div>

                {improvements.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-bold text-text mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      Những điểm đã được nâng cấp:
                    </p>
                    <ul className="space-y-1.5">
                      {improvements.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-text-muted">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center text-text-muted text-xs">
                <Wand2 className="h-8 w-8 mx-auto mb-2 opacity-40 text-accent" />
                <p>Nhập yêu cầu ở bên trái và bấm &quot;Nâng Cấp Câu Lệnh Ngay&quot; để nhận bản hoàn chỉnh dễ dùng ngay.</p>
              </div>
            )}
          </div>

          {/* Quick Action Footer */}
          {optimizedPrompt && (
            <div className="pt-3 border-t border-border">
              <Link
                href="/playground"
                className="w-full py-2.5 px-4 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Mở trong Khu Thử Nghiệm AI để thử ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
