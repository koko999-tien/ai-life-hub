'use client'

import { AgentTemplate } from '@/types'
import { cn } from '@/lib/utils'
import {
  Bot,
  CPU,
  Thermometer,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useState, useCallback } from 'react'

interface AgentTemplateCardProps {
  agent: AgentTemplate
  skillName: string
  className?: string
}

function ToolBadge({ tool }: { tool: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      {tool}
    </span>
  )
}

function ModelBadge({ model, temperature }: { model?: string; temperature?: number }) {
  return (
    <div className="flex items-center gap-3 flex-wrap text-sm">
      {model && (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
          <CPU className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-mono font-medium">{model}</span>
        </span>
      )}
      {temperature !== undefined && (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
          <Thermometer className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-mono font-medium">Temp: {temperature}</span>
        </span>
      )}
    </div>
  )
}

function StatItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <Icon className="w-5 h-5 text-slate-400" aria-hidden="true" />
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-mono text-sm text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  )
}

export function AgentTemplateCard({ agent, skillName, className }: AgentTemplateCardProps) {
  const [copied, setCopied] = useState<'system' | null>(null)

  const handleCopySystemPrompt = useCallback(async () => {
    await navigator.clipboard.writeText(agent.systemPrompt)
    setCopied('system')
    setTimeout(() => setCopied(null), 2000)
  }, [agent.systemPrompt])

  const handleUseAgent = useCallback(() => {
    // This would typically navigate to a chat interface with the agent pre-configured
    // For now, copy the system prompt and show success
    handleCopySystemPrompt()
    // Could also trigger navigation: router.push(`/chat?agent=${encodeURIComponent(skillName)}`)
  }, [handleCopySystemPrompt, skillName])

  return (
    <div className={cn('border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{agent.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Agent for {skillName}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
            Ready to use
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{agent.description}</p>
        </div>

        {/* Model & Temperature */}
        {agent.model || agent.temperature !== undefined ? (
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">Configuration</h4>
            <ModelBadge model={agent.model} temperature={agent.temperature} />
          </div>
        ) : null}

        {/* Tools */}
        {agent.tools && agent.tools.length > 0 ? (
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.tools.map((tool) => (
                <ToolBadge key={tool} tool={tool} />
              ))}
            </div>
          </div>
        ) : null}

        {/* System Prompt Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              System Prompt
            </h4>
            <button
              onClick={handleCopySystemPrompt}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="Copy system prompt"
              title="Copy system prompt"
            >
              {copied === 'system' ? (
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="bg-slate-900/95 rounded-lg p-3 max-h-48 overflow-y-auto border border-slate-700">
            <pre className="text-sm text-slate-100 font-mono whitespace-pre-wrap break-words text-slate-300">
              {agent.systemPrompt}
            </pre>
          </div>
        </div>

        {/* Example Conversations */}
        {agent.exampleConversations && agent.exampleConversations.length > 0 ? (
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Example Conversations
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {agent.exampleConversations.slice(0, 3).map((conv, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium',
                        conv.role === 'user'
                          ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      )}
                    >
                      {conv.role === 'user' ? 'U' : 'A'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{conv.role}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 ml-7">{conv.content}</p>
                </div>
              ))}
              {agent.exampleConversations.length > 3 && (
                <p className="text-xs text-slate-500 dark:text-slate-500 text-center py-2">
                  +{agent.exampleConversations.length - 3} more examples
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleUseAgent}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            <Bot className="w-4 h-4" aria-hidden="true" />
            Use This Agent
          </button>
          <button
            onClick={handleCopySystemPrompt}
            className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Copy Prompt</span>
          </button>
        </div>
      </div>
    </div>
  )
}