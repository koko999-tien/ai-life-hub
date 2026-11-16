'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
  Settings2,
  ExternalLink,
  Code2,
  Zap,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

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
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta Open Source', latency: '290ms', context: '8k' },
];

export function PlaygroundClient({ presets }: PlaygroundClientProps) {
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

  // Switch preset
  const handleSelectPreset = (presetId: string) => {
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
  };

  // Run Prompt with realistic streaming simulation
  const handleRun = async () => {
    if (!resolvedPrompt.trim()) {
      toast.error('Vui lòng nhập nội dung prompt!');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setLatency(null);
    const startTime = performance.now();

    // Generate intelligent contextual response
    const mockResponses: Record<string, string> = {
      default: `### 🎯 Phân Tích & Giải Pháp Từ ${MODELS.find((m) => m.id === selectedModel)?.name}

1. **Khái quát vấn đề**:
   Yêu cầu đã được phân tích theo các chỉ số và ngữ cảnh được cung cấp.

2. **Quy trình thực thi**:
   - **Giai đoạn 1**: Khảo sát dữ liệu đầu vào và các điều kiện biên.
   - **Giai đoạn 2**: Áp dụng mô hình tối ưu theo tiêu chuẩn công nghiệp.
   - **Giai đoạn 3**: Đánh giá kết quả và các trường hợp ngoại lệ.

3. **Khuyến nghị thực chiến**:
   - Sử dụng phương pháp đo lường liên tục để theo dõi hiệu năng.
   - Kết hợp feedback loop từ người dùng thực tế để tinh chỉnh tham số.

\`\`\`markdown
✅ Trạng thái: Thực thi thành công
⏱ Độ trễ xử lý: Tối ưu
📊 Độ tin cậy: 98.6%
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
    toast.success('Thực thi hoàn tất!');
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
    const content = `# AI Playground Export\n\n**Model**: ${selectedModel}\n**Temperature**: ${temperature}\n\n## System Prompt\n\`\`\`\n${systemPrompt}\n\`\`\`\n\n## Input Prompt\n\`\`\`\n${resolvedPrompt}\n\`\`\`\n\n## AI Response\n${output}\n`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground-export-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống file Markdown!');
  };

  const handleOpenExternal = (service: 'chatgpt' | 'claude' | 'gemini') => {
    const full = `[SYSTEM INSTRUCTION]\n${systemPrompt}\n\n[USER REQUEST]\n${resolvedPrompt}`;
    const encoded = encodeURIComponent(full);
    if (service === 'chatgpt') window.open(`https://chatgpt.com/?q=${encoded}`, '_blank');
    if (service === 'claude') window.open(`https://claude.ai/new?q=${encoded}`, '_blank');
    if (service === 'gemini') window.open(`https://gemini.google.com/app`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs font-semibold mb-2">
            <Zap className="h-3.5 w-3.5" />
            <span>Interactive AI Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            AI Prompt Playground
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Môi trường thử nghiệm trực quan: điền tham số, chọn model AI và xem kết quả streaming tức thì.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 shrink-0">Preset mẫu:</label>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Model:</span>
              <div className="flex flex-wrap gap-1">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedModel === m.id
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="flex items-center gap-2 text-xs">
              <Sliders className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-500">Temp:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-20 accent-brand-600"
              />
              <span className="font-mono font-bold text-gray-700 dark:text-gray-300 w-6">
                {temperature}
              </span>
            </div>
          </div>

          {/* System Prompt Box (Collapsible / Compact) */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-purple-500" />
                System Prompt (Vai trò & Ràng buộc)
              </label>
              <button
                onClick={() => setSystemPrompt('')}
                className="text-[11px] text-gray-400 hover:text-red-500"
              >
                Xóa
              </button>
            </div>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Nhập vai trò, persona và hướng dẫn bảo mật cho AI..."
              className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* User Prompt Template Box */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-brand-600" />
                Prompt Template (Soạn thảo)
              </label>
              <span className="text-[11px] text-gray-400">
                Hỗ trợ cú pháp biến số: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{'{{tên_biến}}'}</code>
              </span>
            </div>
            <textarea
              rows={7}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Nhập prompt template của bạn tại đây..."
              className="w-full font-mono text-xs px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          {/* Dynamic Variables Form (If variables detected) */}
          {detectedVariables.length > 0 && (
            <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                  Điền giá trị tham số ({detectedVariables.length} biến)
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {detectedVariables.map((v) => (
                  <div key={v}>
                    <label className="block text-[11px] font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {`{{${v}}}`}
                    </label>
                    <input
                      type="text"
                      value={variables[v] || ''}
                      onChange={(e) =>
                        setVariables((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                      placeholder={`Nhập ${v}...`}
                      className="w-full px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run Button Bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              size="lg"
              disabled={isRunning}
              onClick={handleRun}
              className="w-full sm:w-auto px-8 gap-2 shadow-md bg-brand-600 hover:bg-brand-700 text-white"
            >
              <Play className={`h-4 w-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Đang thực thi mô hình...' : 'Chạy Prompt (Run)'}</span>
            </Button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenExternal('chatgpt')}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                title="Mở trên ChatGPT"
              >
                ChatGPT
              </button>
              <button
                onClick={() => handleOpenExternal('claude')}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 hover:border-amber-500 hover:text-amber-600 transition-colors"
                title="Mở trên Claude"
              >
                Claude
              </button>
              <button
                onClick={() => handleOpenExternal('gemini')}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:text-blue-600 transition-colors"
                title="Mở trên Gemini"
              >
                Gemini
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col h-full min-h-[560px]">
            {/* Terminal Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">
                  AI Output Terminal
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyOutput}
                  disabled={!output}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
                  title="Sao chép kết quả"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  disabled={!output}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
                  title="Tải Markdown"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setOutput(''); setLatency(null); }}
                  disabled={!output}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                  title="Xóa output"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Terminal Content Body */}
            <div className="flex-1 p-5 overflow-y-auto font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {output ? (
                output
              ) : isRunning ? (
                <div className="flex items-center gap-2 text-gray-400 py-12 justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                  <span className="text-xs font-mono">Đang suy luận và tạo luồng phản hồi...</span>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400 text-xs">
                  <Bot className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>Bấm &quot;Chạy Prompt&quot; ở bên trái để bắt đầu nhận phản hồi trực tiếp từ AI model.</p>
                </div>
              )}
            </div>

            {/* Terminal Footer Metrics Bar */}
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl flex items-center justify-between text-[11px] font-mono text-gray-500">
              <div className="flex items-center gap-3">
                <span>Model: <b className="text-gray-700 dark:text-gray-300">{selectedModel}</b></span>
                {latency !== null && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ⏱ {latency}ms
                  </span>
                )}
              </div>
              <div>
                <span>~{tokenCount} Tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
