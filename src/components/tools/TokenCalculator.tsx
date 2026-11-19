'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  DollarSign,
  TrendingDown,
  Zap,
  Laptop,
  Building2,
  Rocket,
  LayoutGrid,
  TableProperties,
  ExternalLink,
  Info,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { toast } from '@/components/ui';
import {
  getCalculatorModels,
  DEFAULT_USD_TO_VND,
  EXCHANGE_RATE_VERIFIED_DISPLAY,
  REGISTRY_VERIFIED_DISPLAY,
  MODEL_STATUS_META,
  formatVndRounded,
  formatUsdPrice,
} from '@/lib/models/registry';

export function TokenCalculator() {
  const [inputTokens, setInputTokens] = useState<number>(1500);
  const [outputTokens, setOutputTokens] = useState<number>(800);
  const [cacheRatio, setCacheRatio] = useState<number>(50);
  const [requestsPerDay, setRequestsPerDay] = useState<number>(1000);
  const [usdToVndRate, setUsdToVndRate] = useState<number>(DEFAULT_USD_TO_VND);
  const [mobileView, setMobileView] = useState<'card' | 'table'>('table');

  const models = useMemo(() => getCalculatorModels(), []);

  const clampNumber = (val: number, min: number, max: number, fallback: number) => {
    if (!Number.isFinite(val)) return fallback;
    return Math.min(max, Math.max(min, Math.round(val)));
  };

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

  // Computations grounded in shared MODEL_REGISTRY
  const calculations = useMemo(() => {
    const safeInput = Math.max(0, inputTokens);
    const safeOutput = Math.max(0, outputTokens);
    const safeCache = Math.min(100, Math.max(0, cacheRatio));
    const safeRequests = Math.max(0, requestsPerDay);

    return models
      .map((model) => {
        const normalInputRatio = (100 - safeCache) / 100;
        const cachedRatio = safeCache / 100;

        const effectiveInputPricePer1M =
          model.cachedInputPricePer1M !== null
            ? model.inputPricePer1M * normalInputRatio + model.cachedInputPricePer1M * cachedRatio
            : model.inputPricePer1M;

        const inputCostPerReq = (safeInput / 1_000_000) * effectiveInputPricePer1M;
        const outputCostPerReq = (safeOutput / 1_000_000) * model.outputPricePer1M;
        const totalPerReq = inputCostPerReq + outputCostPerReq;

        const noCacheInputCostPerReq = (safeInput / 1_000_000) * model.inputPricePer1M;
        const noCacheTotalPerReq = noCacheInputCostPerReq + outputCostPerReq;

        const dailyCost = totalPerReq * safeRequests;
        const monthlyCost = dailyCost * 30;

        const noCacheMonthly = noCacheTotalPerReq * safeRequests * 30;
        const monthlySavings = Math.max(0, noCacheMonthly - monthlyCost);

        return {
          ...model,
          totalPerReq,
          dailyCost,
          monthlyCost,
          monthlySavings,
        };
      })
      .sort((a, b) => a.monthlyCost - b.monthlyCost);
  }, [models, inputTokens, outputTokens, cacheRatio, requestsPerDay]);

  const cheapest = calculations[0];
  const standardGpt4o = calculations.find((c) => c.id === 'gpt-4o') || calculations[0];
  const claudeSonnet = calculations.find((c) => c.id === 'claude-sonnet-4-6') || standardGpt4o;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-semibold mb-3">
          <Calculator className="h-4 w-4" />
          <span>Bảng Giá Xác Thực • Cập nhật {REGISTRY_VERIFIED_DISPLAY}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text mb-4">
          Tính Chi Phí Sử Dụng AI
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Ước tính chi phí gọi API theo lượt, ngày và tháng từ sổ đăng ký mô hình dùng chung (tỷ giá ước tính mặc định{' '}
          <strong className="text-text font-mono">25.450 VNĐ/USD</strong>, có thể tự điều chỉnh bên dưới).
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
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-border bg-bg-surface p-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <strong className="text-text block mb-1">Token (Đơn vị chữ) là gì?</strong>
          AI không tính phí theo từng câu mà tính theo từng mảnh từ (gọi là Token). Trung bình 1.000 token tương đương khoảng 650–750 chữ tiếng Việt; biểu giá hãng công bố trên mỗi 1.000.000 token.
        </div>
        <div className="rounded-2xl border border-border bg-bg-surface p-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <strong className="text-text block mb-1">Prompt Caching (Lưu bộ nhớ đệm) là gì?</strong>
          Khi bạn gửi lặp lại cùng một đoạn hướng dẫn hệ thống hoặc tài liệu gốc, bộ nhớ đệm giúp tái sử dụng phần chữ cố định đó để giảm 50%–90% chi phí token đầu vào.
        </div>
      </div>

      {/* Sliders + Exact Number Inputs Control Panel */}
      <div className="rounded-3xl border border-border bg-bg-elevated p-6 sm:p-8 shadow-md mb-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Input Tokens */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-accent/60 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label htmlFor="calc-input-tokens" className="text-xs font-bold uppercase tracking-wider text-text">
                Độ dài đầu vào (Token)
              </label>
              <input
                type="number"
                aria-label="Nhập số token đầu vào"
                min={0}
                max={1000000}
                step={100}
                value={inputTokens}
                onChange={(e) => setInputTokens(clampNumber(Number(e.target.value), 0, 1000000, 1500))}
                className="w-24 text-right font-mono text-xs font-bold text-accent px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 focus:outline-hidden focus:border-accent"
              />
            </div>
            <input
              id="calc-input-tokens"
              type="range"
              min="100"
              max="20000"
              step="100"
              value={Math.min(20000, Math.max(100, inputTokens))}
              onChange={(e) => setInputTokens(parseInt(e.target.value, 10))}
              className="w-full accent-accent cursor-pointer transition-all"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Câu hỏi + Chỉ dẫn hệ thống + Tài liệu</p>
          </div>

          {/* Output Tokens */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-accent/60 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label htmlFor="calc-output-tokens" className="text-xs font-bold uppercase tracking-wider text-text">
                Độ dài trả lời (Token)
              </label>
              <input
                type="number"
                aria-label="Nhập số token đầu ra"
                min={0}
                max={128000}
                step={50}
                value={outputTokens}
                onChange={(e) => setOutputTokens(clampNumber(Number(e.target.value), 0, 128000, 800))}
                className="w-24 text-right font-mono text-xs font-bold text-accent px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 focus:outline-hidden focus:border-accent"
              />
            </div>
            <input
              id="calc-output-tokens"
              type="range"
              min="50"
              max="5000"
              step="50"
              value={Math.min(5000, Math.max(50, outputTokens))}
              onChange={(e) => setOutputTokens(parseInt(e.target.value, 10))}
              className="w-full accent-accent cursor-pointer transition-all"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Độ dài câu trả lời của AI mỗi lượt</p>
          </div>

          {/* Prompt Cache Percentage */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-emerald-500/60 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label htmlFor="calc-cache-ratio" className="text-xs font-bold uppercase tracking-wider text-text">
                Tỷ lệ bộ nhớ đệm (%)
              </label>
              <input
                type="number"
                aria-label="Nhập tỷ lệ phần trăm bộ nhớ đệm"
                min={0}
                max={100}
                step={5}
                value={cacheRatio}
                onChange={(e) => setCacheRatio(clampNumber(Number(e.target.value), 0, 100, 50))}
                className="w-20 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 focus:outline-hidden focus:border-emerald-500"
              />
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
            <p className="text-[11px] text-text-muted mt-1.5">Phần chữ cố định được đọc lại giá ưu đãi</p>
          </div>

          {/* Requests Per Day */}
          <div className="p-4 rounded-2xl bg-bg border border-border/80 focus-within:border-accent/60 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label htmlFor="calc-requests-day" className="text-xs font-bold uppercase tracking-wider text-text">
                Số lượt gọi / Ngày
              </label>
              <input
                type="number"
                aria-label="Nhập số lượt gọi mỗi ngày"
                min={1}
                max={1000000}
                step={100}
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(clampNumber(Number(e.target.value), 1, 1000000, 1000))}
                className="w-24 text-right font-mono text-xs font-bold text-accent px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 focus:outline-hidden focus:border-accent"
              />
            </div>
            <input
              id="calc-requests-day"
              type="range"
              min="100"
              max="50000"
              step="100"
              value={Math.min(50000, Math.max(100, requestsPerDay))}
              onChange={(e) => setRequestsPerDay(parseInt(e.target.value, 10))}
              className="w-full accent-accent cursor-pointer"
            />
            <p className="text-[11px] text-text-muted mt-1.5">Tổng số lượt gọi API mỗi ngày (nhân 30 ngày/tháng)</p>
          </div>
        </div>

        {/* Exchange Rate & Pricing Assumptions Disclosure */}
        <div className="mt-6 pt-5 border-t border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-text">Giả định tính toán:</strong> 1 tháng = 30 ngày hoạt động đều; giá tính theo chuẩn{' '}
              <span className="font-mono text-text">1.000.000 token</span> ở bậc ngữ cảnh tiêu chuẩn. Tỷ giá VNĐ mặc định (
              <span className="font-mono text-text">25.450 VNĐ/USD</span>, rà soát ngày {EXCHANGE_RATE_VERIFIED_DISPLAY}) là{' '}
              <strong className="text-text">tỷ giá ước tính cấu hình thủ công</strong> để lập dự toán, không phải tỷ giá ngân hàng thời gian thực.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
            <label htmlFor="calc-fx-rate" className="font-semibold text-text whitespace-nowrap">
              Tỷ giá (VNĐ/USD):
            </label>
            <input
              id="calc-fx-rate"
              type="number"
              min={10000}
              max={50000}
              step={50}
              value={usdToVndRate}
              onChange={(e) => setUsdToVndRate(clampNumber(Number(e.target.value), 10000, 50000, DEFAULT_USD_TO_VND))}
              className="w-24 px-2.5 py-1.5 rounded-lg bg-bg border border-border font-mono text-xs font-semibold text-text focus:outline-hidden focus:border-accent"
            />
            {usdToVndRate !== DEFAULT_USD_TO_VND && (
              <button
                type="button"
                onClick={() => setUsdToVndRate(DEFAULT_USD_TO_VND)}
                className="p-1.5 rounded-lg border border-border bg-bg hover:text-accent transition-colors"
                title="Đặt lại tỷ giá mặc định 25.450 VNĐ/USD"
                aria-label="Đặt lại tỷ giá mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Highlights Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur-xs shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <Zap className="h-4 w-4" />
            Tiết kiệm nhất trong cấu hình này
          </div>
          <div className="text-2xl font-extrabold text-text">{cheapest.name}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Chỉ <b className="font-mono">${cheapest.monthlyCost.toFixed(2)}/tháng</b> (~
            {formatVndRounded(cheapest.monthlyCost, usdToVndRate)})
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 backdrop-blur-xs shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            <DollarSign className="h-4 w-4" />
            Mốc đối chiếu (OpenAI GPT-4o)
          </div>
          <div className="text-2xl font-extrabold text-text">
            ${standardGpt4o.monthlyCost.toFixed(2)}
            <span className="text-xs font-normal text-text-muted">/tháng</span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Tương đương ~{formatVndRounded(standardGpt4o.monthlyCost, usdToVndRate)}/tháng
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 backdrop-blur-xs shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <TrendingDown className="h-4 w-4" />
              Tiết kiệm nhờ bộ nhớ đệm
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono">
              Claude Sonnet 4.6
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-300">
            ${claudeSonnet.monthlySavings.toFixed(2)}
            <span className="text-xs font-normal text-text-muted">/tháng</span>
          </div>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Tiết kiệm ~{formatVndRounded(claudeSonnet.monthlySavings, usdToVndRate)}/tháng khi tái sử dụng {cacheRatio}% ngữ cảnh đầu vào.
          </p>
        </div>
      </div>

      {/* Detailed Comparison Table / Mobile Cards */}
      <div className="rounded-3xl border border-border bg-bg-elevated overflow-hidden shadow-md">
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-text">
              Bảng So Sánh Chi Tiết {calculations.length} Mô Hình Hoạt Động
            </h2>
            <span className="text-xs text-text-muted">
              Xếp hạng theo chi phí tháng tăng dần • 1 USD = {usdToVndRate.toLocaleString('vi-VN')} VNĐ (làm tròn đồng chẵn)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/compare"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-bg hover:border-accent hover:text-accent text-xs font-semibold text-text transition-colors"
            >
              <span>Đối chiếu thông số kỹ thuật</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

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
        </div>

        {/* Mobile Card View (When active on small screens) */}
        {mobileView === 'card' && (
          <div className="p-4 space-y-3 md:hidden">
            {calculations.map((model, idx) => (
              <div key={model.id} className="p-4 rounded-2xl bg-bg border border-border space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-text">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted block mt-0.5">
                      {model.providerDisplay} • Ngữ cảnh: {model.contextWindowLabel} • API:{' '}
                      <code className="font-mono text-[11px]">{model.apiModelId}</code>
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bg-surface border border-border text-text shrink-0">
                    #{idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-bg-surface p-2.5 rounded-xl border border-border/80">
                  <div>
                    <span className="text-text-muted block text-[10px]">Đầu vào / 1M:</span>
                    <span className="text-text">{formatUsdPrice(model.inputPricePer1M)}</span>
                    {model.cachedInputPricePer1M !== null && (
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                        Lưu đệm: {formatUsdPrice(model.cachedInputPricePer1M)}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">Đầu ra / 1M:</span>
                    <span className="text-text">{formatUsdPrice(model.outputPricePer1M)}</span>
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
                      ~{formatVndRounded(model.monthlyCost, usdToVndRate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Horizontal Scroll Table View */}
        <div className={`overflow-x-auto ${mobileView === 'card' ? 'hidden md:block' : 'block'}`}>
          <table className="w-full text-left border-collapse text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-border bg-bg text-xs font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-6">Mô hình & Mã API</th>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-text">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          {model.badge}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${MODEL_STATUS_META[model.status].badgeClass}`}
                      >
                        {MODEL_STATUS_META[model.status].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-muted mt-1">
                      <span>{model.providerDisplay}</span>
                      <span>•</span>
                      <span>Ngữ cảnh: {model.contextWindowLabel}</span>
                      <span>•</span>
                      <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-bg border border-border/70">
                        {model.apiModelId}
                      </code>
                      <a
                        href={model.officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-accent hover:underline"
                        title="Xem biểu giá chính thức của hãng"
                      >
                        <span>Biểu giá hãng</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-text">
                    ${model.inputPricePer1M.toFixed(2)}
                    {model.cachedInputPricePer1M !== null && (
                      <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Lưu đệm: {formatUsdPrice(model.cachedInputPricePer1M)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-text">
                    ${model.outputPricePer1M.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-text">
                    ${model.dailyCost.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono font-bold text-sm text-text">
                      ${model.monthlyCost.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono">
                      ~{formatVndRounded(model.monthlyCost, usdToVndRate)}
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
