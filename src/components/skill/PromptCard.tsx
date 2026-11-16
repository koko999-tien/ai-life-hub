'use client'

import { Prompt, PromptDifficulty } from '@/types'
import { cn } from '@/lib/utils'
import {
  PROMPT_DIFFICULTY_LABELS,
  PROMPT_DIFFICULTY_COLORS,
  ICON_COMPONENTS,
} from '@/lib/constants'
import {
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { VariableForm } from './VariableForm'
import { PromptBuilder } from './PromptBuilder'

interface PromptCardProps {
  prompt: Prompt
  skillId: string
  className?: string
}

function DifficultyBadge({ level }: { level: PromptDifficulty }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        PROMPT_DIFFICULTY_COLORS[level]
      )}
    >
      {PROMPT_DIFFICULTY_LABELS[level]}
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

export function PromptCard({ prompt, skillId, className }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)

  const handleCopyTemplate = useCallback(async () => {
    await navigator.clipboard.writeText(prompt.template)
    // Could add toast notification here
  }, [prompt.template])

  const handleOpenBuilder = useCallback(() => {
    setShowBuilder(true)
  }, [])

  const variableCount = prompt.variables?.length ?? 0

  return (
    <div
      className={cn(
        'border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200',
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
                  {variableCount} variable{variableCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{prompt.name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{prompt.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyTemplate}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="Copy prompt template"
              title="Copy template"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleOpenBuilder}
              className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-1.5"
              aria-label="Open prompt builder"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Build
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
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
        <div className="p-4 space-y-4 animate-slide-down border-t border-slate-200 dark:border-slate-700">
          {/* Template Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                Template
              </span>
              <button
                onClick={handleCopyTemplate}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" aria-hidden="true" />
                Copy
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
                Variables
              </h5>
              <VariableForm variables={prompt.variables} readOnly />
            </div>
          )}

          {/* Examples */}
          {prompt.examples && prompt.examples.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" aria-hidden="true" />
                Examples
              </h5>
              <div className="space-y-2">
                {prompt.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                  >
                    {example.context && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">{example.context}</p>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500 mb-1">Inputs</p>
                        <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words bg-white dark:bg-slate-900 p-2 rounded max-h-32 overflow-y-auto">
                          {JSON.stringify(example.inputs, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500 mb-1">Output</p>
                        <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words bg-white dark:bg-slate-900 p-2 rounded max-h-32 overflow-y-auto">
                          {example.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {prompt.tips && prompt.tips.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                Tips
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
              <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Use Cases</h5>
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
          onClose={() => setShowBuilder(false)}
        />
      )}
    </div>
  )
}