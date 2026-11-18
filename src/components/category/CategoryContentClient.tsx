'use client';

import { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Category, DifficultyLevel, Resource, Skill } from '@/types';
import { RESOURCE_TYPE_COLORS, RESOURCE_TYPE_LABELS } from '@/lib/constants';
import { CategorySidebar } from './CategorySidebar';
import { SkillCard } from '@/components/skill/SkillCard';

export interface CategoryContentClientProps {
  categories: Category[];
  currentCategory: Category;
  skills: Skill[];
  resources: Resource[];
}

export function CategoryContentClient({
  categories,
  currentCategory,
  skills,
  resources,
}: CategoryContentClientProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'name'>('popularity');

  const filteredAndSortedSkills = useMemo(() => {
    const filtered = selectedDifficulty
      ? skills.filter((s) => s.difficulty === selectedDifficulty)
      : [...skills];

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      filtered.sort((a, b) => (b.prompts?.length ?? 0) - (a.prompts?.length ?? 0));
    }

    return filtered;
  }, [skills, selectedDifficulty, sortBy]);

  const handleClearFilters = () => {
    setSelectedDifficulty(undefined);
    setSortBy('popularity');
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
      <div className="lg:col-span-1 order-2 lg:order-1">
        <CategorySidebar
          categories={categories}
          currentCategory={currentCategory}
          selectedDifficulty={selectedDifficulty}
          sortBy={sortBy}
          onDifficultyChange={setSelectedDifficulty}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />
      </div>

      <div className="lg:col-span-3 order-1 lg:order-2">
        {filteredAndSortedSkills.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredAndSortedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg-elevated p-8 text-center">
            <p className="text-text-muted mb-4">
              {selectedDifficulty
                ? 'Không có kỹ năng nào phù hợp với độ khó đã chọn trong danh mục này.'
                : 'Chưa có kỹ năng nào trong danh mục này.'}
            </p>
            {selectedDifficulty && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Hiển thị tất cả kỹ năng
              </button>
            )}
          </div>
        )}

        {resources.length > 0 && (
          <section className="mt-12" aria-labelledby="category-resources-heading">
            <h2 id="category-resources-heading" className="text-xl font-bold text-text mb-4">
              Tài nguyên tham khảo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 block hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        RESOURCE_TYPE_COLORS[res.type] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {RESOURCE_TYPE_LABELS[res.type] || res.type}
                    </span>
                    <ExternalLink className="h-4 w-4 text-text-muted" aria-hidden="true" />
                  </div>
                  <h3 className="font-medium text-text">{res.title}</h3>
                  <p className="text-sm text-text-muted mt-1">{res.description}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
