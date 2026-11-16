'use client';

import Link from 'next/link';
import { ChevronRight, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skill } from '@/lib/data';

const difficultyConfig = {
  beginner: { label: 'Cơ bản', className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' },
  intermediate: { label: 'Trung cấp', className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' },
  advanced: { label: 'Nâng cao', className: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive' },
} as const;

interface RelatedSkillsProps {
  relatedSkills: Skill[];
}

export function RelatedSkills({ relatedSkills }: RelatedSkillsProps) {
  if (relatedSkills.length === 0) return null;

  return (
    <section aria-labelledby="related-skills-heading" className="mt-16">
      <h2 id="related-skills-heading" className="heading-2 mb-8">
        Kỹ năng liên quan
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {relatedSkills.map((skill) => (
          <Link
            key={skill.slug}
            href={`/skill/${skill.slug}`}
            className={cn(
              'card group p-5 block hover:shadow-lg hover:border-primary/20 transition-all duration-300',
              'flex flex-col'
            )}
            role="listitem"
            aria-label={skill.name}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="heading-4 text-foreground group-hover:text-primary transition-colors">
                {skill.name}
              </h3>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" aria-hidden="true" />
            </div>

            <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
              {skill.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className={cn('badge text-xs flex items-center gap-1', difficultyConfig[skill.difficulty].className)}>
                <Signal className="h-3 w-3" aria-hidden="true" />
                {difficultyConfig[skill.difficulty].label}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                {skill.estimatedTime}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Clock3({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}