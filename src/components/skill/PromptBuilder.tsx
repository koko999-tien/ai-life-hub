'use client'

import { Prompt, PromptVariable, PromptExample } from '@/types'
import { cn } from '@/lib/utils'
import { VARIABLE_TYPE_LABELS } from '@/lib/constants'
import { toast } from '@/components/ui'
import {
  X,
  Copy,
  Download,
  Share2,
  ChevronDown,
  Check,
  FileText,
  Code,
  Link2,
  Loader2,
  Lightbulb,
  AlertCircle,
  Bot,
  type LucideIcon,
} from 'lucide-react'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { VariableForm } from './VariableForm'

interface PromptBuilderProps {
  prompt: Prompt
  skillId: string
  onClose: () => void
}

const VARIABLE_TYPE_ICONS: Record<PromptVariable['type'], LucideIcon> = {
  text: FileText,
  textarea: FileText,
  select: ChevronDown,
  multiselect: ChevronDown,
  number: Code,
  date: FileText,
}

function generatePrompt(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

function generateMarkdownExport(prompt: Prompt, variables: Record<string, string>, generatedPrompt: string): string {
  const frontmatter = [
    '---',
    `title: "${prompt.name}"`,
    `skillId: "${prompt.skillId}"`,
    `promptId: "${prompt.id}"`,
    `generatedAt: "${new Date().toISOString()}"`,
    'variables:',
    ...Object.entries(variables).map(([key, value]) => `  ${key}: "${value.replace(/"/g, '\\"')}"`),
    '---',
    '',
    generatedPrompt,
  ].join('\n')
  return frontmatter
}

function generateJSONExport(prompt: Prompt, variables: Record<string, string>, generatedPrompt: string): string {
  const data = {
    prompt: {
      id: prompt.id,
      name: prompt.name,
      skillId: prompt.skillId,
    },
    variables,
    generatedPrompt,
    generatedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

function generateShareUrl(prompt: Prompt, variables: Record<string, string>): string {
  const params = new URLSearchParams()
  params.set('skill', prompt.skillId)
  params.set('prompt', prompt.id)
  Object.entries(variables).forEach(([key, value]) => {
    if (value) params.set(`var_${key}`, value)
  })
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/builder?${params.toString()}`
}

export function PromptBuilder({ prompt, skillId, onClose }: PromptBuilderProps) {
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    prompt.variables?.forEach((v) => {
      if (v.default) initial[v.name] = v.default
    })
    return initial
  })
  const [selectedExample, setSelectedExample] = useState<number | null>(null)
  const [copied, setCopied] = useState<'prompt' | 'markdown' | 'json' | 'url' | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generatedPrompt = useMemo(() => generatePrompt(prompt.template, variables), [prompt.template, variables])

  // Apply example when selected
  useEffect(() => {
    if (selectedExample !== null && prompt.examples[selectedExample]) {
      const example = prompt.examples[selectedExample]
      setVariables((prev) => ({ ...prev, ...example.inputs }))
    }
  }, [selectedExample, prompt.examples])

  const handleVariableChange = useCallback((name: string, value: string) => {
    setVariables((prev) => ({ ...prev, [name]: value }))
    setSelectedExample(null)
  }, [])

  const handleCopy = useCallback(async (type: 'prompt' | 'markdown' | 'json' | 'url') => {
    let content: string
    switch (type) {
      case 'prompt':
        content = generatedPrompt
        break
      case 'markdown':
        content = generateMarkdownExport(prompt, variables, generatedPrompt)
        break
      case 'json':
        content = generateJSONExport(prompt, variables, generatedPrompt)
        break
      case 'url':
        content = generateShareUrl(prompt, variables)
        break
    }
    await navigator.clipboard.writeText(content)
    setCopied(type)
    toast.success(`Đã sao chép ${type === 'prompt' ? 'Prompt' : type.toUpperCase()} vào clipboard!`)
    setTimeout(() => setCopied(null), 2000)
  }, [prompt, variables, generatedPrompt])

  const handleDownload = useCallback((type: 'markdown' | 'json') => {
    const content = type === 'markdown'
      ? generateMarkdownExport(prompt, variables, generatedPrompt)
      : generateJSONExport(prompt, variables, generatedPrompt)
    const blob = new Blob([content], { type: type === 'markdown' ? 'text/markdown' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prompt.name.replace(/\s+/g, '-').toLowerCase()}.${type === 'markdown' ? 'md' : 'json'}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Đã tải xuống file .${type === 'markdown' ? 'md' : 'json'}`)
  }, [prompt, variables, generatedPrompt])

  const handleLaunchAI = useCallback(async (provider: 'chatgpt' | 'claude' | 'gemini') => {
    if (!generatedPrompt) return
    await navigator.clipboard.writeText(generatedPrompt)
    toast.success(`Đã copy prompt! Đang mở ${provider === 'chatgpt' ? 'ChatGPT' : provider === 'claude' ? 'Claude' : 'Gemini'}...`)
    const urls = {
      chatgpt: 'https://chatgpt.com/',
      claude: 'https://claude.ai/new',
      gemini: 'https://gemini.google.com/app',
    }
    window.open(urls[provider], '_blank')
  }, [generatedPrompt])

  const requiredVariables = prompt.variables?.filter((v) => v.required) ?? []
  const missingRequired = requiredVariables.filter((v) => !variables[v.name]?.trim())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-bg-elevated rounded-3xl border border-border shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-bg-elevated/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-bold text-text text-base sm:text-lg">{prompt.name}</h2>
              <p className="text-xs text-text-muted">{skillId} skill</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-bg border border-border text-text-muted hover:text-text transition-colors"
            aria-label="Close prompt builder"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Example Selector */}
              {prompt.examples && prompt.examples.length > 0 && (
                <div className="bg-bg rounded-2xl p-4 border border-border">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent" aria-hidden="true" />
                    Tải dữ liệu mẫu (Example)
                  </label>
                  <select
                    value={selectedExample !== null ? String(selectedExample) : ''}
                    onChange={(e) => setSelectedExample(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg-surface text-text text-sm focus:border-accent focus:outline-none transition-colors"
                    aria-label="Select example"
                  >
                    <option value="">-- Chọn dữ liệu mẫu ví dụ --</option>
                    {prompt.examples.map((example, index) => (
                      <option key={index} value={String(index)}>
                        {example.context || `Ví dụ mẫu ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  {selectedExample !== null && (
                    <button
                      onClick={() => setSelectedExample(null)}
                      className="mt-2 text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                      Xóa mẫu đã chọn
                    </button>
                  )}
                </div>
              )}

              {/* Variable Form */}
              <VariableForm
                variables={prompt.variables}
                values={variables}
                onChange={handleVariableChange}
              />

              {/* Validation Warning */}
              {missingRequired.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-amber-300 text-xs">Còn thiếu tham số bắt buộc</p>
                    <p className="text-xs text-amber-400/90 mt-0.5">
                      Vui lòng nhập: {missingRequired.map((v) => v.label).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-4 space-y-4">
                {/* Preview Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-text text-sm flex items-center gap-2">
                    <Code className="w-4 h-4 text-accent" aria-hidden="true" />
                    Bản Xem Trước Trực Tiếp
                  </h3>
                  {missingRequired.length === 0 && prompt.variables.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                      Sẵn sàng
                    </span>
                  )}
                </div>

                {/* Preview Content */}
                <div className="bg-[#05070f] rounded-2xl p-4 font-mono text-xs text-emerald-300/90 max-h-[46vh] overflow-y-auto border border-border shadow-inner leading-relaxed">
                  <pre className="whitespace-pre-wrap break-words">{generatedPrompt || 'Điền các tham số để xem bản xem trước...'}</pre>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-2 border-t border-border">
                  <button
                    onClick={() => handleCopy('prompt')}
                    disabled={missingRequired.length > 0 || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Đang tạo...
                      </>
                    ) : copied === 'prompt' ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Đã sao chép Prompt!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        Sao chép Prompt
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopy('markdown')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-text-muted" />
                      <span>Copy .md</span>
                    </button>
                    <button
                      onClick={() => handleCopy('json')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                    >
                      <Code className="w-3.5 h-3.5 text-text-muted" />
                      <span>Copy .json</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload('markdown')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5 text-text-muted" />
                      <span>Tải file .md</span>
                    </button>
                    <button
                      onClick={() => handleDownload('json')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5 text-text-muted" />
                      <span>Tải file .json</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy('url')}
                    disabled={missingRequired.length > 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                  >
                    <Link2 className="w-3.5 h-3.5 text-text-muted" />
                    <span>Sao chép Link chia sẻ Prompt</span>
                    {copied === 'url' && <Check className="w-3.5 h-3.5 text-accent" aria-hidden="true" />}
                  </button>

                  {/* Quick AI Launch */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider text-center">
                      Mở trực tiếp trên AI
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleLaunchAI('chatgpt')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Copy prompt và mở ChatGPT"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>ChatGPT</span>
                      </button>
                      <button
                        onClick={() => handleLaunchAI('claude')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                        title="Copy prompt và mở Claude"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Claude</span>
                      </button>
                      <button
                        onClick={() => handleLaunchAI('gemini')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                        title="Copy prompt và mở Gemini"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Gemini</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
