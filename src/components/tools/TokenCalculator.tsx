'use client';

import { useState, useMemo } from 'react';
import { Calculator, DollarSign, TrendingDown, Zap, Laptop, Building2, Rocket, LayoutGrid, TableProperties } from 'lucide-react';
import { toast } from '@/components/ui';

interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  cachedInputPer1M?: number;
  contextWindow: string;
  badge?: string;
}

const MODELS_DATA: ModelPricing[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPer1M: 2.50,
    outputPer1M: 10.00,
    cachedInputPer1M: 1.25,
    contextWindow: '128k',
    badge: 'Phổ biến nhất',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    cachedInputPer1M: 0.075,
    contextWindow: '128k',
    badge: 'Tiết kiệm cao',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    cachedInputPer1M: 0.30,
    contextWindow: '200k',
    badge: 'Suy luận hàng đầu',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    inputPer1M: 0.80,
    outputPer1M: 4.00,
    cachedInputPer1M: 0.08,
    contextWindow: '200k',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google DeepMind',
    inputPer1M: 3.50,
    outputPer1M: 10.50,
    cachedInputPer1M: 0.875,
    contextWindow: '2M',
    badge: 'Ngữ cảnh siêu dài',
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google DeepMind',
    inputPer1M: 0.075,
    outputPer1M: 0.30,
    cachedInputPer1M: 0.018,
    contextWindow: '1M',
    badge: 'Siêu rẻ',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    cachedInputPer1M: 0.014,
    contextWindow: '64k',
    badge: 'Giá siêu hời',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    inputPer1M: 0.55,
    outputPer1M: 2.19,
    cachedInputPer1M: 0.14,
    contextWindow: '64k',
    badge: 'Suy luận mở',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta (Groq / Together)',
    inputPer1M: 0.59,
    outputPer1M: 0.79,
    contextWindow: '128k',
  },
];

const USD_TO_VND = 25450;

export function TokenCalculator() {
  const [inputTokens, setInputTokens] = useState<number>(1500);
  const [outputTokens, setOutputTokens] = useState<number>(800);
  const [cacheRatio, setCacheRatio] = useState<number>(50); // 50% cached
  const [requestsPerDay, setRequestsPerDay] = useState<number>(1000);
  const [mobileView, setMobileView] = useState<'card' | 'table'>('table');

  // Quick Preset Handlers
  const handleApplyPreset = (tier: 'dev' | 'startup' | 'enterprise') => {
    if (tier === 'dev') {
      setInputTokens(1000);
      setOutputTokens(500);
      setCacheRatio(50);
      setRequestsPerDay(500);
      toast.success('Đã áp dụng cấu hình: Cá nhân / Lập trình viên (500 lượt/ngày)');
    } else if (tier === 'startup') {
      setInputTokens(2000);
      setOutputTokens(800);
      setCacheRatio(50);
      setRequestsPerDay(5000);
      toast.success('Đã áp dụng cấu hình: Startup / Nhóm nhỏ (5.000 lượt/ngày)');
    } else {
      setInputTokens(4000);
      setOutputTokens(1500);
      setCacheRatio(50);
      setRequestsPerDay(25000);
      toast.success('Đã áp dụng cấu hình: Doanh nghiệp / Hệ thống lớn (25.000 lượt/ngày)');
    }
  };

  // Computations
  const calculations = useMemo(() => {
    return MODELS_DATA.map((model) => {
      const normalInputRatio = (100 - cacheRatio) / 100;
      const cachedRatio = cacheRatio / 100;

      const effectiveInputPricePer1M = model.cachedInputPer1M
        ? model.inputPer1M * normalInputRatio + model.cachedInputPer1M * cachedRatio
        : model.inputPer1M;

      // Cost per single request ($)
      const inputCostPerReq = (inputTokens / 1_000_000) * effectiveInputPricePer1M;
      const outputCostPerReq = (outputTokens / 1_000_000) * model.outputPer1M;
      const totalPerReq = inputCostPerReq + outputCostPerReq;

      // Without cache cost
      const noCacheInputCostPerReq = (inputTokens / 1_000_000) * model.inputPer1M;
      const noCacheTotalPerReq = noCacheInputCostPerReq + outputCostPerReq;

      // Daily and Monthly
      const dailyCost = totalPerReq * requestsPerDay;
      const monthlyCost = dailyCost * 30;

      // Savings from caching per month
      const noCacheMonthly = noCacheTotalPerReq * requestsPerDay * 30;
      const monthlySavings = Math.max(0, noCacheMonthly - monthlyCost);

      return {
        ...model,
        totalPerReq,
        dailyCost,
        monthlyCost,
        monthlySavings,
      };
    }).sort((a, b) => a.monthlyCost - b.monthlyCost);
  }, [inputTokens, outputTokens, cacheRatio, requestsPerDay]);

  const cheapest = calculations[0];
  const standardGpt4o = calculations.find((c) => c.id === 'gpt-4o') || calculations[0];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-semibold mb-3">
          <Calculator className="h-4 w-4" />
          <span>Dành cho Lập trình viên & Kỹ thuật</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text mb-4">
          Tính Chi Phí Sử Dụng AI
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Ước tính nhanh chi phí gọi API theo ngày và tháng (tỷ giá 25.450 VNĐ/USD), giúp bạn chọn mô hình AI phù hợp nhất với ngân sách.
        </p>

        {/* Quick Presets Tier Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <span className="text-xs text-text-muted font-medium mr-1">Cấu hình mẫu theo quy mô:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('dev')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-bg-surface hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            <Laptop className="w-3.5 h-3.5 text-accent" />
            <span>Cá nhân / Lập trình viên (500 lượt/ngày)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('startup')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-bg-surface hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            <Rocket className="w-3.5 h-3.5 text-accent" />
            <span>Startup / Nhóm nhỏ (5.000 lượt/ngày)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('enterprise')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-bg-surface hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <span>Doanh nghiệp (25.000 lượt/ngày)</span>
          </button>
        </div>
      </div>

      {/* Plain-Vietnamese Explainer for Token & Prompt Caching */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-border bg-bg-surface p-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <strong className="text-text block mb-1">Token (Đơn vị chữ) là gì?</strong>
          AI không tính phí theo từng câu mà tính theo từng mảnh từ (gọi là Token). Trung bình 1.000 token tương đương khoảng 650–750 chữ tiếng Việt.
        </div>
        <div className="rounded-2xl border border-border bg-bg-surface p-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <strong className="text-text block mb-1">Prompt Caching (Lưu bộ nhớ đệm) là gì?</strong>
          Khi bạn gửi lặp lại cùng một đoạn hướng dẫn dài hoặc tài liệu gốc, bộ nhớ đệm giúp tái sử dụng phần chữ tĩnh đó để giảm 50%–90% tiền đầu vào.
        </div>
      </div>

      {/* Sliders Control Panel */}
      <div className="rounded-3xl border border-border bg-bg-elevated p-6 sm:p-8 shadow-md mb-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Input Tokens */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-accent/60 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.12)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-input-tokens" className="text-xs font-bold uppercase tracking-wider text-text">
                Độ dài đầu vào (Token)
              </label>
              <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                {inputTokens.toLocaleString()}
              </span>
            </div>
            <input
              id="calc-input-tokens"
              type="range"
              min="100"
              max="20000"
              step="100"
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value, 10))}
              className="w-full accent-accent cursor-pointer transition-all"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Câu hỏi + Chỉ dẫn hệ thống + Tài liệu</p>
          </div>

          {/* Output Tokens */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-accent/60 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.12)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-output-tokens" className="text-xs font-bold uppercase tracking-wider text-text">
                Độ dài trả lời (Token)
              </label>
              <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                {outputTokens.toLocaleString()}
              </span>
            </div>
            <input
              id="calc-output-tokens"
              type="range"
              min="50"
              max="5000"
              step="50"
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value, 10))}
              className="w-full accent-accent cursor-pointer transition-all"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Độ dài câu trả lời của AI mỗi lượt</p>
          </div>

          {/* Prompt Cache Percentage */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-emerald-500/60 focus-within:shadow-[0_0_15px_rgba(16,185,129,0.12)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-cache-ratio" className="text-xs font-bold uppercase tracking-wider text-text">
                Tỷ lệ bộ nhớ đệm
              </label>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {cacheRatio}%
              </span>
            </div>
            <input
              id="calc-cache-ratio"
              type="range"
              min="0"
              max="100"
              step="5"
              value={cacheRatio}
              onChange={(e) => setCacheRatio(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer transition-all"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Phần chữ cố định được tái sử dụng</p>
          </div>

          {/* Requests Per Day */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-accent/60 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.12)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-requests-day" className="text-xs font-bold uppercase tracking-wider text-text">
                Số lượt hỏi / Ngày
              </label>
              <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                {requestsPerDay.toLocaleString()}
              </span>
            </div>
            <input
              id="calc-requests-day"
              type="range"
              min="100"
              max="50000"
              step="100"
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(parseInt(e.target.value, 10))}
              className="w-full accent-accent cursor-pointer"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Tổng số lượt gọi AI mỗi ngày</p>
          </div>
        </div>
      </div>

      {/* Highlights Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <Zap className="h-4 w-4" />
            Lựa chọn siêu tiết kiệm nhất
          </div>
          <div className="text-2xl font-extrabold text-text">
            {cheapest.name}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Chỉ <b className="font-mono">${cheapest.monthlyCost.toFixed(2)}/tháng</b> (~{(cheapest.monthlyCost * USD_TO_VND).toLocaleString('vi-VN')} đ)
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            <DollarSign className="h-4 w-4" />
            Mô hình tiêu chuẩn (GPT-4o)
          </div>
          <div className="text-2xl font-extrabold text-text">
            ${standardGpt4o.monthlyCost.toFixed(2)}
            <span className="text-xs font-normal text-text-muted">/tháng</span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Tương đương ~{(standardGpt4o.monthlyCost * USD_TO_VND).toLocaleString('vi-VN')} đ/tháng
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <TrendingDown className="h-4 w-4" />
              Tiết kiệm nhờ bộ nhớ đệm
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono">
              -90% đầu vào
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-300">
            ${standardGpt4o.monthlySavings.toFixed(2)}
            <span className="text-xs font-normal text-text-muted">/tháng</span>
          </div>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Giảm trực tiếp hóa đơn khi tái sử dụng ngữ cảnh cố định (Anthropic giảm 90%, OpenAI giảm 50%).
          </p>
        </div>
      </div>

      {/* Detailed Comparison Table / Mobile Cards */}
      <div className="rounded-3xl border border-border bg-bg-elevated overflow-hidden shadow-md">
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-text">
              Bảng So Sánh Chi Tiết Từng Mô Hình
            </h2>
            <span className="text-xs text-text-muted">Tự động xếp hạng theo chi phí tăng dần (1 USD = 25.450 VNĐ)</span>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              aria-pressed={mobileView === 'table'}
              onClick={() => setMobileView('table')}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                mobileView === 'table'
                  ? 'border-accent bg-accent/10 text-accent font-semibold'
                  : 'border-border bg-bg text-text-muted'
              }`}
              title="Xem dạng bảng cuộn"
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Bảng</span>
            </button>
            <button
              type="button"
              aria-pressed={mobileView === 'card'}
              onClick={() => setMobileView('card')}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                mobileView === 'card'
                  ? 'border-accent bg-accent/10 text-accent font-semibold'
                  : 'border-border bg-bg text-text-muted'
              }`}
              title="Xem dạng thẻ"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Thẻ</span>
            </button>
          </div>
        </div>

        {/* Mobile Card View (When active on small screens) */}
        {mobileView === 'card' && (
          <div className="p-4 space-y-3 md:hidden">
            {calculations.map((model, idx) => (
              <div key={model.id} className="p-4 rounded-2xl bg-bg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-text">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted">
                      {model.provider} • Ngữ cảnh: {model.contextWindow}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bg-surface border border-border text-text">
                    #{idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-bg-surface p-2.5 rounded-xl border border-border/80">
                  <div>
                    <span className="text-text-muted block text-[10px]">Đầu vào / 1M:</span>
                    <span className="text-text">${model.inputPer1M.toFixed(2)}</span>
                    {model.cachedInputPer1M && (
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                        Lưu đệm: ${model.cachedInputPer1M.toFixed(3)}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">Đầu ra / 1M:</span>
                    <span className="text-text">${model.outputPer1M.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-[10px] text-text-muted block">Chi phí ngày:</span>
                    <span className="font-mono text-xs text-text">${model.dailyCost.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-text">
                      ${model.monthlyCost.toFixed(2)} / tháng
                    </div>
                    <div className="text-[11px] text-text-muted font-mono">
                      ~{(model.monthlyCost * USD_TO_VND).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Horizontal Scroll Table View */}
        <div className={`overflow-x-auto ${mobileView === 'card' ? 'hidden md:block' : 'block'}`}>
          <table className="w-full text-left border-collapse text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-bg text-xs font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-6">Mô hình & Nhà phát triển</th>
                <th className="py-3.5 px-4">Giá đầu vào / 1M</th>
                <th className="py-3.5 px-4">Giá đầu ra / 1M</th>
                <th className="py-3.5 px-4">Chi phí / Ngày</th>
                <th className="py-3.5 px-6 text-right">Chi phí / Tháng (USD / VNĐ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {calculations.map((model) => (
                <tr key={model.id} className="hover:bg-bg/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted">
                      {model.provider} • Ngữ cảnh: {model.contextWindow}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-text">
                    ${model.inputPer1M.toFixed(2)}
                    {model.cachedInputPer1M && (
                      <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Lưu đệm: ${model.cachedInputPer1M.toFixed(3)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-text">
                    ${model.outputPer1M.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-text">
                    ${model.dailyCost.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono font-bold text-sm text-text">
                      ${model.monthlyCost.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono">
                      ~{(model.monthlyCost * USD_TO_VND).toLocaleString('vi-VN')} đ
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
