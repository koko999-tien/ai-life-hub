'use client'

import { Skill } from '@/types'
import { SkillCard } from './SkillCard'
import { cn } from '@/lib/utils'

interface RelatedSkillsProps {
  skills: Skill[]
  className?: string
  variant?: 'grid' | 'scroll'
  maxItems?: number
}

export function RelatedSkills({
  skills,
  className,
  variant = 'scroll',
  maxItems = 6,
}: RelatedSkillsProps) {
  const displaySkills = skills.slice(0, maxItems)

  if (variant === 'grid') {
    return (
      <div
        className={cn(
          'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}
        role="list"
        aria-label="Kỹ năng liên quan"
      >
        {displaySkills.map((skill) => (
          <div key={skill.id} role="listitem">
            <SkillCard skill={skill} variant="default" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
        role="list"
        aria-label="Kỹ năng liên quan"
      >
        {displaySkills.map((skill) => (
          <div
            key={skill.id}
            className="shrink-0 snap-start w-72 sm:w-80"
            role="listitem"
          >
            <SkillCard skill={skill} variant="default" />
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      {displaySkills.length > 2 && (
        <div className="absolute bottom-0 right-0 left-0 h-8 bg-linear-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" aria-hidden="true" />
      )}
    </div>
  )
}

// Additional export for a compact list variant
export function RelatedSkillsList({ skills, maxItems = 5 }: { skills: Skill[]; maxItems?: number }) {
  const displaySkills = skills.slice(0, maxItems)

  return (
    <ul className="space-y-2" role="list" aria-label="Kỹ năng liên quan">
      {displaySkills.map((skill) => (
        <li key={skill.id}>
          <SkillCard skill={skill} variant="compact" />
        </li>
      ))}
    </ul>
  )
}
