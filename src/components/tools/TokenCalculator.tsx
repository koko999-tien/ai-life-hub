'use client';

import { useState, useMemo } from 'react';
import { Calculator, Sparkles, DollarSign, TrendingDown, Layers, Zap, Info, ShieldCheck } from 'lucide-react';

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
    badge: 'Popular',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    cachedInputPer1M: 0.075,
    contextWindow: '128k',
    badge: 'High Value',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    cachedInputPer1M: 0.30,
    contextWindow: '200k',
    badge: 'Top Reasoning',
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
    badge: 'Huge Context',
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google DeepMind',
    inputPer1M: 0.075,
    outputPer1M: 0.30,
    cachedInputPer1M: 0.018,
    contextWindow: '1M',
    badge: 'Ultra Cheap',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    cachedInputPer1M: 0.014,
    contextWindow: '64k',
    badge: 'Budget Beast',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    inputPer1M: 0.55,
    outputPer1M: 2.19,
    cachedInputPer1M: 0.14,
    contextWindow: '64k',
    badge: 'Open Reasoning',
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
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Calculator className="h-4 w-4" />
          <span>Interactive LLM Cost Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Bảng Dự Phóng Chi Phí LLM & Token API
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Mô phỏng chính xác chi phí vận hành ứng dụng AI, đo lường tác động của Prompt Caching và tìm kiếm mô hình tối ưu nhất cho ngân sách của bạn.
        </p>
      </div>

      {/* Sliders Control Panel */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm mb-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Input Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Input Tokens / Request
              </label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                {inputTokens.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="20000"
              step="100"
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value))}
              className="w-full accent-brand-600"
            />
            <p className="text-[11px] text-gray-400 mt-1">Prompt + System Instruction + Context</p>
          </div>

          {/* Output Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Output Tokens / Request
              </label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                {outputTokens.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value))}
              className="w-full accent-brand-600"
            />
            <p className="text-[11px] text-gray-400 mt-1">Độ dài câu trả lời của AI</p>
          </div>

          {/* Prompt Cache Percentage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Tỷ lệ Prompt Caching
              </label>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {cacheRatio}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={cacheRatio}
              onChange={(e) => setCacheRatio(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <p className="text-[11px] text-gray-400 mt-1">Token tĩnh tái sử dụng trong cache</p>
          </div>

          {/* Requests Per Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Requests / Ngày
              </label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                {requestsPerDay.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(parseInt(e.target.value))}
              className="w-full accent-brand-600"
            />
            <p className="text-[11px] text-gray-400 mt-1">Tổng số lượt gọi API mỗi ngày</p>
          </div>
        </div>
      </div>

      {/* Highlights Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
            <Zap className="h-4 w-4" />
            Lựa chọn siêu tiết kiệm nhất
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">
            {cheapest.name}
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            Chỉ <b className="font-mono">${cheapest.monthlyCost.toFixed(2)}/tháng</b> (~{(cheapest.monthlyCost * USD_TO_VND).toLocaleString('vi-VN')} đ)
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">
            <DollarSign className="h-4 w-4" />
            Mô hình Flagship (GPT-4o)
          </div>
          <div className="text-2xl font-extrabold text-blue-900 dark:text-blue-200">
            ${standardGpt4o.monthlyCost.toFixed(2)}
            <span className="text-xs font-normal text-blue-700 dark:text-blue-400">/tháng</span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Tương đương ~{(standardGpt4o.monthlyCost * USD_TO_VND).toLocaleString('vi-VN')} đ/tháng
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-2">
            <TrendingDown className="h-4 w-4" />
            Tiết kiệm nhờ Prompt Caching
          </div>
          <div className="text-2xl font-extrabold text-purple-900 dark:text-purple-200">
            ${standardGpt4o.monthlySavings.toFixed(2)}
            <span className="text-xs font-normal text-purple-700 dark:text-purple-400">/tháng</span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
            Giảm trực tiếp hóa đơn API khi tái sử dụng context
          </p>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Bảng So Sánh Chi Tiết Từng Mô Hình
          </h2>
          <span className="text-xs text-gray-400">Xếp hạng theo chi phí tăng dần</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Mô hình & Nhà phát triển</th>
                <th className="py-3.5 px-4">Giá Input / 1M</th>
                <th className="py-3.5 px-4">Giá Output / 1M</th>
                <th className="py-3.5 px-4">Chi phí / Ngày</th>
                <th className="py-3.5 px-6 text-right">Chi phí / Tháng (USD / VNĐ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 font-sans">
              {calculations.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {model.provider} • Context: {model.contextWindow}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                    ${model.inputPer1M.toFixed(2)}
                    {model.cachedInputPer1M && (
                      <span className="block text-[11px] text-emerald-600 dark:text-emerald-400">
                        Cache: ${model.cachedInputPer1M.toFixed(3)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                    ${model.outputPer1M.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                    ${model.dailyCost.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                      ${model.monthlyCost.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
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
