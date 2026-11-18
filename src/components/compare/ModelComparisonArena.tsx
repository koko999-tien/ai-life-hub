'use client';

import { useState, useMemo } from 'react';
import {
  Zap,
  CheckCircle,
  ArrowRight,
  Layers,
  Scale,
  Award,
  Sparkles,
  LayoutGrid,
  TableProperties
} from 'lucide-react';
import Link from 'next/link';

export interface AIModel {
  id: string;
  name: string;
  provider: 'Anthropic' | 'OpenAI' | 'DeepSeek' | 'Google' | 'Meta' | 'Open Source';
  license: 'Proprietary' | 'Open Weights';
  contextWindow: number; // in thousands
  maxOutput: number; // in thousands
  inputPricePerMillion: number; // USD
  outputPricePerMillion: number; // USD
  cachePricePerMillion?: number; // USD
  sweBenchScore?: number; // %
  humanEvalScore?: number; // %
  mmluScore?: number; // %
  mathScore?: number; // %
  strengths: string[];
  bestFor: string;
  recommendedUseCases: string[];
  latencyRank: 'Ultra-Fast' | 'Fast' | 'Balanced' | 'Deliberate (Reasoning)';
}

const LICENSE_LABELS: Record<AIModel['license'], string> = {
  Proprietary: 'Độc quyền (Trả phí API)',
  'Open Weights': 'Mã nguồn mở (Tải về tự chạy)',
};

const LATENCY_LABELS: Record<AIModel['latencyRank'], string> = {
  'Ultra-Fast': 'Siêu nhanh',
  Fast: 'Nhanh',
  Balanced: 'Cân bằng',
  'Deliberate (Reasoning)': 'Suy nghĩ sâu (Chậm hơn)',
};

export const MODELS_DATA: AIModel[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    license: 'Proprietary',
    contextWindow: 200,
    maxOutput: 8,
    inputPricePerMillion: 3.0,
    outputPricePerMillion: 15.0,
    cachePricePerMillion: 0.3,
    sweBenchScore: 49.2,
    humanEvalScore: 93.7,
    mmluScore: 88.7,
    mathScore: 78.3,
    strengths: [
      'Đỉnh cao lập trình giao diện & hệ thống toàn phần (fullstack)',
      'Hiểu sắc thái ngôn ngữ và tuân thủ chỉ dẫn nền cực tốt',
      'Lưu bộ nhớ đệm (Prompt Caching) giúp giảm 90% chi phí đầu vào'
    ],
    bestFor: 'Lập trình phần mềm & Trợ lý tự hành',
    recommendedUseCases: ['Viết mã nguồn phức tạp', 'Quy trình nhiều trợ lý AI phối hợp', 'Đọc và tái cấu trúc dự án lớn'],
    latencyRank: 'Fast'
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    license: 'Proprietary',
    contextWindow: 200,
    maxOutput: 8,
    inputPricePerMillion: 0.8,
    outputPricePerMillion: 4.0,
    cachePricePerMillion: 0.08,
    sweBenchScore: 40.6,
    humanEvalScore: 88.9,
    mmluScore: 81.3,
    mathScore: 69.4,
    strengths: [
      'Tốc độ phản hồi cực nhanh',
      'Chi phí tiết kiệm cho các tác vụ phụ trợ (subagent)',
      'Độ dài ngữ cảnh 200k token rộng rãi'
    ],
    bestFor: 'Xử lý API tốc độ cao & Tác vụ phụ trợ',
    recommendedUseCases: ['Phân loại văn bản', 'Trích xuất dữ liệu tự động', 'Trợ lý phụ trợ tra cứu nhanh'],
    latencyRank: 'Ultra-Fast'
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'OpenAI',
    license: 'Proprietary',
    contextWindow: 128,
    maxOutput: 16,
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 10.0,
    cachePricePerMillion: 1.25,
    sweBenchScore: 38.8,
    humanEvalScore: 90.2,
    mmluScore: 88.7,
    mathScore: 76.6,
    strengths: [
      'Xử lý đa phương thức (Ảnh, Âm thanh, Văn bản) đồng nhất',
      'Tốc độ ổn định toàn cầu',
      'Hệ sinh thái công cụ kết nối phong phú'
    ],
    bestFor: 'Trí tuệ tổng hợp đa phương thức (Chữ, Ảnh, Giọng nói)',
    recommendedUseCases: ['Phân tích biểu đồ và ảnh chụp', 'Trợ lý đàm thoại giọng nói', 'Tổng hợp thông tin đa kênh'],
    latencyRank: 'Fast'
  },
  {
    id: 'openai-o1',
    name: 'OpenAI o1',
    provider: 'OpenAI',
    license: 'Proprietary',
    contextWindow: 200,
    maxOutput: 100,
    inputPricePerMillion: 15.0,
    outputPricePerMillion: 60.0,
    cachePricePerMillion: 7.5,
    sweBenchScore: 48.9,
    humanEvalScore: 92.4,
    mmluScore: 91.8,
    mathScore: 96.4,
    strengths: [
      'Tư duy từng bước ẩn (Chain-of-Thought) sâu trước khi phản hồi',
      'Giải toán cấp Olympic và lập trình thuật toán phức tạp'
    ],
    bestFor: 'Suy luận chuyên sâu, Toán học & Thuật toán khó',
    recommendedUseCases: ['Thuật toán phân tích khoa học', 'Kiểm tra bảo mật hợp đồng thông minh', 'Bài toán logic đa tầng'],
    latencyRank: 'Deliberate (Reasoning)'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 (MoE 671B)',
    provider: 'DeepSeek',
    license: 'Open Weights',
    contextWindow: 128,
    maxOutput: 8,
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cachePricePerMillion: 0.014,
    sweBenchScore: 42.0,
    humanEvalScore: 89.1,
    mmluScore: 88.5,
    mathScore: 89.3,
    strengths: [
      'Hiệu năng tiệm cận Claude/GPT nhưng chi phí chỉ bằng khoảng 1/20',
      'Kiến trúc chia nhỏ chuyên gia (MoE 671B — chỉ kích hoạt phần cần thiết) siêu tối ưu',
      'Hỗ trợ mạnh cả tiếng Việt và tiếng Trung'
    ],
    bestFor: 'Tối ưu chi phí vượt trội trên từng đồng bỏ ra',
    recommendedUseCases: ['Xử lý dữ liệu quy mô lớn', 'Hệ thống trò chuyện tiết kiệm chi phí', 'Tóm tắt hàng triệu văn bản'],
    latencyRank: 'Fast'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Suy luận sâu)',
    provider: 'DeepSeek',
    license: 'Open Weights',
    contextWindow: 128,
    maxOutput: 32,
    inputPricePerMillion: 0.55,
    outputPricePerMillion: 2.19,
    cachePricePerMillion: 0.14,
    sweBenchScore: 49.2,
    humanEvalScore: 92.8,
    mmluScore: 90.8,
    mathScore: 97.3,
    strengths: [
      'Mô hình suy luận mã nguồn mở đầu tiên ngang ngửa OpenAI o1',
      'Hiển thị minh bạch toàn bộ quá trình suy nghĩ từng bước',
      'Giá rẻ bằng khoảng 1/30 so với OpenAI o1'
    ],
    bestFor: 'Suy luận logic sâu với mã nguồn mở',
    recommendedUseCases: ['Nghiên cứu khoa học & toán học', 'Lập trình giải thuật khó', 'Suy luận pháp lý và logic'],
    latencyRank: 'Deliberate (Reasoning)'
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Google Gemini 1.5 Pro',
    provider: 'Google',
    license: 'Proprietary',
    contextWindow: 2000, // 2M
    maxOutput: 8,
    inputPricePerMillion: 1.25,
    outputPricePerMillion: 5.0,
    cachePricePerMillion: 0.31,
    sweBenchScore: 35.8,
    humanEvalScore: 84.1,
    mmluScore: 85.9,
    mathScore: 67.7,
    strengths: [
      'Sức chứa ngữ cảnh khổng lồ tới 2.000.000 token (đơn vị chữ)',
      'Đọc được cả quyển sách dày, toàn bộ dự án phần mềm hoặc video dài 1 giờ'
    ],
    bestFor: 'Đọc tài liệu siêu dài & Phân tích video dài',
    recommendedUseCases: ['Phân tích toàn bộ kho tài liệu doanh nghiệp', 'Xem video 60 phút trích xuất dữ liệu', 'Tra cứu toàn bộ mã nguồn lớn'],
    latencyRank: 'Balanced'
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Google Gemini 2.0 Flash',
    provider: 'Google',
    license: 'Proprietary',
    contextWindow: 1000, // 1M
    maxOutput: 8,
    inputPricePerMillion: 0.1,
    outputPricePerMillion: 0.4,
    cachePricePerMillion: 0.025,
    sweBenchScore: 36.2,
    humanEvalScore: 86.5,
    mmluScore: 83.2,
    mathScore: 71.0,
    strengths: [
      'Tốc độ hiện chữ đầu tiên gần như tức thì (thời gian chờ chữ đầu tiên cực thấp)',
      'Chi phí thuộc nhóm rẻ nhất thị trường',
      'Độ dài ngữ cảnh tới 1 triệu token'
    ],
    bestFor: 'Trợ lý phản hồi tức thì & Tìm kiếm thời gian thực',
    recommendedUseCases: ['Chatbot trực tiếp tốc độ cao', 'Công cụ tìm kiếm thời gian thực', 'Tra cứu kho tài liệu nội bộ (RAG) quy mô lớn'],
    latencyRank: 'Ultra-Fast'
  },
  {
    id: 'llama-3-3-70b',
    name: 'Meta Llama 3.3 70B',
    provider: 'Meta',
    license: 'Open Weights',
    contextWindow: 128,
    maxOutput: 8,
    inputPricePerMillion: 0.12,
    outputPricePerMillion: 0.3,
    cachePricePerMillion: 0.0,
    sweBenchScore: 37.5,
    humanEvalScore: 88.0,
    mmluScore: 88.6,
    mathScore: 75.0,
    strengths: [
      'Chất lượng tương đương GPT-4 đời trước nhưng tự cài được trên máy chủ nội bộ (on-premise)',
      'Cộng đồng huấn luyện tinh chỉnh thêm (fine-tuning) lớn nhất thế giới'
    ],
    bestFor: 'Triển khai riêng tư trên máy chủ nội bộ',
    recommendedUseCases: ['Triển khai bảo mật nội bộ ngân hàng/y tế', 'Huấn luyện riêng theo dữ liệu công ty', 'Chạy ngoại tuyến qua Ollama/vLLM'],
    latencyRank: 'Fast'
  },
  {
    id: 'qwen-2-5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Open Source',
    license: 'Open Weights',
    contextWindow: 128,
    maxOutput: 8,
    inputPricePerMillion: 0.08,
    outputPricePerMillion: 0.18,
    cachePricePerMillion: 0.0,
    sweBenchScore: 43.1,
    humanEvalScore: 92.7,
    mmluScore: 85.0,
    mathScore: 82.5,
    strengths: [
      'Mô hình lập trình mã nguồn mở cỡ 32B mạnh hàng đầu hiện nay',
      'Chạy mượt trên card đồ họa máy trạm cá nhân (RTX 3090/4090/Mac M3)'
    ],
    bestFor: 'Trợ lý lập trình chạy trực tiếp trên máy cá nhân',
    recommendedUseCases: ['Tích hợp vào VS Code / Cursor ngoại tuyến', 'Tự động hóa git và kiểm thử tự động (unit test)', 'Bảo mật tuyệt đối, không gửi mã nguồn ra ngoài'],
    latencyRank: 'Ultra-Fast'
  }
];

export function ModelComparisonArena() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'versus' | 'advisor'>('matrix');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Side-by-side versus state
  const [modelAId, setModelAId] = useState<string>('claude-3-5-sonnet');
  const [modelBId, setModelBId] = useState<string>('deepseek-r1');
  const [versusMobileView, setVersusMobileView] = useState<'cards' | 'table'>('cards');

  // Advisor state
  const [advisorGoal, setAdvisorGoal] = useState<'coding' | 'reasoning' | 'budget' | 'long-context' | 'local'>('coding');

  const filteredModels = useMemo(() => {
    return MODELS_DATA.filter((m) => {
      const matchProvider = selectedProvider === 'all' || m.provider === selectedProvider;
      const matchLicense = selectedLicense === 'all' || m.license === selectedLicense;
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.strengths.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          m.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvider && matchLicense && matchSearch;
    });
  }, [selectedProvider, selectedLicense, searchQuery]);

  const modelA = useMemo(() => MODELS_DATA.find(m => m.id === modelAId) || MODELS_DATA[0], [modelAId]);
  const modelB = useMemo(() => MODELS_DATA.find(m => m.id === modelBId) || MODELS_DATA[5], [modelBId]);

  const recommendedModelsForGoal = useMemo(() => {
    switch (advisorGoal) {
      case 'coding':
        return MODELS_DATA.filter(m => m.id === 'claude-3-5-sonnet' || m.id === 'qwen-2-5-coder-32b' || m.id === 'deepseek-r1');
      case 'reasoning':
        return MODELS_DATA.filter(m => m.id === 'deepseek-r1' || m.id === 'openai-o1');
      case 'budget':
        return MODELS_DATA.filter(m => m.id === 'deepseek-v3' || m.id === 'gemini-2-0-flash' || m.id === 'claude-3-5-haiku');
      case 'long-context':
        return MODELS_DATA.filter(m => m.id === 'gemini-1-5-pro' || m.id === 'claude-3-5-sonnet');
      case 'local':
        return MODELS_DATA.filter(m => m.id === 'qwen-2-5-coder-32b' || m.id === 'llama-3-3-70b');
    }
  }, [advisorGoal]);

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div role="tablist" aria-label="Chế độ so sánh mô hình AI" className="flex border-b border-border gap-2 sm:gap-6 overflow-x-auto pb-1">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'matrix'}
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <Layers className="w-4 h-4" />
          Bảng Thông Số Tổng Hợp
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'versus'}
          onClick={() => setActiveTab('versus')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'versus'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <Scale className="w-4 h-4" />
          So Sánh 1-đối-1
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'advisor'}
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'advisor'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Tư Vấn Chọn Mô Hình
        </button>
      </div>

      {/* TAB 1: MATRIX VIEW */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="card p-4 sm:p-6 bg-bg-surface border-border flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[240px]">
              <input
                type="text"
                aria-label="Tìm kiếm mô hình AI"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mô hình, thế mạnh (vd: lập trình, tài liệu dài, giá rẻ)..."
                className="w-full p-2.5 rounded-lg bg-bg border border-border text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Lọc theo nhà phát triển"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="p-2.5 rounded-lg bg-bg border border-border text-xs sm:text-sm text-text focus:border-accent focus:outline-none"
              >
                <option value="all">Tất cả nhà phát triển</option>
                <option value="Anthropic">Anthropic</option>
                <option value="OpenAI">OpenAI</option>
                <option value="DeepSeek">DeepSeek</option>
                <option value="Google">Google</option>
                <option value="Meta">Meta</option>
                <option value="Open Source">Cộng đồng Mã nguồn mở</option>
              </select>

              <select
                aria-label="Lọc theo loại bản quyền"
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className="p-2.5 rounded-lg bg-bg border border-border text-xs sm:text-sm text-text focus:border-accent focus:outline-none"
              >
                <option value="all">Mọi loại bản quyền</option>
                <option value="Proprietary">Độc quyền (Trả phí API)</option>
                <option value="Open Weights">Mã nguồn mở (Tải về tự chạy)</option>
              </select>
            </div>
          </div>

          {/* Model Cards Grid */}
          {filteredModels.length === 0 ? (
            <div className="card p-10 bg-bg-surface border-border text-center space-y-3">
              <p className="text-sm text-text-muted">Không tìm thấy mô hình AI nào khớp với bộ lọc hiện tại.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedProvider('all');
                  setSelectedLicense('all');
                }}
                className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModels.map((m) => (
                <div
                  key={m.id}
                  className="card p-6 bg-bg-surface border-border hover:border-accent/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent/10 text-accent mb-1 inline-block">
                          {m.provider}
                        </span>
                        <h3 className="font-bold text-lg text-text group-hover:text-accent transition-colors">
                          {m.name}
                        </h3>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium text-right ${
                        m.license === 'Open Weights'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {LICENSE_LABELS[m.license]}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted mb-4 font-medium">
                      🎯 <strong className="text-text">Phù hợp nhất cho:</strong> {m.bestFor}
                    </p>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-bg border border-border/80 mb-4 text-center">
                      <div>
                        <span className="text-[10px] text-text-muted block">Ngữ cảnh</span>
                        <strong className="text-xs sm:text-sm text-text font-mono">
                          {m.contextWindow >= 1000 ? `${m.contextWindow / 1000}M` : `${m.contextWindow}k`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted block">Đầu vào / 1M</span>
                        <strong className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                          ${m.inputPricePerMillion}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted block">Đầu ra / 1M</span>
                        <strong className="text-xs sm:text-sm text-text font-mono">
                          ${m.outputPricePerMillion}
                        </strong>
                      </div>
                    </div>

                    {/* Benchmark badges with visual progress bars */}
                    <div className="space-y-2.5 mb-4 text-xs font-mono">
                      {m.sweBenchScore && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-text-muted">
                            <span>SWE-bench (Lập trình thực tế):</span>
                            <strong className="text-text font-semibold">{m.sweBenchScore}%</strong>
                          </div>
                          <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/60">
                            <div
                              className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, m.sweBenchScore))}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {m.mathScore && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-text-muted">
                            <span>MATH (Toán học & Logic):</span>
                            <strong className="text-text font-semibold">{m.mathScore}%</strong>
                          </div>
                          <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/60">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, m.mathScore))}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {m.mmluScore && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-text-muted">
                            <span>MMLU (Kiến thức tổng quát):</span>
                            <strong className="text-text font-semibold">{m.mmluScore}%</strong>
                          </div>
                          <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/60">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, m.mmluScore))}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Strengths list */}
                    <div className="space-y-1 mb-4">
                      <span className="text-[11px] font-semibold text-text uppercase">Điểm nổi bật:</span>
                      <ul className="text-xs text-text-muted space-y-1">
                        {m.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-accent" />
                      {LATENCY_LABELS[m.latencyRank]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setModelAId(m.id);
                        setActiveTab('versus');
                      }}
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      So sánh 1-đối-1 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VERSUS 1-VS-1 */}
      {activeTab === 'versus' && (
        <div className="space-y-8">
          {/* Model Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-5 bg-bg-surface border-border space-y-2">
              <label htmlFor="compare-model-a" className="text-xs font-semibold uppercase text-accent block">
                Chọn Mô Hình A:
              </label>
              <select
                id="compare-model-a"
                value={modelAId}
                onChange={(e) => setModelAId(e.target.value)}
                className="w-full p-3 rounded-lg bg-bg border border-border text-text font-bold focus:border-accent focus:outline-none"
              >
                {MODELS_DATA.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                ))}
              </select>
            </div>

            <div className="card p-5 bg-bg-surface border-border space-y-2">
              <label htmlFor="compare-model-b" className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 block">
                Chọn Mô Hình B:
              </label>
              <select
                id="compare-model-b"
                value={modelBId}
                onChange={(e) => setModelBId(e.target.value)}
                className="w-full p-3 rounded-lg bg-bg border border-border text-text font-bold focus:border-accent focus:outline-none"
              >
                {MODELS_DATA.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex items-center justify-between md:hidden pb-1">
            <span className="text-xs text-text-muted">Chế độ xem trên di động:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-pressed={versusMobileView === 'cards'}
                onClick={() => setVersusMobileView('cards')}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                  versusMobileView === 'cards'
                    ? 'border-accent bg-accent/10 text-accent font-semibold'
                    : 'border-border bg-bg text-text-muted'
                }`}
                title="Xem dạng thẻ dọc"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Thẻ dọc</span>
              </button>
              <button
                type="button"
                aria-pressed={versusMobileView === 'table'}
                onClick={() => setVersusMobileView('table')}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                  versusMobileView === 'table'
                    ? 'border-accent bg-accent/10 text-accent font-semibold'
                    : 'border-border bg-bg text-text-muted'
                }`}
                title="Xem dạng bảng cuộn"
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Bảng cuộn</span>
              </button>
            </div>
          </div>

          {/* Vertical Comparative Cards View for Small Screens */}
          {versusMobileView === 'cards' && (
            <div className="space-y-3 md:hidden">
              {/* Provider */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Nhà phát triển</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                    <span className="text-[10px] text-accent block font-bold">{modelA.name}</span>
                    <strong className="text-text">{modelA.provider}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold">{modelB.name}</span>
                    <strong className="text-text">{modelB.provider}</strong>
                  </div>
                </div>
              </div>

              {/* License */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Bản quyền mã nguồn</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                    <span className="text-[10px] text-accent block font-bold">{modelA.name}</span>
                    <span className="text-text text-xs">{LICENSE_LABELS[modelA.license]}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold">{modelB.name}</span>
                    <span className="text-text text-xs">{LICENSE_LABELS[modelB.license]}</span>
                  </div>
                </div>
              </div>

              {/* Context Window */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Độ dài văn bản đọc được</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-accent block font-bold font-sans">{modelA.name}</span>
                    <strong className="text-text">
                      {modelA.contextWindow >= 1000 ? `${modelA.contextWindow / 1000}M` : `${modelA.contextWindow}k`} token
                    </strong>
                    {modelA.contextWindow > modelB.contextWindow && <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">👑 Lớn hơn</span>}
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold font-sans">{modelB.name}</span>
                    <strong className="text-text">
                      {modelB.contextWindow >= 1000 ? `${modelB.contextWindow / 1000}M` : `${modelB.contextWindow}k`} token
                    </strong>
                    {modelB.contextWindow > modelA.contextWindow && <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">👑 Lớn hơn</span>}
                  </div>
                </div>
              </div>

              {/* Input Price */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Giá đầu vào (trên 1M token)</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-accent block font-bold font-sans">{modelA.name}</span>
                    <strong className="text-text">${modelA.inputPricePerMillion}</strong>
                    {modelA.inputPricePerMillion < modelB.inputPricePerMillion && <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">⭐ Rẻ hơn</span>}
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold font-sans">{modelB.name}</span>
                    <strong className="text-text">${modelB.inputPricePerMillion}</strong>
                    {modelB.inputPricePerMillion < modelA.inputPricePerMillion && <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">⭐ Rẻ hơn</span>}
                  </div>
                </div>
              </div>

              {/* Output Price */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Giá đầu ra (trên 1M token)</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-accent block font-bold font-sans">{modelA.name}</span>
                    <strong className="text-text">${modelA.outputPricePerMillion}</strong>
                    {modelA.outputPricePerMillion < modelB.outputPricePerMillion && <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">⭐ Rẻ hơn</span>}
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold font-sans">{modelB.name}</span>
                    <strong className="text-text">${modelB.outputPricePerMillion}</strong>
                    {modelB.outputPricePerMillion < modelA.outputPricePerMillion && <span className="block text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">⭐ Rẻ hơn</span>}
                  </div>
                </div>
              </div>

              {/* SWE-bench */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">SWE-bench (Lập trình thực tế)</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-accent block font-bold font-sans">{modelA.name}</span>
                    <strong className="text-text">{modelA.sweBenchScore ? `${modelA.sweBenchScore}%` : 'Chưa công bố'}</strong>
                    {modelA.sweBenchScore && modelB.sweBenchScore && modelA.sweBenchScore > modelB.sweBenchScore && (
                      <span className="block text-accent text-[10px] font-semibold mt-0.5">🏆 Thắng</span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold font-sans">{modelB.name}</span>
                    <strong className="text-text">{modelB.sweBenchScore ? `${modelB.sweBenchScore}%` : 'Chưa công bố'}</strong>
                    {modelA.sweBenchScore && modelB.sweBenchScore && modelB.sweBenchScore > modelA.sweBenchScore && (
                      <span className="block text-purple-600 dark:text-purple-400 text-[10px] font-semibold mt-0.5">🏆 Thắng</span>
                    )}
                  </div>
                </div>
              </div>

              {/* MATH Score */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Điểm Toán học & Logic (MATH)</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-accent block font-bold font-sans">{modelA.name}</span>
                    <strong className="text-text">{modelA.mathScore ? `${modelA.mathScore}%` : 'Chưa công bố'}</strong>
                    {modelA.mathScore && modelB.mathScore && modelA.mathScore > modelB.mathScore && (
                      <span className="block text-accent text-[10px] font-semibold mt-0.5">🏆 Thắng</span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center font-mono">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold font-sans">{modelB.name}</span>
                    <strong className="text-text">{modelB.mathScore ? `${modelB.mathScore}%` : 'Chưa công bố'}</strong>
                    {modelA.mathScore && modelB.mathScore && modelB.mathScore > modelA.mathScore && (
                      <span className="block text-purple-600 dark:text-purple-400 text-[10px] font-semibold mt-0.5">🏆 Thắng</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Latency Rank */}
              <div className="card p-4 bg-bg-surface border-border space-y-2">
                <span className="text-xs font-semibold text-text-muted uppercase">Độ trễ / Tốc độ phản hồi</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                    <span className="text-[10px] text-accent block font-bold">{modelA.name}</span>
                    <strong className="text-text text-xs">{LATENCY_LABELS[modelA.latencyRank]}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold">{modelB.name}</span>
                    <strong className="text-text text-xs">{LATENCY_LABELS[modelB.latencyRank]}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table with Horizontal Scroll Wrapper */}
          <div className={`overflow-x-auto ${versusMobileView === 'cards' ? 'hidden md:block' : 'block'}`}>
            <div className="card bg-bg-surface border-border overflow-hidden min-w-[560px]">
              <div className="grid grid-cols-12 bg-bg p-4 border-b border-border text-xs font-bold uppercase text-text-muted">
                <div className="col-span-4">Tiêu chí so sánh</div>
                <div className="col-span-4 text-center text-accent">{modelA.name}</div>
                <div className="col-span-4 text-center text-purple-600 dark:text-purple-400">{modelB.name}</div>
              </div>

              <div className="divide-y divide-border text-sm">
                {/* Provider */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Nhà phát triển</div>
                  <div className="col-span-4 text-center font-semibold text-text">{modelA.provider}</div>
                  <div className="col-span-4 text-center font-semibold text-text">{modelB.provider}</div>
                </div>

                {/* License */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Bản quyền mã nguồn</div>
                  <div className="col-span-4 text-center text-text">{LICENSE_LABELS[modelA.license]}</div>
                  <div className="col-span-4 text-center text-text">{LICENSE_LABELS[modelB.license]}</div>
                </div>

                {/* Context Window */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Độ dài văn bản đọc được</div>
                  <div className="col-span-4 text-center font-mono font-bold">
                    {modelA.contextWindow >= 1000 ? `${modelA.contextWindow / 1000}M token` : `${modelA.contextWindow}k token`}
                    {modelA.contextWindow > modelB.contextWindow && <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-xs">👑 Lớn hơn</span>}
                  </div>
                  <div className="col-span-4 text-center font-mono font-bold">
                    {modelB.contextWindow >= 1000 ? `${modelB.contextWindow / 1000}M token` : `${modelB.contextWindow}k token`}
                    {modelB.contextWindow > modelA.contextWindow && <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-xs">👑 Lớn hơn</span>}
                  </div>
                </div>

                {/* Input Price */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Giá đầu vào (trên 1M token)</div>
                  <div className="col-span-4 text-center font-mono">
                    ${modelA.inputPricePerMillion}
                    {modelA.inputPricePerMillion < modelB.inputPricePerMillion && <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-xs">⭐ Rẻ hơn</span>}
                  </div>
                  <div className="col-span-4 text-center font-mono">
                    ${modelB.inputPricePerMillion}
                    {modelB.inputPricePerMillion < modelA.inputPricePerMillion && <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-xs">⭐ Rẻ hơn</span>}
                  </div>
                </div>

                {/* Output Price */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Giá đầu ra (trên 1M token)</div>
                  <div className="col-span-4 text-center font-mono">
                    ${modelA.outputPricePerMillion}
                    {modelA.outputPricePerMillion < modelB.outputPricePerMillion && <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-xs">⭐ Rẻ hơn</span>}
                  </div>
                  <div className="col-span-4 text-center font-mono">
                    ${modelB.outputPricePerMillion}
                    {modelB.outputPricePerMillion < modelA.outputPricePerMillion && <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-xs">⭐ Rẻ hơn</span>}
                  </div>
                </div>

                {/* SWE-bench */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">SWE-bench (Khả năng giải bài toán lập trình)</div>
                  <div className="col-span-4 text-center font-mono font-bold text-text">
                    {modelA.sweBenchScore ? `${modelA.sweBenchScore}%` : 'Chưa công bố'}
                    {modelA.sweBenchScore && modelB.sweBenchScore && modelA.sweBenchScore > modelB.sweBenchScore && (
                      <span className="ml-1 text-accent text-xs">🏆 Thắng</span>
                    )}
                  </div>
                  <div className="col-span-4 text-center font-mono font-bold text-text">
                    {modelB.sweBenchScore ? `${modelB.sweBenchScore}%` : 'Chưa công bố'}
                    {modelA.sweBenchScore && modelB.sweBenchScore && modelB.sweBenchScore > modelA.sweBenchScore && (
                      <span className="ml-1 text-purple-600 dark:text-purple-400 text-xs">🏆 Thắng</span>
                    )}
                  </div>
                </div>

                {/* MATH Score */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Điểm Toán học & Logic (MATH)</div>
                  <div className="col-span-4 text-center font-mono font-bold text-text">
                    {modelA.mathScore ? `${modelA.mathScore}%` : 'Chưa công bố'}
                    {modelA.mathScore && modelB.mathScore && modelA.mathScore > modelB.mathScore && (
                      <span className="ml-1 text-accent text-xs">🏆 Thắng</span>
                    )}
                  </div>
                  <div className="col-span-4 text-center font-mono font-bold text-text">
                    {modelB.mathScore ? `${modelB.mathScore}%` : 'Chưa công bố'}
                    {modelA.mathScore && modelB.mathScore && modelB.mathScore > modelA.mathScore && (
                      <span className="ml-1 text-purple-600 dark:text-purple-400 text-xs">🏆 Thắng</span>
                    )}
                  </div>
                </div>

                {/* Tốc độ */}
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Độ trễ / Tốc độ phản hồi</div>
                  <div className="col-span-4 text-center text-text font-medium">{LATENCY_LABELS[modelA.latencyRank]}</div>
                  <div className="col-span-4 text-center text-text font-medium">{LATENCY_LABELS[modelB.latencyRank]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADVISOR */}
      {activeTab === 'advisor' && (
        <div className="space-y-6">
          <div className="card p-6 bg-bg-surface border-border space-y-4">
            <h3 className="font-bold text-text text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Nhu cầu ưu tiên số 1 của bạn là gì?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(
                [
                  { id: 'coding', label: '💻 Lập trình & Mã nguồn', desc: 'Viết ứng dụng, sửa lỗi, tái cấu trúc' },
                  { id: 'reasoning', label: '🧠 Tư duy & Toán học', desc: 'Logic sâu, toán nâng cao' },
                  { id: 'budget', label: '💰 Siêu tiết kiệm chi phí', desc: 'Xử lý hàng triệu lượt giá rẻ' },
                  { id: 'long-context', label: '📚 Đọc tài liệu siêu dài', desc: 'Ngữ cảnh 200k – 2 triệu token' },
                  { id: 'local', label: '🔒 Tự chạy nội bộ / Ngoại tuyến', desc: 'Bảo mật 100%, không gửi ra ngoài' },
                ] as const
              ).map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  aria-pressed={advisorGoal === goal.id}
                  onClick={() => setAdvisorGoal(goal.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    advisorGoal === goal.id
                      ? 'border-accent bg-accent/10 text-accent font-semibold shadow-md'
                      : 'border-border bg-bg text-text-muted hover:text-text hover:border-accent/30'
                  }`}
                >
                  <span className="block font-bold text-sm mb-1">{goal.label}</span>
                  <span className="text-xs opacity-80">{goal.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Khuyến nghị hàng đầu cho nhu cầu đã chọn:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedModelsForGoal.map((m) => (
                <div key={m.id} className="card p-6 bg-bg-surface border-accent/40 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/15 text-accent">
                        Khuyên dùng
                      </span>
                      <h4 className="font-bold text-lg text-text mt-1">{m.name}</h4>
                    </div>
                    <span className="text-xs text-text-muted font-mono">{m.provider}</span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">
                    🎯 <strong>Lý do chọn:</strong> {m.bestFor}. {m.strengths[0]}.
                  </p>

                  <div className="p-3 rounded-lg bg-bg border border-border text-xs space-y-1">
                    <div className="flex justify-between text-text-muted">
                      <span>Giá đầu vào / 1M:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">${m.inputPricePerMillion}</strong>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>Độ dài ngữ cảnh:</span>
                      <strong className="text-text">
                        {m.contextWindow >= 1000 ? `${m.contextWindow / 1000}M` : `${m.contextWindow}k`} token
                      </strong>
                    </div>
                  </div>

                  <Link
                    href="/tools/token-calculator"
                    className="block text-center py-2 px-3 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent text-xs font-semibold transition-all"
                  >
                    Tính toán chi phí cho mô hình này
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
