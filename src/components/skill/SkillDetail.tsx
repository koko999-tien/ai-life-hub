'use client'

import { Skill, Prompt, AgentTemplate, DifficultyLevel } from '@/types'
import { cn } from '@/lib/utils'
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  PROMPT_DIFFICULTY_LABELS,
  PROMPT_DIFFICULTY_COLORS,
  ICON_COMPONENTS,
} from '@/lib/constants'
import {
  Tag,
  Bot,
  Copy,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { PromptCard } from './PromptCard'
import { AgentTemplateCard } from './AgentTemplateCard'
import { RelatedSkills } from './RelatedSkills'
import { SkillReviews } from './SkillReviews'

interface SkillDetailProps {
  skill: Skill
  relatedSkills: Skill[]
  className?: string
}

function DifficultyBadge({ level, variant = 'skill' }: { level: DifficultyLevel; variant?: 'skill' | 'prompt' }) {
  const labels = variant === 'skill' ? DIFFICULTY_LABELS : (PROMPT_DIFFICULTY_LABELS as any)
  const colors = variant === 'skill' ? DIFFICULTY_COLORS : (PROMPT_DIFFICULTY_COLORS as any)

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        (colors as any)[level]
      )}
    >
      {(labels as any)[level]}
    </span>
  )
}

function TagItem({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
      <Tag className="w-3 h-3 mr-1.5" aria-hidden="true" />
      {tag}
    </span>
  )
}

function IconWrapper({ iconName, size = 5 }: { iconName: string; size?: number }) {
  const Icon = (ICON_COMPONENTS as any)[iconName] as
    | LucideIcon
    | undefined
  return Icon ? <Icon className={`w-${size} h-${size}`} aria-hidden="true" /> : null
}

function WhenToUseList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3" role="list">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pt-0.5">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function SectionHeader({
  title,
  description,
  action,
  icon: IconComponent,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {IconComponent && <IconComponent className="w-5 h-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />}
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 mt-1">{action}</div>}
    </div>
  )
}

function CollapsibleSection({
  title,
  description,
  icon: IconComponent,
  children,
  defaultOpen = true,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-5 h-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />}
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">{title}</h3>
            {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-200 dark:border-slate-700 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  )
}

export function SkillDetail({ skill, relatedSkills, className }: SkillDetailProps) {
  const hasAgent = !!skill.agentTemplate
  const promptCount = skill.prompts?.length ?? 0

  return (
    <article className={cn('space-y-8', className)}>
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              `bg-[${skill.categoryId === 'learning' ? '#3B82F6' : skill.categoryId === 'work' ? '#8B5CF6' : skill.categoryId === 'writing' ? '#F59E0B' : skill.categoryId === 'coding' ? '#10B981' : skill.categoryId === 'design' ? '#EC4899' : skill.categoryId === 'finance' ? '#059669' : skill.categoryId === 'health' ? '#EF4444' : skill.categoryId === 'family' ? '#F97316' : skill.categoryId === 'travel' ? '#06B6D4' : skill.categoryId === 'home' ? '#84CC16' : skill.categoryId === 'parenting' ? '#D946EF' : skill.categoryId === 'legal' ? '#64748B' : skill.categoryId === 'sideproject' ? '#14B8A6' : skill.categoryId === 'research' ? '#6366F1' : '#F43F5E'}]/10`
            )}
          >
            <IconWrapper iconName={skill.categoryId} size={6} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DifficultyBadge level={skill.difficulty} />
            {hasAgent && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                <Bot className="w-3 h-3 mr-1.5" aria-hidden="true" />
                Agent Template
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">{skill.name}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">{skill.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {promptCount} prompt{promptCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" aria-hidden="true" />
            Est. {skill.estimatedTime}
          </span>
          {skill.author && (
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              By {skill.author}
            </span>
          )}
          {skill.version && (
            <span className="flex items-center gap-1.5">
              <Copy className="w-4 h-4" aria-hidden="true" />
              v{skill.version}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <TagItem key={tag} tag={tag} />
          ))}
        </div>
      </header>

      {/* When to Use */}
      {skill.whenToUse && skill.whenToUse.length > 0 && (
        <CollapsibleSection
          title="When to use this skill"
          description={`${skill.whenToUse.length} common scenarios`}
          icon={Lightbulb}
          defaultOpen={true}
        >
          <WhenToUseList items={skill.whenToUse} />
        </CollapsibleSection>
      )}

      {/* Prompts */}
      {skill.prompts && skill.prompts.length > 0 && (
        <CollapsibleSection
          title="Prompts"
          description={`${skill.prompts.length} ready-to-use prompts`}
          icon={BookOpen}
          defaultOpen={true}
        >
          <div className="space-y-4">
            {skill.prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} skillId={skill.id} />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Agent Template */}
      {hasAgent && (
        <CollapsibleSection
          title="Agent Template"
          description="Ready-to-use AI agent configuration"
          icon={Bot}
          defaultOpen={true}
        >
          <AgentTemplateCard agent={skill.agentTemplate!} skillName={skill.name} />
        </CollapsibleSection>
      )}

      {/* Related Skills */}
      {relatedSkills.length > 0 && (
        <CollapsibleSection
          title="Related Skills"
          description={`${relatedSkills.length} skills you might also like`}
          icon={Sparkles}
          defaultOpen={false}
        >
          <RelatedSkills skills={relatedSkills} />
        </CollapsibleSection>
      )}

      {/* Skill Reviews & Community Experience */}
      <SkillReviews skillSlug={skill.slug} skillName={skill.name} />

      {/* Meta */}
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span>Updated:</span>
            <time dateTime={skill.updatedAt} className="font-mono">
              {new Date(skill.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
          {skill.source && (
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </footer>
    </article>
  )
}