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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{prompt.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{skillId} skill</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    Load Example
                  </label>
                  <select
                    value={selectedExample !== null ? String(selectedExample) : ''}
                    onChange={(e) => setSelectedExample(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                    aria-label="Select example"
                  >
                    <option value="">-- Choose an example --</option>
                    {prompt.examples.map((example, index) => (
                      <option key={index} value={String(index)}>
                        {example.context || `Example ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  {selectedExample !== null && (
                    <button
                      onClick={() => setSelectedExample(null)}
                      className="mt-2 text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                      Clear example
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
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300">Missing required variables</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Please fill in: {missingRequired.map((v) => v.label).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-20 space-y-4">
                {/* Preview Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Code className="w-5 h-5" aria-hidden="true" />
                    Live Preview
                  </h3>
                  {missingRequired.length === 0 && prompt.variables.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                      Ready
                    </span>
                  )}
                </div>

                {/* Preview Content */}
                <div className="bg-slate-900/95 rounded-xl p-4 font-mono text-sm text-slate-100 max-h-[50vh] overflow-y-auto border border-slate-700">
                  <pre className="whitespace-pre-wrap break-words">{generatedPrompt || 'Fill in variables to see preview'}</pre>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleCopy('prompt')}
                    disabled={missingRequired.length > 0 || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Generating...
                      </>
                    ) : copied === 'prompt' ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        Copy Prompt
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopy('markdown')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">.md</span>
                    </button>
                    <button
                      onClick={() => handleCopy('json')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <Code className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">.json</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload('markdown')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">Download .md</span>
                    </button>
                    <button
                      onClick={() => handleDownload('json')}
                      disabled={missingRequired.length > 0}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">Download .json</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy('url')}
                    disabled={missingRequired.length > 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    <Link2 className="w-4 h-4" aria-hidden="true" />
                    <span>Copy Share URL</span>
                    {copied === 'url' && <Check className="w-4 h-4 text-brand-600" aria-hidden="true" />}
                  </button>

                  {/* Quick AI Launch */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-center">
                      Mở trực tiếp trên AI
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleLaunchAI('chatgpt')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        title="Copy prompt và mở ChatGPT"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>ChatGPT</span>
                      </button>
                      <button
                        onClick={() => handleLaunchAI('claude')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors disabled:opacity-50"
                        title="Copy prompt và mở Claude"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Claude</span>
                      </button>
                      <button
                        onClick={() => handleLaunchAI('gemini')}
                        disabled={missingRequired.length > 0}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50"
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