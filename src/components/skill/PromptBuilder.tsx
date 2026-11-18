'use client'

import { Prompt } from '@/types'
import { toast } from '@/components/ui'
import { useRouter } from 'next/navigation'
import {
  X,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  Code,
  Link2,
  Lightbulb,
  AlertCircle,
  Bot,
  Play,
} from 'lucide-react'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { VariableForm } from './VariableForm'
import {
  copyToClipboardWithFallback,
  normalizeVariableValue,
  resolveCategoryName,
} from './categoryHelpers'

interface PromptBuilderProps {
  prompt: Prompt
  skillId: string
  skillName?: string
  skillSlug?: string
  onClose: () => void
}

function generatePrompt(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, rawValue] of Object.entries(variables)) {
    const value = normalizeVariableValue(rawValue)
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g')
    result = result.replace(regex, () => value)
  }
  return result
}

function generateMarkdownExport(
  prompt: Prompt,
  resolvedSkillId: string,
  variables: Record<string, string>,
  generatedPrompt: string
): string {
  const frontmatter = [
    '---',
    `title: "${prompt.name}"`,
    `skillId: "${resolvedSkillId}"`,
    `promptId: "${prompt.id}"`,
    `generatedAt: "${new Date().toISOString()}"`,
    'variables:',
    ...Object.entries(variables).map(
      ([key, value]) => `  ${key}: "${normalizeVariableValue(value).replace(/"/g, '\\"')}"`
    ),
    '---',
    '',
    generatedPrompt,
  ].join('\n')
  return frontmatter
}

function generateJSONExport(
  prompt: Prompt,
  resolvedSkillId: string,
  variables: Record<string, string>,
  generatedPrompt: string
): string {
  const data = {
    prompt: {
      id: prompt.id,
      name: prompt.name,
      skillId: resolvedSkillId,
    },
    variables,
    generatedPrompt,
    generatedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

function generateShareUrl(prompt: Prompt, resolvedSkillSlug: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/skill/${resolvedSkillSlug}#prompt-${prompt.id}`
}

export function PromptBuilder({ prompt, skillId, skillName, skillSlug, onClose }: PromptBuilderProps) {
  const router = useRouter()
  const promptVariables = useMemo(() => prompt.variables ?? [], [prompt.variables])
  const promptExamples = useMemo(() => prompt.examples ?? [], [prompt.examples])
  const resolvedSkillId = prompt.skillId || skillId
  const resolvedSkillSlug = skillSlug || resolvedSkillId
  const displaySkillName = skillName || resolveCategoryName(skillId) || skillId

  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    promptVariables.forEach((v) => {
      if (v.default !== undefined && v.default !== null) {
        initial[v.name] = normalizeVariableValue(v.default)
      }
    })
    return initial
  })
  const [selectedExample, setSelectedExample] = useState<number | null>(null)
  const [copied, setCopied] = useState<'prompt' | 'markdown' | 'json' | 'url' | null>(null)
  const [showDevExport, setShowDevExport] = useState(false)

  const generatedPrompt = useMemo(() => generatePrompt(prompt.template, variables), [prompt.template, variables])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Apply example when selected
  useEffect(() => {
    if (selectedExample !== null && promptExamples[selectedExample]) {
      const example = promptExamples[selectedExample]
      const normalizedInputs: Record<string, string> = {}
      Object.entries(example.inputs || {}).forEach(([key, val]) => {
        normalizedInputs[key] = normalizeVariableValue(val)
      })
      setVariables((prev) => ({ ...prev, ...normalizedInputs }))
    }
  }, [selectedExample, promptExamples])

  const handleVariableChange = useCallback((name: string, value: string) => {
    setVariables((prev) => ({ ...prev, [name]: value }))
    setSelectedExample(null)
  }, [])

  const handleCopy = useCallback(
    async (type: 'prompt' | 'markdown' | 'json' | 'url') => {
      let content: string
      switch (type) {
        case 'prompt':
          content = generatedPrompt
          break
        case 'markdown':
          content = generateMarkdownExport(prompt, resolvedSkillId, variables, generatedPrompt)
          break
        case 'json':
          content = generateJSONExport(prompt, resolvedSkillId, variables, generatedPrompt)
          break
        case 'url':
          content = generateShareUrl(prompt, resolvedSkillSlug)
          break
      }
      const ok = await copyToClipboardWithFallback(content)
      if (!ok) {
        toast.error('Không thể sao chép tự động. Vui lòng sao chép thủ công.')
        return
      }
      setCopied(type)
      const labels: Record<'prompt' | 'markdown' | 'json' | 'url', string> = {
        prompt: 'Đã sao chép câu lệnh vào bộ nhớ tạm!',
        markdown: 'Đã sao chép định dạng .md vào bộ nhớ tạm!',
        json: 'Đã sao chép định dạng .json vào bộ nhớ tạm!',
        url: 'Đã sao chép liên kết chia sẻ!',
      }
      toast.success(labels[type])
      setTimeout(() => setCopied(null), 2000)
    },
    [prompt, resolvedSkillId, resolvedSkillSlug, variables, generatedPrompt]
  )

  const handleDownload = useCallback(
    (type: 'markdown' | 'json') => {
      const content =
        type === 'markdown'
          ? generateMarkdownExport(prompt, resolvedSkillId, variables, generatedPrompt)
          : generateJSONExport(prompt, resolvedSkillId, variables, generatedPrompt)
      const blob = new Blob([content], { type: type === 'markdown' ? 'text/markdown' : 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${prompt.name.replace(/\s+/g, '-').toLowerCase()}.${type === 'markdown' ? 'md' : 'json'}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Đã tải xuống tệp .${type === 'markdown' ? 'md' : 'json'}`)
    },
    [prompt, resolvedSkillId, variables, generatedPrompt]
  )

  const handleLaunchAI = useCallback(
    async (provider: 'chatgpt' | 'claude' | 'gemini') => {
      if (!generatedPrompt) return
      const ok = await copyToClipboardWithFallback(generatedPrompt)
      const providerName = provider === 'chatgpt' ? 'ChatGPT' : provider === 'claude' ? 'Claude' : 'Gemini'
      if (ok) {
        toast.success(`Đã sao chép câu lệnh! Đang mở ${providerName}...`)
      } else {
        toast.info(`Đang mở ${providerName}...`)
      }
      const urls = {
        chatgpt: 'https://chatgpt.com/',
        claude: 'https://claude.ai/new',
        gemini: 'https://gemini.google.com/app',
      }
      window.open(urls[provider], '_blank', 'noopener,noreferrer')
    },
    [generatedPrompt]
  )

  const requiredVariables = promptVariables.filter((v) => v.required)
  const missingRequired = requiredVariables.filter((v) => !normalizeVariableValue(variables[v.name]).trim())

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Tùy chỉnh câu lệnh: ${prompt.name}`}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-bg-elevated rounded-3xl border border-border shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-bg-elevated/95 backdrop-blur z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-text text-base sm:text-lg truncate">{prompt.name}</h2>
              <p className="text-xs text-text-muted truncate">Kỹ năng: {displaySkillName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-bg border border-border text-text-muted hover:text-text transition-colors flex-shrink-0"
            aria-label="Đóng bảng tùy chỉnh câu lệnh"
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
              {promptExamples.length > 0 && (
                <div className="bg-bg rounded-2xl p-4 border border-border">
                  <label
                    htmlFor="prompt-builder-example-select"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4 text-accent" aria-hidden="true" />
                    Tải dữ liệu mẫu
                  </label>
                  <select
                    id="prompt-builder-example-select"
                    value={selectedExample !== null ? String(selectedExample) : ''}
                    onChange={(e) => setSelectedExample(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg-surface text-text text-sm focus:border-accent focus:outline-none transition-colors"
                    aria-label="Chọn dữ liệu mẫu"
                  >
                    <option value="">-- Chọn một ví dụ mẫu --</option>
                    {promptExamples.map((example, index) => (
                      <option key={index} value={String(index)}>
                        {example.context || `Ví dụ mẫu ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  {selectedExample !== null && (
                    <button
                      type="button"
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
              {promptVariables.length > 0 ? (
                <VariableForm
                  variables={promptVariables}
                  values={variables}
                  onChange={handleVariableChange}
                />
              ) : (
                <div className="p-4 rounded-2xl bg-bg border border-border text-sm text-text-muted">
                  Mẫu câu lệnh này không cần điền thêm thông tin. Bạn có thể sao chép và dùng ngay ở khung bên phải.
                </div>
              )}

              {/* Validation Warning */}
              {missingRequired.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-amber-300 text-xs">Còn thiếu thông tin bắt buộc</p>
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
                  {missingRequired.length === 0 && promptVariables.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                      Sẵn sàng
                    </span>
                  )}
                </div>

                {/* Preview Content */}
                <div className="bg-[#05070f] rounded-2xl p-4 font-mono text-xs text-emerald-300/90 max-h-[46vh] overflow-y-auto border border-border shadow-inner leading-relaxed">
                  <pre className="whitespace-pre-wrap break-words">
                    {generatedPrompt || 'Điền thông tin bên trái để xem câu lệnh hoàn chỉnh...'}
                  </pre>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem(
                          'ai_life_hub_workspace_draft_prompt',
                          JSON.stringify({
                            id: prompt.id,
                            title: prompt.name,
                            template: generatedPrompt,
                            categoryId: resolvedSkillId,
                          })
                        )
                      }
                      onClose()
                      router.push(`/workspace?workflow=custom-prompt&promptId=${encodeURIComponent(prompt.id)}`)
                    }}
                    disabled={missingRequired.length > 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>Chạy trực tiếp trong AI Workspace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy('prompt')}
                    disabled={missingRequired.length > 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copied === 'prompt' ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Đã sao chép câu lệnh!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        Sao chép câu lệnh
                      </>
                    )}
                  </button>

                  {/* Quick AI Launch */}
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider text-center">
                      Mở trực tiếp trên AI
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleLaunchAI('chatgpt')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Sao chép câu lệnh và mở ChatGPT"
                        aria-label="Sao chép câu lệnh và mở ChatGPT"
                      >
                        <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>ChatGPT</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLaunchAI('claude')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                        title="Sao chép câu lệnh và mở Claude"
                        aria-label="Sao chép câu lệnh và mở Claude"
                      >
                        <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Claude</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLaunchAI('gemini')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                        title="Sao chép câu lệnh và mở Gemini"
                        aria-label="Sao chép câu lệnh và mở Gemini"
                      >
                        <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Gemini</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy('url')}
                    disabled={missingRequired.length > 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                  >
                    <Link2 className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                    <span>Sao chép liên kết chia sẻ</span>
                    {copied === 'url' && <Check className="w-3.5 h-3.5 text-accent" aria-hidden="true" />}
                  </button>

                  {/* Developer Export Options (Collapsed by Default) */}
                  <div className="pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowDevExport((prev) => !prev)}
                      aria-expanded={showDevExport}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text hover:bg-hover transition-colors"
                    >
                      <span>Tùy chọn cho lập trình viên (Xuất .md / .json)</span>
                      {showDevExport ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      )}
                    </button>

                    {showDevExport && (
                      <div className="mt-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy('markdown')}
                            disabled={missingRequired.length > 0}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                            <span>Sao chép .md</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy('json')}
                            disabled={missingRequired.length > 0}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                          >
                            <Code className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                            <span>Sao chép .json</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownload('markdown')}
                            disabled={missingRequired.length > 0}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                          >
                            <FileText className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                            <span>Tải tệp .md</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload('json')}
                            disabled={missingRequired.length > 0}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg text-text hover:bg-hover transition-colors text-xs font-semibold disabled:opacity-50"
                          >
                            <FileText className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                            <span>Tải tệp .json</span>
                          </button>
                        </div>
                      </div>
                    )}
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
