'use client'

import { Prompt, PromptDifficulty } from '@/types'
import { cn } from '@/lib/utils'
import { PROMPT_DIFFICULTY_LABELS, PROMPT_DIFFICULTY_COLORS } from '@/lib/constants'
import { toast } from '@/components/ui'
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  AlertCircle,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { VariableForm } from './VariableForm'
import { PromptBuilder } from './PromptBuilder'
import { copyToClipboardWithFallback, normalizeVariableValue } from './categoryHelpers'

interface PromptCardProps {
  prompt: Prompt
  skillId: string
  skillName?: string
  skillSlug?: string
  className?: string
}

function normalizePromptDifficulty(level?: string): PromptDifficulty {
  if (level === 'easy' || level === 'medium' || level === 'advanced') {
    return level
  }
  return 'medium'
}

function DifficultyBadge({ level }: { level?: string }) {
  const normalized = normalizePromptDifficulty(level)
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        PROMPT_DIFFICULTY_COLORS[normalized]
      )}
    >
      {PROMPT_DIFFICULTY_LABELS[normalized]}
    </span>
  )
}

function TipItem({ tip }: { tip: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
      <span>{tip}</span>
    </li>
  )
}

function UseCaseItem({ useCase }: { useCase: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50">
      {useCase}
    </span>
  )
}

export function PromptCard({ prompt, skillId, skillName, skillSlug, className }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyTemplate = useCallback(async () => {
    const ok = await copyToClipboardWithFallback(prompt.template)
    if (ok) {
      setCopied(true)
      toast.success('Đã sao chép mẫu câu lệnh!')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Không thể sao chép tự động. Vui lòng mở rộng để sao chép thủ công.')
    }
  }, [prompt.template])

  const handleOpenBuilder = useCallback(() => {
    setShowBuilder(true)
  }, [])

  const variableCount = prompt.variables?.length ?? 0

  return (
    <div
      id={`prompt-${prompt.id}`}
      className={cn(
        'border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200 scroll-mt-24',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <DifficultyBadge level={prompt.difficulty} />
              {variableCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <FileText className="w-3 h-3 mr-1" aria-hidden="true" />
                  {variableCount} thông tin cần điền
                </span>
              )}
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{prompt.name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{prompt.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="Sao chép mẫu câu lệnh"
              title="Sao chép mẫu câu lệnh"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={handleOpenBuilder}
              className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-1.5"
              aria-label={`Điền thông tin và tạo câu lệnh: ${prompt.name}`}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Tạo câu lệnh
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={isExpanded ? 'Thu gọn chi tiết' : 'Mở rộng chi tiết'}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
          {/* Template Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Mẫu câu lệnh
              </span>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    Sao chép
                  </>
                )}
              </button>
            </div>
            <pre className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {prompt.template}
            </pre>
          </div>

          {/* Variables */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4" aria-hidden="true" />
                Thông tin cần điền
              </h5>
              <VariableForm variables={prompt.variables} readOnly />
            </div>
          )}

          {/* Examples */}
          {prompt.examples && prompt.examples.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" aria-hidden="true" />
                Ví dụ thực tế
              </h5>
              <div className="space-y-2">
                {prompt.examples.map((example, index) => {
                  const inputEntries = Object.entries(example.inputs || {})
                  return (
                    <div
                      key={index}
                      className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                    >
                      {example.context && (
                        <p className="text-xs text-slate-500 mb-2">{example.context}</p>
                      )}
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Thông tin đầu vào</p>
                          <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded max-h-32 overflow-y-auto space-y-1">
                            {inputEntries.map(([key, val]) => {
                              const varLabel = prompt.variables?.find((v) => v.name === key)?.label || key
                              return (
                                <div key={key} className="break-words">
                                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {varLabel}:
                                  </span>{' '}
                                  <span>{normalizeVariableValue(val)}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1">Kết quả mẫu</p>
                          <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words bg-white dark:bg-slate-900 p-2 rounded max-h-32 overflow-y-auto">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          {prompt.tips && prompt.tips.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                Mẹo thực hành
              </h5>
              <ul className="space-y-1.5" role="list">
                {prompt.tips.map((tip, index) => (
                  <TipItem key={index} tip={tip} />
                ))}
              </ul>
            </div>
          )}

          {/* Use Cases */}
          {prompt.useCases && prompt.useCases.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Tình huống ứng dụng</h5>
              <div className="flex flex-wrap gap-2">
                {prompt.useCases.map((useCase) => (
                  <UseCaseItem key={useCase} useCase={useCase} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prompt Builder Modal */}
      {showBuilder && (
        <PromptBuilder
          prompt={prompt}
          skillId={skillId}
          skillName={skillName}
          skillSlug={skillSlug}
          onClose={() => setShowBuilder(false)}
        />
      )}
    </div>
  )
}
