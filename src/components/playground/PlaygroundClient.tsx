'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Play,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Bot,
  Cpu,
  Sliders,
  Code2,
  Zap,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';
import { BLUEPRINTS } from '@/components/agents/AgentDirectory';

interface Preset {
  id: string;
  name: string;
  skillName: string;
  category: string;
  template: string;
  systemPrompt: string;
  model: string;
  temperature: number;
}

interface PlaygroundClientProps {
  presets: Preset[];
}

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', latency: '420ms', context: '128k' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', latency: '580ms', context: '200k' },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google DeepMind', latency: '380ms', context: '1M+' },
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta (Mã nguồn mở)', latency: '290ms', context: '8k' },
];

const LEGACY_AGENT_ALIASES: Record<string, string> = {
  ['epistemic' + '-reality-agent']: 'kiem-chung-khoa-hoc-agent',
};

export function PlaygroundClient({ presets }: PlaygroundClientProps) {
  const searchParams = useSearchParams();
  const agentParam = searchParams.get('agent');

  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0]?.id || '');
  const [systemPrompt, setSystemPrompt] = useState<string>(presets[0]?.systemPrompt || '');
  const [userPrompt, setUserPrompt] = useState<string>(presets[0]?.template || '');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const lastLoadedAgentRef = useRef<string | null>(null);

  // Switch preset
  const handleSelectPreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
    const p = presets.find((item) => item.id === presetId);
    if (p) {
      setSystemPrompt(p.systemPrompt || 'Bạn là trợ lý AI chuyên nghiệp.');
      setUserPrompt(p.template);
      setTemperature(p.temperature ?? 0.7);
      setVariables({});
      setOutput('');
      setLatency(null);
    }
  }, [presets]);

  // Read ?agent={id} from query params when navigating from /agents
  useEffect(() => {
    if (!agentParam) {
      lastLoadedAgentRef.current = null;
      return;
    }
    const resolvedAgentId = LEGACY_AGENT_ALIASES[agentParam] ?? agentParam;
    if (resolvedAgentId !== agentParam && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/playground?agent=${resolvedAgentId}`);
    }
    if (lastLoadedAgentRef.current === resolvedAgentId) return;
    lastLoadedAgentRef.current = resolvedAgentId;
    const blueprint = BLUEPRINTS.find((b) => b.id === resolvedAgentId);
    if (blueprint) {
      setSystemPrompt(blueprint.systemPrompt);
      setUserPrompt(`[Yêu cầu mẫu cho ${blueprint.name}]:\nHãy thực hiện phân tích và đưa ra kế hoạch hành động cụ thể theo đúng vai trò ${blueprint.role}...`);
      setTemperature(blueprint.temperature ?? 0.7);
      if (blueprint.model.includes('claude')) setSelectedModel('claude-3-5-sonnet');
      else if (blueprint.model.includes('gemini')) setSelectedModel('gemini-1-5-pro');
      else if (blueprint.model.includes('llama')) setSelectedModel('llama-3-70b');
      else setSelectedModel('gpt-4o');
      setSelectedPresetId('');
      toast.success(`Đã nạp cấu hình trợ lý AI: ${blueprint.name}`);
    } else {
      const matchingPreset = presets.find((p) => p.id === resolvedAgentId);
      if (matchingPreset) {
        handleSelectPreset(matchingPreset.id);
      }
    }
  }, [agentParam, presets, handleSelectPreset]);

  // Auto-detect variables from userPrompt: {{var_name}}
  const detectedVariables = useMemo(() => {
    const matches = userPrompt.match(/\{\{([^}]+)\}\}/g) || [];
    return Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, '').trim())));
  }, [userPrompt]);

  // Compute resolved prompt with filled variables
  const resolvedPrompt = useMemo(() => {
    let result = userPrompt;
    for (const v of detectedVariables) {
      const val = variables[v];
      if (val !== undefined && val !== '') {
        result = result.replaceAll(`{{${v}}}`, val);
      }
    }
    return result;
  }, [userPrompt, detectedVariables, variables]);

  // Rough token estimation (1 token ≈ 4 characters)
  useEffect(() => {
    const totalChars = (systemPrompt + resolvedPrompt + output).length;
    setTokenCount(Math.ceil(totalChars / 4));
  }, [systemPrompt, resolvedPrompt, output]);

  // Run Prompt with realistic streaming simulation
  const handleRun = async () => {
    if (!resolvedPrompt.trim()) {
      toast.error('Vui lòng nhập nội dung câu lệnh!');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setLatency(null);
    const startTime = performance.now();

    const selectedModelName = MODELS.find((m) => m.id === selectedModel)?.name || 'AI';

    // Simulated demo response so users can preview the structure safely
    const mockResponses: Record<string, string> = {
      default: `### 🎯 Phản Hồi Mô Phỏng (Demo) — Cấu hình ${selectedModelName}

1. **Tóm tắt yêu cầu đã nhận**:
   Hệ thống đã ghép đầy đủ vai trò nền và các biến số bạn vừa điền vào câu lệnh hoàn chỉnh.

2. **Quy trình xử lý đề xuất**:
   - **Bước 1**: Xác định mục tiêu chính và phạm vi dữ liệu đầu vào.
   - **Bước 2**: Triển khai giải pháp theo từng phần rõ ràng, dễ kiểm tra.
   - **Bước 3**: Rà soát các rủi ro hoặc trường hợp ngoại lệ trước khi áp dụng.

3. **Gợi ý chạy với AI thật**:
   - Bấm các nút **ChatGPT**, **Claude** hoặc **Gemini** ở góc dưới bên trái để gửi câu lệnh này sang AI thật và nhận kết quả trực tiếp.

\`\`\`text
✅ Chế độ: Chạy thử mô phỏng (Demo)
🎚 Độ sáng tạo: ${temperature}
💬 Độ dài ước tính: ~${Math.ceil((systemPrompt + resolvedPrompt).length / 4)} đơn vị chữ (token)
\`\`\`
`,
    };

    const textToStream = mockResponses.default;
    let current = '';
    const words = textToStream.split(' ');

    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 35));
      current += (i === 0 ? '' : ' ') + words[i];
      setOutput(current);
    }

    const elapsed = Math.round(performance.now() - startTime);
    setLatency(elapsed);
    setIsRunning(false);
    toast.success('Đã hoàn tất chạy thử mô phỏng!');
  };

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Đã sao chép kết quả!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!output) return;
    const content = `# Kết quả Khu Thử Nghiệm AI (Demo)\n\n**Mô hình**: ${selectedModel}\n**Độ sáng tạo**: ${temperature}\n\n## Chỉ dẫn nền (System Prompt)\n\`\`\`\n${systemPrompt}\n\`\`\`\n\n## Câu lệnh đầu vào\n\`\`\`\n${resolvedPrompt}\n\`\`\`\n\n## Kết quả mô phỏng\n${output}\n`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ket-qua-thu-nghiem-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống tệp Markdown!');
  };

  const handleOpenExternal = (service: 'chatgpt' | 'claude' | 'gemini') => {
    const full = `[CHỈ DẪN NỀN]\n${systemPrompt}\n\n[YÊU CẦU CỦA TÔI]\n${resolvedPrompt}`;
    const encoded = encodeURIComponent(full);
    if (service === 'chatgpt') window.open(`https://chatgpt.com/?q=${encoded}`, '_blank', 'noopener,noreferrer');
    if (service === 'claude') window.open(`https://claude.ai/new?q=${encoded}`, '_blank', 'noopener,noreferrer');
    if (service === 'gemini') {
      navigator.clipboard?.writeText(full).catch(() => {});
      toast.info('Đã sao chép câu lệnh vào bộ nhớ tạm! Hãy dán vào Gemini.');
      window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Zap className="h-3.5 w-3.5" />
            <span>Chạy thử mô phỏng (Demo)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text tracking-tight">
            Khu Thử Nghiệm AI
          </h1>
          <p className="text-sm text-text-muted mt-1 leading-relaxed max-w-2xl">
            Ghép câu lệnh, điền biến số và xem luồng phản hồi mô phỏng an toàn ngay tại đây — hoặc bấm nút <strong>ChatGPT / Claude / Gemini</strong> để gửi câu lệnh sang AI thật.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pg-preset" className="text-xs font-semibold text-text-muted shrink-0">
            Mẫu gợi ý:
          </label>
          <select
            id="pg-preset"
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-bg text-text focus:outline-none focus:border-accent"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.skillName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Prompt Configuration & Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Model & Parameters Bar */}
          <div className="p-4 rounded-2xl border border-border bg-bg-elevated shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Cpu className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-text">Mô hình:</span>
              <div className="flex flex-wrap gap-1">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={selectedModel === m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedModel === m.id
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-bg border border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="flex items-center gap-2 text-xs">
              <Sliders className="h-3.5 w-3.5 text-text-muted" />
              <label htmlFor="pg-temp" className="text-text-muted" title="0 = Chính xác, 1 = Sáng tạo">
                Độ sáng tạo:
              </label>
              <input
                id="pg-temp"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                title="0 = Chính xác, 1 = Sáng tạo"
                className="w-20 accent-accent cursor-pointer"
              />
              <span className="font-mono font-bold text-text w-6">
                {temperature}
              </span>
            </div>
          </div>

          {/* System Prompt Box */}
          <div className="rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="pg-system-prompt" className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-accent" />
                Vai trò & Ràng buộc nền (System Prompt)
              </label>
              <button
                type="button"
                onClick={() => setSystemPrompt('')}
                className="text-[11px] text-text-muted hover:text-red-500 transition-colors"
              >
                Xóa
              </button>
            </div>
            <textarea
              id="pg-system-prompt"
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Nhập vai trò, phong cách và quy tắc giới hạn cho AI..."
              className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
            />
          </div>

          {/* User Prompt Template Box */}
          <div className="rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              <label htmlFor="pg-user-prompt" className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-accent" />
                Nội dung câu lệnh (Soạn thảo)
              </label>
              <span className="text-[11px] text-text-muted">
                Hỗ trợ gắn biến số: <code className="bg-bg border border-border px-1 py-0.5 rounded text-accent font-mono">{'{{tên_biến}}'}</code>
              </span>
            </div>
            <textarea
              id="pg-user-prompt"
              rows={7}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Nhập câu lệnh mẫu của bạn tại đây..."
              className="w-full font-mono text-xs px-3 py-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent leading-relaxed resize-y"
            />
          </div>

          {/* Dynamic Variables Form (If variables detected) */}
          {detectedVariables.length > 0 && (
            <div className="p-4 rounded-2xl border border-accent/30 bg-accent/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  Điền thông tin biến số ({detectedVariables.length} mục)
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {detectedVariables.map((v) => (
                  <div key={v}>
                    <label htmlFor={`pg-var-${v}`} className="block text-[11px] font-mono font-medium text-text-muted mb-1">
                      {`{{${v}}}`}
                    </label>
                    <input
                      id={`pg-var-${v}`}
                      type="text"
                      value={variables[v] || ''}
                      onChange={(e) =>
                        setVariables((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                      placeholder={`Nhập ${v}...`}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-bg text-xs text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run Button Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Button
              size="lg"
              disabled={isRunning}
              onClick={handleRun}
              className="w-full sm:w-auto px-8 gap-2 shadow-md bg-accent hover:bg-accent-hover text-white active:scale-[0.98] transition-all"
            >
              <Play className={`h-4 w-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Đang chạy mô phỏng...' : 'Chạy thử mô phỏng (Demo)'}</span>
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted hidden sm:inline">Chạy thật trên:</span>
              <button
                type="button"
                onClick={() => handleOpenExternal('chatgpt')}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-bg hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Mở câu lệnh này trên ChatGPT"
              >
                ChatGPT
              </button>
              <button
                type="button"
                onClick={() => handleOpenExternal('claude')}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-bg hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                title="Mở câu lệnh này trên Claude"
              >
                Claude
              </button>
              <button
                type="button"
                onClick={() => handleOpenExternal('gemini')}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-bg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Sao chép câu lệnh và mở Gemini"
              >
                Gemini
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Output Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="rounded-2xl border border-border bg-bg-elevated shadow-sm flex flex-col h-full min-h-[560px]">
            {/* Panel Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-bg/80 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-bold text-text ml-2">
                  Kết Quả Mô Phỏng (Demo)
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Sao chép kết quả"
                  onClick={handleCopyOutput}
                  disabled={!output}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors disabled:opacity-30"
                  title="Sao chép kết quả"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  aria-label="Tải xuống Markdown"
                  onClick={handleDownloadMarkdown}
                  disabled={!output}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors disabled:opacity-30"
                  title="Tải xuống tệp Markdown"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Xóa kết quả"
                  onClick={() => { setOutput(''); setLatency(null); }}
                  disabled={!output}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-500 transition-colors disabled:opacity-30"
                  title="Xóa kết quả"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Output Content Body */}
            <div className="flex-1 p-5 overflow-y-auto font-sans text-sm text-text leading-relaxed whitespace-pre-wrap">
              {output ? (
                output
              ) : isRunning ? (
                <div className="flex items-center gap-2 text-text-muted py-12 justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="text-xs font-mono text-accent">Đang tạo luồng phản hồi mô phỏng...</span>
                </div>
              ) : (
                <div className="text-center py-20 text-text-muted text-xs space-y-2 px-4">
                  <Bot className="h-8 w-8 mx-auto mb-2 opacity-40 text-accent" />
                  <p>
                    Bấm <strong>&quot;Chạy thử mô phỏng (Demo)&quot;</strong> ở bên trái để xem luồng phản hồi mẫu, hoặc bấm <strong>ChatGPT / Claude / Gemini</strong> để gửi câu lệnh sang AI thật.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Metrics Bar */}
            <div className="px-4 py-2.5 border-t border-border bg-bg/80 rounded-b-2xl flex items-center justify-between text-[11px] font-mono text-text-muted">
              <div className="flex items-center gap-3">
                <span>Mô hình: <b className="text-text">{selectedModel}</b></span>
                {latency !== null && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ⏱ {latency}ms
                  </span>
                )}
              </div>
              <div>
                <span>~{tokenCount} đơn vị chữ (token)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
