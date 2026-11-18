'use client'

import { Skill, DifficultyLevel } from '@/types'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, resolveTagLabel } from '@/lib/constants'
import {
  Tag,
  Bot,
  Copy,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Lightbulb,
  Bookmark,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { toast } from '@/components/ui'
import { PromptCard } from './PromptCard'
import { AgentTemplateCard } from './AgentTemplateCard'
import { RelatedSkills } from './RelatedSkills'
import { SkillReviews } from './SkillReviews'
import { SkillCategoryIcon } from './SkillCategoryIcon'

interface SkillDetailProps {
  skill: Skill
  relatedSkills: Skill[]
  className?: string
}

function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        DIFFICULTY_COLORS[level] || DIFFICULTY_COLORS.beginner
      )}
    >
      {DIFFICULTY_LABELS[level] || level}
    </span>
  )
}

function TagItem({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium text-text-muted bg-bg border border-border">
      <Tag className="w-3 h-3 mr-1.5 text-accent" aria-hidden="true" />
      {resolveTagLabel(tag)}
    </span>
  )
}

function WhenToUseList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3" role="list">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 p-3.5 bg-bg rounded-xl border border-border/80">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
          </div>
          <p className="text-text text-sm leading-relaxed pt-0.5">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function CollapsibleSection({
  id,
  title,
  description,
  icon: IconComponent,
  children,
  defaultOpen = true,
}: {
  id?: string
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div id={id} className="border border-border rounded-2xl overflow-hidden bg-bg-elevated shadow-sm transition-all scroll-mt-24">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-hover transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-5 h-5 text-accent" aria-hidden="true" />}
          <div>
            <h3 className="font-semibold text-text text-base">{title}</h3>
            {description && <p className="text-xs text-text-muted">{description}</p>}
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-border">
          {children}
        </div>
      )}
    </div>
  )
}

export function SkillDetail({ skill, relatedSkills, className }: SkillDetailProps) {
  const hasAgent = !!skill.agentTemplate
  const promptCount = skill.prompts?.length ?? 0
  const { isBookmarked, toggle } = useBookmarks()
  const bookmarked = isBookmarked(skill.id)

  const handleToggleBookmark = async () => {
    const nextBookmarked = await toggle({
      itemType: 'skill',
      itemId: skill.id,
      itemTitle: skill.name,
      itemSlug: skill.slug,
      categoryId: skill.categoryId,
    })
    toast.success(nextBookmarked ? 'Đã lưu kỹ năng vào mục yêu thích!' : 'Đã bỏ lưu kỹ năng khỏi mục yêu thích.')
  }

  return (
    <article className={cn('space-y-8', className)}>
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/20 text-accent shadow-sm'
              )}
            >
              <SkillCategoryIcon categoryId={skill.categoryId} className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <DifficultyBadge level={skill.difficulty} />
              {hasAgent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Bot className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Mẫu Trợ Lý AI
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? `Bỏ lưu kỹ năng ${skill.name}` : `Lưu yêu thích kỹ năng ${skill.name}`}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all',
              bookmarked
                ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 shadow-xs'
                : 'border-border bg-bg-elevated text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400'
            )}
          >
            <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-current')} aria-hidden="true" />
            <span>{bookmarked ? 'Đã lưu' : 'Lưu yêu thích'}</span>
          </button>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text mb-3 tracking-tight">{skill.name}</h1>
          <p className="text-base sm:text-lg text-text-muted max-w-3xl leading-relaxed">{skill.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            {promptCount} câu lệnh mẫu
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            Thời gian: {skill.estimatedTime}
          </span>
          {skill.author && (
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Biên soạn: {skill.author}
            </span>
          )}
          {skill.version && (
            <span className="flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              Phiên bản {skill.version}
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
          title="Khi nào nên sử dụng kỹ năng này"
          description={`${skill.whenToUse.length} tình huống thực tiễn`}
          icon={Lightbulb}
          defaultOpen={true}
        >
          <WhenToUseList items={skill.whenToUse} />
        </CollapsibleSection>
      )}

      {/* Prompts */}
      {skill.prompts && skill.prompts.length > 0 && (
        <CollapsibleSection
          title="Thư viện Câu lệnh mẫu"
          description={`${skill.prompts.length} câu lệnh sẵn sàng sử dụng`}
          icon={BookOpen}
          defaultOpen={true}
        >
          <div className="space-y-4 pt-4">
            {skill.prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                skillId={skill.id}
                skillName={skill.name}
                skillSlug={skill.slug}
              />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Agent Template */}
      {hasAgent && (
        <CollapsibleSection
          id="agent"
          title="Mẫu Trợ Lý AI cấu hình sẵn"
          description="Thiết lập sẵn vai trò và hướng dẫn cho trợ lý AI chuyên biệt"
          icon={Bot}
          defaultOpen={true}
        >
          <div className="pt-4">
            <AgentTemplateCard agent={skill.agentTemplate!} skillName={skill.name} />
          </div>
        </CollapsibleSection>
      )}

      {/* Related Skills */}
      {relatedSkills.length > 0 && (
        <CollapsibleSection
          title="Kỹ năng liên quan"
          description={`${relatedSkills.length} kỹ năng tương tự nên tham khảo`}
          icon={Sparkles}
          defaultOpen={false}
        >
          <div className="pt-4">
            <RelatedSkills skills={relatedSkills} />
          </div>
        </CollapsibleSection>
      )}

      {/* Skill Reviews & Community Experience */}
      <SkillReviews skillSlug={skill.slug} skillName={skill.name} />

      {/* Meta */}
      <footer className="pt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span>Cập nhật lần cuối:</span>
            <time dateTime={skill.updatedAt} className="font-mono text-text">
              {new Date(skill.updatedAt).toLocaleDateString('vi-VN', {
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
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Nguồn tham khảo
            </a>
          )}
        </div>
      </footer>
    </article>
  )
}
