'use client'

import { Skill, DifficultyLevel } from '@/types'
import { cn } from '@/lib/utils'
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  ICON_COMPONENTS,
} from '@/lib/constants'
import {
  Tag,
  Bot,
  Copy,
  MousePointer2,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

interface SkillCardProps {
  skill: Skill
  variant?: 'default' | 'compact'
  className?: string
}

function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        DIFFICULTY_COLORS[level]
      )}
    >
      {DIFFICULTY_LABELS[level]}
    </span>
  )
}

function TagItem({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50"
    >
      <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
      {tag}
    </span>
  )
}

function IconWrapper({ iconName }: { iconName: string }) {
  const Icon = ICON_COMPONENTS[iconName as keyof typeof ICON_COMPONENTS] as
    | LucideIcon
    | undefined
  return Icon ? <Icon className="w-5 h-5" aria-hidden="true" /> : null
}

export function SkillCard({
  skill,
  variant = 'default',
  className,
}: SkillCardProps) {
  const hasAgent = !!skill.agentTemplate
  const promptCount = skill.prompts?.length ?? 0

  if (variant === 'compact') {
    return (
      <Link
        href={`/skills/${skill.slug}`}
        className={cn(
          'group block p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:border-brand-500/50 hover:shadow-card-hover',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              `bg-[${skill.categoryId === 'learning' ? '#3B82F6' : skill.categoryId === 'work' ? '#8B5CF6' : skill.categoryId === 'writing' ? '#F59E0B' : skill.categoryId === 'coding' ? '#10B981' : skill.categoryId === 'design' ? '#EC4899' : skill.categoryId === 'finance' ? '#059669' : skill.categoryId === 'health' ? '#EF4444' : skill.categoryId === 'family' ? '#F97316' : skill.categoryId === 'travel' ? '#06B6D4' : skill.categoryId === 'home' ? '#84CC16' : skill.categoryId === 'parenting' ? '#D946EF' : skill.categoryId === 'legal' ? '#64748B' : skill.categoryId === 'sideproject' ? '#14B8A6' : skill.categoryId === 'research' ? '#6366F1' : '#F43F5E'}]/10`
            )}
          >
            <IconWrapper iconName={skill.categoryId} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
              {skill.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {skill.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <DifficultyBadge level={skill.difficulty} />
              {hasAgent && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  <Bot className="w-3 h-3 mr-1" aria-hidden="true" />
                  Agent
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className={cn(
        'group block p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:border-brand-500/50 hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center',
                `bg-[${skill.categoryId === 'learning' ? '#3B82F6' : skill.categoryId === 'work' ? '#8B5CF6' : skill.categoryId === 'writing' ? '#F59E0B' : skill.categoryId === 'coding' ? '#10B981' : skill.categoryId === 'design' ? '#EC4899' : skill.categoryId === 'finance' ? '#059669' : skill.categoryId === 'health' ? '#EF4444' : skill.categoryId === 'family' ? '#F97316' : skill.categoryId === 'travel' ? '#06B6D4' : skill.categoryId === 'home' ? '#84CC16' : skill.categoryId === 'parenting' ? '#D946EF' : skill.categoryId === 'legal' ? '#64748B' : skill.categoryId === 'sideproject' ? '#14B8A6' : skill.categoryId === 'research' ? '#6366F1' : '#F43F5E'}]/10`
              )}
            >
              <IconWrapper iconName={skill.categoryId} className="w-5 h-5" />
            </div>
            <DifficultyBadge level={skill.difficulty} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
            {skill.name}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
            {skill.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {skill.tags.slice(0, 4).map((tag) => (
              <TagItem key={tag} tag={tag} />
            ))}
            {skill.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50">
                +{skill.tags.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <MousePointer2 className="w-4 h-4" aria-hidden="true" />
              {promptCount} prompts
            </span>
            {hasAgent && (
              <span className="flex items-center gap-1">
                <Bot className="w-4 h-4" aria-hidden="true" />
                Agent ready
              </span>
            )}
            <span className="flex items-center gap-1">
              <Copy className="w-4 h-4" aria-hidden="true" />
              {skill.copiedCount ?? 0} copies
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ExternalLink
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100"
            aria-label={`View ${skill.name} details`}
          />
        </div>
      </div>
    </Link>
  )
}