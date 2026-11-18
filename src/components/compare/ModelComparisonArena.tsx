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
  TableProperties,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import {
  MODEL_REGISTRY,
  MODEL_STATUS_META,
  MODEL_LICENSE_LABELS,
  MODEL_LATENCY_LABELS,
  REGISTRY_VERIFIED_DISPLAY,
  DEFAULT_USD_TO_VND,
  formatUsdPrice,
  formatVndRounded,
  getBenchmarkScore,
  type RegisteredModel,
} from '@/lib/models/registry';

export function ModelComparisonArena() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'versus' | 'advisor'>('matrix');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [includeLegacyModels, setIncludeLegacyModels] = useState<boolean>(false);

  // Side-by-side versus state
  const [modelAId, setModelAId] = useState<string>('claude-sonnet-4-6');
  const [modelBId, setModelBId] = useState<string>('deepseek-r1');
  const [versusMobileView, setVersusMobileView] = useState<'cards' | 'table'>('cards');

  // Advisor state
  const [advisorGoal, setAdvisorGoal] = useState<'coding' | 'reasoning' | 'budget' | 'long-context' | 'local'>('coding');

  const matrixBaseModels = useMemo(() => {
    if (includeLegacyModels) return MODEL_REGISTRY;
    return MODEL_REGISTRY.filter((m) => m.showInCompareDefault);
  }, [includeLegacyModels]);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return matrixBaseModels.filter((m) => {
      const matchProvider = selectedProvider === 'all' || m.provider === selectedProvider;
      const matchLicense = selectedLicense === 'all' || m.license === selectedLicense;
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.apiModelId.toLowerCase().includes(q) ||
        m.strengths.some((s) => s.toLowerCase().includes(q)) ||
        m.bestFor.toLowerCase().includes(q);
      return matchProvider && matchLicense && matchSearch;
    });
  }, [matrixBaseModels, selectedProvider, selectedLicense, searchQuery]);

  const modelA: RegisteredModel = useMemo(
    () => MODEL_REGISTRY.find((m) => m.id === modelAId) || MODEL_REGISTRY[0],
    [modelAId]
  );
  const modelB: RegisteredModel = useMemo(
    () => MODEL_REGISTRY.find((m) => m.id === modelBId) || MODEL_REGISTRY[11],
    [modelBId]
  );

  const recommendedModelsForGoal = useMemo(() => {
    switch (advisorGoal) {
      case 'coding':
        return MODEL_REGISTRY.filter((m) =>
          ['claude-sonnet-4-6', 'gpt-4-1', 'qwen-2-5-coder-32b'].includes(m.id)
        );
      case 'reasoning':
        return MODEL_REGISTRY.filter((m) =>
          ['openai-o3', 'deepseek-r1', 'gemini-2-5-pro'].includes(m.id)
        );
      case 'budget':
        return MODEL_REGISTRY.filter((m) =>
          ['deepseek-v3', 'gemini-2-5-flash', 'gemini-2-5-flash-lite'].includes(m.id)
        );
      case 'long-context':
        return MODEL_REGISTRY.filter((m) =>
          ['gemini-2-5-pro', 'claude-sonnet-4-6', 'gpt-4-1'].includes(m.id)
        );
      case 'local':
        return MODEL_REGISTRY.filter((m) =>
          ['qwen-2-5-coder-32b', 'llama-3-3-70b', 'deepseek-r1'].includes(m.id)
        );
    }
  }, [advisorGoal]);

  const sweA = getBenchmarkScore(modelA, 'swe_bench_verified');
  const sweB = getBenchmarkScore(modelB, 'swe_bench_verified');
  const mathA = getBenchmarkScore(modelA, 'math_500');
  const mathB = getBenchmarkScore(modelB, 'math_500');

  return (
    <div className="space-y-8">
      {/* Verification & Transparency Banner */}
      <div className="rounded-2xl border border-border bg-bg-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-text">
              Dữ liệu đồng bộ từ Danh bạ Mô hình Xác thực (Cập nhật ngày {REGISTRY_VERIFIED_DISPLAY})
            </p>
            <p className="leading-relaxed">
              Giá token (USD trên mỗi 1.000.000 token), mã API chính thức và giới hạn ngữ cảnh được đối chiếu từ tài liệu gốc của từng hãng và dùng chung với{' '}
              <Link href="/tools/token-calculator" className="text-accent font-medium hover:underline">
                Bảng tính chi phí AI
              </Link>
              . Chỉ hiển thị điểm đánh giá (benchmark) khi có nguồn công bố chính thức kèm phiên bản và phương pháp đo.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Chế độ so sánh mô hình AI"
        className="flex border-b border-border gap-2 sm:gap-6 overflow-x-auto pb-1"
      >
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
          <div className="card p-4 sm:p-6 bg-bg-surface border-border space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[240px]">
                <input
                  type="text"
                  aria-label="Tìm kiếm mô hình AI"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên mô hình, mã API (vd: gpt-4.1, gemini-2.5, deepseek)..."
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
                  <option value="Proprietary">Thương mại (Qua API)</option>
                  <option value="Open Weights">Trọng số mở (Tự triển khai được)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/70 text-xs text-text-muted">
              <span>
                Đang hiển thị <strong className="text-text">{filteredModels.length}</strong> mô hình
                {!includeLegacyModels && ' chủ lực đang hoạt động ổn định'}
              </span>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeLegacyModels}
                  onChange={(e) => setIncludeLegacyModels(e.target.checked)}
                  className="rounded border-border accent-accent h-3.5 w-3.5"
                />
                <span>Hiển thị cả biến thể nhỏ &amp; mô hình thế hệ cũ / ngừng hỗ trợ</span>
              </label>
            </div>
          </div>

          {/* Model Cards Grid */}
          {filteredModels.length === 0 ? (
            <div className="card p-10 bg-bg-surface border-border text-center space-y-3">
              <p className="text-sm text-text-muted">
                Không tìm thấy mô hình AI nào khớp với bộ lọc hiện tại.
              </p>
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
              {filteredModels.map((m) => {
                const statusMeta = MODEL_STATUS_META[m.status];
                return (
                  <div
                    key={m.id}
                    className="card p-6 bg-bg-surface border-border hover:border-accent/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                              {m.providerDisplay}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-text group-hover:text-accent transition-colors">
                            {m.name}
                          </h3>
                          <code className="text-[11px] font-mono text-text-muted block mt-0.5">
                            API ID: {m.apiModelId}
                          </code>
                        </div>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border font-medium text-right shrink-0 ${
                            m.license === 'Open Weights'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {MODEL_LICENSE_LABELS[m.license]}
                        </span>
                      </div>

                      {m.statusNote && (
                        <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{m.statusNote}</span>
                        </div>
                      )}

                      <p className="text-xs text-text-muted mb-4 font-medium leading-relaxed">
                        🎯 <strong className="text-text">Phù hợp nhất cho:</strong> {m.bestFor}
                      </p>

                      {/* Key Stats Bar */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-bg border border-border/80 mb-3 text-center">
                        <div>
                          <span className="text-[10px] text-text-muted block">Ngữ cảnh / Ra</span>
                          <strong className="text-xs sm:text-sm text-text font-mono">
                            {m.contextWindowLabel} / {m.maxOutputLabel}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block">Đầu vào / 1M</span>
                          <strong className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                            {formatUsdPrice(m.inputPricePer1M)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block">Đầu ra / 1M</span>
                          <strong className="text-xs sm:text-sm text-text font-mono">
                            {formatUsdPrice(m.outputPricePer1M)}
                          </strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted mb-4 px-1">
                        <span>
                          Lưu bộ nhớ đệm:{' '}
                          <strong className="text-text font-mono">
                            {m.cachedInputPricePer1M !== null
                              ? `${formatUsdPrice(m.cachedInputPricePer1M)} / 1M`
                              : 'Tùy hạ tầng'}
                          </strong>
                        </span>
                        <a
                          href={m.officialDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-medium"
                        >
                          <span>Bảng giá gốc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Verified Benchmarks (only when primary source exists) */}
                      {m.benchmarks.length > 0 && (
                        <div className="space-y-2.5 mb-4 p-3 rounded-xl bg-bg/60 border border-border/60 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-text-muted">
                            <span className="font-semibold uppercase tracking-wider text-text">
                              Điểm công bố có nguồn gốc
                            </span>
                            <span>{m.benchmarks[0].evaluatedAt}</span>
                          </div>
                          {m.benchmarks.map((b) => (
                            <div key={b.benchmarkId} className="space-y-1">
                              <div className="flex justify-between items-center text-text-muted font-mono">
                                <a
                                  href={b.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-accent hover:underline font-sans text-[11px]"
                                  title={`${b.sourceName} (${b.modelVersion}) — ${b.methodology}`}
                                >
                                  {b.benchmarkName}:
                                </a>
                                <strong className="text-text font-semibold">
                                  {b.score}
                                  {b.unit}
                                </strong>
                              </div>
                              <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/60">
                                <div
                                  className="h-full bg-accent rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, Math.max(0, b.score))}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Strengths list */}
                      <div className="space-y-1 mb-4">
                        <span className="text-[11px] font-semibold text-text uppercase">
                          Điểm nổi bật:
                        </span>
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
                        {MODEL_LATENCY_LABELS[m.latencyCategory]}
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
                );
              })}
            </div>
          )}

          {/* Benchmark Methodology Note */}
          <div className="rounded-2xl border border-border/80 bg-bg p-4 text-xs text-text-muted leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-text">Lưu ý về tính minh bạch của điểm đánh giá (Benchmark):</strong>{' '}
              Các chỉ số như SWE-bench Verified, MATH-500 và MMLU được trích xuất từ báo cáo kỹ thuật gốc của nhà phát triển tại thời điểm phát hành phiên bản tương ứng. Các mô hình không công bố cùng thang chuẩn sẽ được để trống thay vì nội suy hoặc ước đoán.
            </div>
          </div>
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
                {MODEL_REGISTRY.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) {m.status !== 'stable' ? `— ${MODEL_STATUS_META[m.status].label}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-5 bg-bg-surface border-border space-y-2">
              <label
                htmlFor="compare-model-b"
                className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 block"
              >
                Chọn Mô Hình B:
              </label>
              <select
                id="compare-model-b"
                value={modelBId}
                onChange={(e) => setModelBId(e.target.value)}
                className="w-full p-3 rounded-lg bg-bg border border-border text-text font-bold focus:border-accent focus:outline-none"
              >
                {MODEL_REGISTRY.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) {m.status !== 'stable' ? `— ${MODEL_STATUS_META[m.status].label}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deprecation / Shutdown Warning if applicable */}
          {(modelA.status === 'deprecated' ||
            modelA.status === 'shutdown' ||
            modelB.status === 'deprecated' ||
            modelB.status === 'shutdown') && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Lưu ý trạng thái vòng đời mô hình:</p>
                {(modelA.status === 'deprecated' || modelA.status === 'shutdown') && (
                  <p>
                    • <strong>{modelA.name}</strong>: {modelA.statusNote || MODEL_STATUS_META[modelA.status].description}
                  </p>
                )}
                {(modelB.status === 'deprecated' || modelB.status === 'shutdown') && (
                  <p>
                    • <strong>{modelB.name}</strong>: {modelB.statusNote || MODEL_STATUS_META[modelB.status].description}
                  </p>
                )}
              </div>
            </div>
          )}

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
              {[
                {
                  label: 'Nhà phát triển & Trạng thái',
                  valA: `${modelA.providerDisplay} • ${MODEL_STATUS_META[modelA.status].label}`,
                  valB: `${modelB.providerDisplay} • ${MODEL_STATUS_META[modelB.status].label}`,
                },
                {
                  label: 'Mã API chính thức',
                  valA: modelA.apiModelId,
                  valB: modelB.apiModelId,
                },
                {
                  label: 'Độ dài ngữ cảnh tối đa',
                  valA: `${modelA.contextWindowTokens.toLocaleString('vi-VN')} token (${modelA.contextWindowLabel})`,
                  valB: `${modelB.contextWindowTokens.toLocaleString('vi-VN')} token (${modelB.contextWindowLabel})`,
                },
                {
                  label: 'Giá đầu vào / 1.000.000 token',
                  valA: `${formatUsdPrice(modelA.inputPricePer1M)} (~${formatVndRounded(modelA.inputPricePer1M, DEFAULT_USD_TO_VND)})`,
                  valB: `${formatUsdPrice(modelB.inputPricePer1M)} (~${formatVndRounded(modelB.inputPricePer1M, DEFAULT_USD_TO_VND)})`,
                },
                {
                  label: 'Giá đầu ra / 1.000.000 token',
                  valA: `${formatUsdPrice(modelA.outputPricePer1M)} (~${formatVndRounded(modelA.outputPricePer1M, DEFAULT_USD_TO_VND)})`,
                  valB: `${formatUsdPrice(modelB.outputPricePer1M)} (~${formatVndRounded(modelB.outputPricePer1M, DEFAULT_USD_TO_VND)})`,
                },
                {
                  label: 'SWE-bench Verified (Có nguồn công bố)',
                  valA: sweA ? `${sweA.score}% (${sweA.evaluatedAt})` : 'Chưa công bố cùng chuẩn',
                  valB: sweB ? `${sweB.score}% (${sweB.evaluatedAt})` : 'Chưa công bố cùng chuẩn',
                },
                {
                  label: 'Tốc độ phản hồi',
                  valA: MODEL_LATENCY_LABELS[modelA.latencyCategory],
                  valB: MODEL_LATENCY_LABELS[modelB.latencyCategory],
                },
              ].map((row) => (
                <div key={row.label} className="card p-4 bg-bg-surface border-border space-y-2">
                  <span className="text-xs font-semibold text-text-muted uppercase">{row.label}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                      <span className="text-[10px] text-accent block font-bold mb-0.5">{modelA.name}</span>
                      <strong className="text-text break-words">{row.valA}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-bg border border-border text-center">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold mb-0.5">
                        {modelB.name}
                      </span>
                      <strong className="text-text break-words">{row.valB}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comparison Table with Horizontal Scroll Wrapper */}
          <div className={`overflow-x-auto ${versusMobileView === 'cards' ? 'hidden md:block' : 'block'}`}>
            <div className="card bg-bg-surface border-border overflow-hidden min-w-[600px]">
              <div className="grid grid-cols-12 bg-bg p-4 border-b border-border text-xs font-bold uppercase text-text-muted">
                <div className="col-span-4">Tiêu chí so sánh (Xác minh {REGISTRY_VERIFIED_DISPLAY})</div>
                <div className="col-span-4 text-center text-accent">{modelA.name}</div>
                <div className="col-span-4 text-center text-purple-600 dark:text-purple-400">{modelB.name}</div>
              </div>

              <div className="divide-y divide-border text-sm">
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Trạng thái vòng đời</div>
                  <div className="col-span-4 text-center">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${MODEL_STATUS_META[modelA.status].badgeClass}`}>
                      {MODEL_STATUS_META[modelA.status].label}
                    </span>
                  </div>
                  <div className="col-span-4 text-center">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${MODEL_STATUS_META[modelB.status].badgeClass}`}>
                      {MODEL_STATUS_META[modelB.status].label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Mã API chính thức</div>
                  <div className="col-span-4 text-center font-mono text-xs text-text">{modelA.apiModelId}</div>
                  <div className="col-span-4 text-center font-mono text-xs text-text">{modelB.apiModelId}</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Nhà phát triển &amp; Bản quyền</div>
                  <div className="col-span-4 text-center text-xs text-text">
                    <strong>{modelA.providerDisplay}</strong> • {MODEL_LICENSE_LABELS[modelA.license]}
                  </div>
                  <div className="col-span-4 text-center text-xs text-text">
                    <strong>{modelB.providerDisplay}</strong> • {MODEL_LICENSE_LABELS[modelB.license]}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Ngữ cảnh / Đầu ra tối đa</div>
                  <div className="col-span-4 text-center font-mono font-bold text-text">
                    {modelA.contextWindowLabel} / {modelA.maxOutputLabel} token
                    {modelA.contextWindowTokens > modelB.contextWindowTokens && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 text-xs">Lớn hơn</span>
                    )}
                  </div>
                  <div className="col-span-4 text-center font-mono font-bold text-text">
                    {modelB.contextWindowLabel} / {modelB.maxOutputLabel} token
                    {modelB.contextWindowTokens > modelA.contextWindowTokens && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 text-xs">Lớn hơn</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Giá đầu vào (trên 1M token)</div>
                  <div className="col-span-4 text-center font-mono text-text">
                    <strong>{formatUsdPrice(modelA.inputPricePer1M)}</strong>{' '}
                    <span className="text-xs text-text-muted">
                      (~{formatVndRounded(modelA.inputPricePer1M, DEFAULT_USD_TO_VND)})
                    </span>
                    {modelA.inputPricePer1M < modelB.inputPricePer1M && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-sans font-semibold">
                        Tiết kiệm hơn
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 text-center font-mono text-text">
                    <strong>{formatUsdPrice(modelB.inputPricePer1M)}</strong>{' '}
                    <span className="text-xs text-text-muted">
                      (~{formatVndRounded(modelB.inputPricePer1M, DEFAULT_USD_TO_VND)})
                    </span>
                    {modelB.inputPricePer1M < modelA.inputPricePer1M && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-sans font-semibold">
                        Tiết kiệm hơn
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Giá đầu ra (trên 1M token)</div>
                  <div className="col-span-4 text-center font-mono text-text">
                    <strong>{formatUsdPrice(modelA.outputPricePer1M)}</strong>{' '}
                    <span className="text-xs text-text-muted">
                      (~{formatVndRounded(modelA.outputPricePer1M, DEFAULT_USD_TO_VND)})
                    </span>
                    {modelA.outputPricePer1M < modelB.outputPricePer1M && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-sans font-semibold">
                        Tiết kiệm hơn
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 text-center font-mono text-text">
                    <strong>{formatUsdPrice(modelB.outputPricePer1M)}</strong>{' '}
                    <span className="text-xs text-text-muted">
                      (~{formatVndRounded(modelB.outputPricePer1M, DEFAULT_USD_TO_VND)})
                    </span>
                    {modelB.outputPricePer1M < modelA.outputPricePer1M && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-sans font-semibold">
                        Tiết kiệm hơn
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Giá đọc bộ nhớ đệm (Cached / 1M)</div>
                  <div className="col-span-4 text-center font-mono text-xs text-text">
                    {modelA.cachedInputPricePer1M !== null
                      ? formatUsdPrice(modelA.cachedInputPricePer1M)
                      : 'Tùy hạ tầng lưu trữ'}
                  </div>
                  <div className="col-span-4 text-center font-mono text-xs text-text">
                    {modelB.cachedInputPricePer1M !== null
                      ? formatUsdPrice(modelB.cachedInputPricePer1M)
                      : 'Tùy hạ tầng lưu trữ'}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">SWE-bench Verified (Có nguồn gốc)</div>
                  <div className="col-span-4 text-center text-xs text-text">
                    {sweA ? (
                      <div>
                        <strong className="font-mono text-sm">{sweA.score}%</strong>
                        <span className="block text-[11px] text-text-muted">
                          {sweA.sourceName} ({sweA.evaluatedAt})
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-muted">Chưa công bố cùng chuẩn</span>
                    )}
                  </div>
                  <div className="col-span-4 text-center text-xs text-text">
                    {sweB ? (
                      <div>
                        <strong className="font-mono text-sm">{sweB.score}%</strong>
                        <span className="block text-[11px] text-text-muted">
                          {sweB.sourceName} ({sweB.evaluatedAt})
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-muted">Chưa công bố cùng chuẩn</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Điểm Toán học (MATH / MATH-500)</div>
                  <div className="col-span-4 text-center text-xs text-text">
                    {mathA ? (
                      <div>
                        <strong className="font-mono text-sm">{mathA.score}%</strong>
                        <span className="block text-[11px] text-text-muted">
                          {mathA.benchmarkName} • {mathA.evaluatedAt}
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-muted">Chưa công bố cùng chuẩn</span>
                    )}
                  </div>
                  <div className="col-span-4 text-center text-xs text-text">
                    {mathB ? (
                      <div>
                        <strong className="font-mono text-sm">{mathB.score}%</strong>
                        <span className="block text-[11px] text-text-muted">
                          {mathB.benchmarkName} • {mathB.evaluatedAt}
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-muted">Chưa công bố cùng chuẩn</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-4 text-text-muted font-medium">Tài liệu chính thức</div>
                  <div className="col-span-4 text-center">
                    <a
                      href={modelA.officialDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      <span>Xem tài liệu gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="col-span-4 text-center">
                    <a
                      href={modelB.officialDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <span>Xem tài liệu gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
                  { id: 'long-context', label: '📚 Đọc tài liệu siêu dài', desc: 'Ngữ cảnh 1 triệu token' },
                  { id: 'local', label: '🔒 Tự chạy nội bộ / Ngoại tuyến', desc: 'Bảo mật riêng tư trên máy chủ riêng' },
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
              Khuyến nghị hàng đầu (Chỉ chọn từ các mô hình Đang ổn định):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedModelsForGoal.map((m) => (
                  <div key={m.id} className="card p-6 bg-bg-surface border-accent/40 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/15 text-accent">
                            Khuyên dùng
                          </span>
                          <h4 className="font-bold text-lg text-text mt-1">{m.name}</h4>
                          <code className="text-[11px] font-mono text-text-muted">{m.apiModelId}</code>
                        </div>
                        <span className="text-xs text-text-muted font-medium">{m.providerDisplay}</span>
                      </div>

                      <p className="text-xs text-text-muted leading-relaxed">
                        🎯 <strong>Lý do chọn:</strong> {m.bestFor}. {m.strengths[0]}.
                      </p>

                      {advisorGoal === 'long-context' && m.id === 'gemini-2-5-pro' && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                          Lưu ý nâng cấp: Thay thế dòng lịch sử <strong>Gemini 1.5 Pro</strong> (ngữ cảnh <strong>2M</strong> token đã ngừng hoạt động) bằng ngữ cảnh chuẩn 1M tốc độ suy luận cao hơn.
                        </div>
                      )}

                    <div className="p-3 rounded-lg bg-bg border border-border text-xs space-y-1">
                      <div className="flex justify-between text-text-muted">
                        <span>Giá đầu vào / Đầu ra (1M):</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                          {formatUsdPrice(m.inputPricePer1M)} / {formatUsdPrice(m.outputPricePer1M)}
                        </strong>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Độ dài ngữ cảnh:</span>
                        <strong className="text-text font-mono">{m.contextWindowLabel} token</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/tools/token-calculator"
                      className="block text-center py-2 px-3 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent text-xs font-semibold transition-all"
                    >
                      Tính toán chi phí cho mô hình này
                    </Link>
                    <Link
                      href="/workspace"
                      className="block text-center py-2 px-3 rounded-lg bg-bg hover:bg-hover border border-border text-text text-xs font-medium transition-all"
                    >
                      Dùng thử trong AI Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
