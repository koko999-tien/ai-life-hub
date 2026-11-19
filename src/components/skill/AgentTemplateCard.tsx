'use client'

import { AgentTemplate } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui'
import {
  Bot,
  Cpu,
  Thermometer,
  FileText,
  Copy,
  Check,
  Sparkles,
  Settings,
  Download,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { copyToClipboardWithFallback } from './categoryHelpers'

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
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-mono font-medium">{model}</span>
        </span>
      )}
      {temperature !== undefined && (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
          <Thermometer className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-mono font-medium">Độ sáng tạo (Temp): {temperature}</span>
        </span>
      )}
    </div>
  )
}

export function AgentTemplateCard({ agent, skillName, className }: AgentTemplateCardProps) {
  const [copied, setCopied] = useState<'system' | null>(null)

  const handleCopySystemPrompt = useCallback(async () => {
    const ok = await copyToClipboardWithFallback(agent.systemPrompt)
    if (ok) {
      setCopied('system')
      toast.success('Đã sao chép Câu lệnh Hệ thống (System Prompt)!')
      setTimeout(() => setCopied(null), 2000)
    } else {
      toast.error('Không thể sao chép tự động. Vui lòng thử lại.')
    }
  }, [agent.systemPrompt])

  const handleDownloadCursorRules = useCallback(() => {
    const content = `# ${agent.name} (.cursorrules)\n\n${agent.systemPrompt}\n\n# Cấu hình mô hình\nMô hình: ${agent.model || 'gpt-4'}\nĐộ sáng tạo (Temperature): ${agent.temperature ?? 0.7}\n`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `.cursorrules`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã tải xuống tệp .cursorrules!')
  }, [agent])

  const handleDownloadClaudeMd = useCallback(() => {
    const content = `# CLAUDE.md - ${agent.name}\n\n## Vai trò & Nhiệm vụ\n${agent.description}\n\n## Chỉ dẫn hệ thống\n${agent.systemPrompt}\n\n## Cấu hình mô hình\n- Mô hình ưu tiên (Model): ${agent.model || 'claude-3-5-sonnet-20241022'}\n- Độ sáng tạo (Temperature): ${agent.temperature ?? 0.2}\n- Công cụ hỗ trợ (Tools): ${(agent.tools || []).join(', ') || 'Không có'}\n`
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CLAUDE.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã tải xuống tệp CLAUDE.md!')
  }, [agent])

  const handleUseAgent = useCallback(async () => {
    const ok = await copyToClipboardWithFallback(agent.systemPrompt)
    if (ok) {
      toast.success('Đã sao chép Câu lệnh Hệ thống! Đang mở ChatGPT...')
    } else {
      toast.info('Đang mở ChatGPT...')
    }
    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer')
  }, [agent.systemPrompt])

  return (
    <div className={cn('border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{agent.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Trợ lý AI cho kỹ năng {skillName}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
            Dùng được ngay
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
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Cấu hình mô hình</h4>
            <ModelBadge model={agent.model} temperature={agent.temperature} />
          </div>
        ) : null}

        {/* Tools */}
        {agent.tools && agent.tools.length > 0 ? (
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              Công cụ tích hợp
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
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Câu lệnh Hệ thống (System Prompt)
            </h4>
            <button
              type="button"
              onClick={handleCopySystemPrompt}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="Sao chép Câu lệnh Hệ thống"
              title="Sao chép Câu lệnh Hệ thống"
            >
              {copied === 'system' ? (
                <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="bg-slate-900/95 rounded-lg p-3 max-h-48 overflow-y-auto border border-slate-700">
            <pre className="text-sm font-mono whitespace-pre-wrap wrap-break-word text-slate-300">
              {agent.systemPrompt}
            </pre>
          </div>
        </div>

        {/* Example Conversations */}
        {agent.exampleConversations && agent.exampleConversations.length > 0 ? (
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Hội thoại mẫu minh họa
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {agent.exampleConversations.slice(0, 3).map((conv, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold',
                        conv.role === 'user'
                          ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      )}
                    >
                      {conv.role === 'user' ? 'B' : 'AI'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {conv.role === 'user' ? 'Người dùng' : 'Trợ lý AI'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 ml-8">{conv.content}</p>
                </div>
              ))}
              {agent.exampleConversations.length > 3 && (
                <p className="text-xs text-slate-500 text-center py-2">
                  +{agent.exampleConversations.length - 3} ví dụ khác
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleUseAgent}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            <Bot className="w-4 h-4" aria-hidden="true" />
            <span>Mở với ChatGPT</span>
          </button>
          <button
            type="button"
            onClick={handleCopySystemPrompt}
            className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Sao chép Câu lệnh Hệ thống</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadCursorRules}
            className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs"
            title="Tải cấu hình cho Cursor (.cursorrules)"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>.cursorrules</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadClaudeMd}
            className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs"
            title="Tải cấu hình cho Claude Code (CLAUDE.md)"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>CLAUDE.md</span>
          </button>
        </div>
      </div>
    </div>
  )
}
