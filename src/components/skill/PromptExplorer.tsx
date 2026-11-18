'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Copy, Check, ArrowRight, Bookmark, PlusCircle, SlidersHorizontal } from 'lucide-react';
import { Button, toast } from '@/components/ui';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Prompt, PromptDifficulty, PromptExample, PromptVariable } from '@/types';
import { PromptBuilder } from './PromptBuilder';
import {
  copyToClipboardWithFallback,
  resolveCanonicalCategoryId,
  resolveCategoryName,
} from './categoryHelpers';

type AudienceSegment = 'all' | 'everyday' | 'technical';

interface PromptItem extends Prompt {
  skillName: string;
  skillSlug: string;
  categoryId: string;
  tags?: string[];
  variables: PromptVariable[];
  examples: PromptExample[];
  useCases: string[];
  tips?: string[];
  difficulty: PromptDifficulty;
}

interface PromptExplorerProps {
  initialPrompts: PromptItem[];
}

const TECHNICAL_CATEGORY_IDS = new Set(['coding', 'prompt-engineering']);

function isTechnicalPrompt(prompt: PromptItem): boolean {
  const canonicalCategory = resolveCanonicalCategoryId(prompt.categoryId);
  return TECHNICAL_CATEGORY_IDS.has(canonicalCategory);
}

export function PromptExplorer({ initialPrompts }: PromptExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<AudienceSegment>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const { isBookmarked, toggle } = useBookmarks();

  const audienceCounts = useMemo(() => {
    let everyday = 0;
    let technical = 0;
    initialPrompts.forEach((p) => {
      if (isTechnicalPrompt(p)) technical += 1;
      else everyday += 1;
    });
    return {
      all: initialPrompts.length,
      everyday,
      technical,
    };
  }, [initialPrompts]);

  const promptsInAudience = useMemo(() => {
    if (selectedAudience === 'all') return initialPrompts;
    return initialPrompts.filter((p) =>
      selectedAudience === 'technical' ? isTechnicalPrompt(p) : !isTechnicalPrompt(p)
    );
  }, [initialPrompts, selectedAudience]);

  const categories = useMemo(() => {
    const set = new Set(promptsInAudience.map((p) => resolveCanonicalCategoryId(p.categoryId)));
    return ['all', ...Array.from(set)];
  }, [promptsInAudience]);

  const handleAudienceChange = (nextAudience: AudienceSegment) => {
    setSelectedAudience(nextAudience);
    if (selectedCategory !== 'all') {
      const nextPrompts =
        nextAudience === 'all'
          ? initialPrompts
          : initialPrompts.filter((p) =>
              nextAudience === 'technical' ? isTechnicalPrompt(p) : !isTechnicalPrompt(p)
            );
      const nextCategories = new Set(nextPrompts.map((p) => resolveCanonicalCategoryId(p.categoryId)));
      if (!nextCategories.has(selectedCategory)) {
        setSelectedCategory('all');
      }
    }
  };

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return promptsInAudience.filter((p) => {
      const canonicalCat = resolveCanonicalCategoryId(p.categoryId);
      const matchCat = selectedCategory === 'all' || canonicalCat === selectedCategory;
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.skillName.toLowerCase().includes(query) ||
        p.template.toLowerCase().includes(query) ||
        resolveCategoryName(p.categoryId).toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [promptsInAudience, selectedCategory, search]);

  const handleCopy = async (template: string, id: string) => {
    const ok = await copyToClipboardWithFallback(template);
    if (ok) {
      setCopiedId(id);
      toast.success('Đã sao chép câu lệnh vào bộ nhớ tạm!');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.error('Không thể sao chép tự động. Vui lòng thử lại.');
    }
  };

  const handleOpenAI = async (template: string, service: 'chatgpt' | 'claude' | 'gemini') => {
    const ok = await copyToClipboardWithFallback(template);
    const encoded = encodeURIComponent(template);

    if (service === 'chatgpt') {
      if (ok) {
        toast.success('Đã sao chép câu lệnh! Đang mở ChatGPT...');
      } else {
        toast.info('Đang mở ChatGPT...');
      }
      window.open(`https://chatgpt.com/?q=${encoded}`, '_blank', 'noopener,noreferrer');
    } else if (service === 'claude') {
      if (ok) {
        toast.success('Đã sao chép câu lệnh! Đang mở Claude...');
      } else {
        toast.info('Đang mở Claude...');
      }
      window.open(`https://claude.ai/new?q=${encoded}`, '_blank', 'noopener,noreferrer');
    } else if (service === 'gemini') {
      if (ok) {
        toast.success('Đã sao chép câu lệnh! Hãy dán vào ô chat Gemini.');
      } else {
        toast.info('Đang mở Gemini...');
      }
      window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
    }
  };

  const audienceTabs: { id: AudienceSegment; label: string; count: number }[] = [
    { id: 'all', label: 'Tất cả', count: audienceCounts.all },
    { id: 'everyday', label: 'Phổ thông & Công sở', count: audienceCounts.everyday },
    { id: 'technical', label: 'Kỹ thuật & Lập trình', count: audienceCounts.technical },
  ];

  return (
    <div>
      {/* Audience Segment Tabs */}
      <div
        role="tablist"
        aria-label="Phân loại theo đối tượng sử dụng"
        className="flex flex-wrap items-center gap-2 mb-6"
      >
        {audienceTabs.map((tab) => {
          const isSelected = selectedAudience === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleAudienceChange(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}{' '}
              <span className={isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}>
                ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm câu lệnh theo tên, nội dung hoặc kỹ năng..."
            aria-label="Tìm kiếm câu lệnh"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div
          className="flex flex-wrap gap-2 w-full md:w-auto"
          role="group"
          aria-label="Lọc theo danh mục"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'Tất cả danh mục' : resolveCategoryName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Count & Submit CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{filteredPrompts.length}</span> mẫu câu lệnh
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-300 text-xs font-semibold transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Đóng góp câu lệnh mới</span>
        </Link>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPrompts.map((prompt) => {
          const categoryLabel = resolveCategoryName(prompt.categoryId);
          const variableCount = prompt.variables?.length ?? 0;

          return (
            <div
              key={prompt.id}
              id={`prompt-${prompt.id}`}
              className="min-w-0 flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {categoryLabel}
                  </span>
                  <Link
                    href={`/skill/${prompt.skillSlug}`}
                    className="text-xs text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
                  >
                    {prompt.skillName} <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{prompt.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {prompt.description}
                </p>

                {/* Variable Preview Chips */}
                {variableCount > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {variableCount} thông tin cần điền
                    </span>
                    {prompt.variables.slice(0, 3).map((v) => (
                      <span
                        key={v.name}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        {v.label}
                      </span>
                    ))}
                    {variableCount > 3 && (
                      <span className="text-[11px] text-gray-400">+{variableCount - 3}</span>
                    )}
                  </div>
                )}

                {/* Template Preview Box */}
                <div className="relative rounded-xl bg-gray-50 dark:bg-gray-950 p-4 border border-gray-100 dark:border-gray-800 mb-4 font-mono text-xs text-gray-700 dark:text-gray-300 max-h-36 overflow-auto">
                  <pre className="whitespace-pre-wrap break-words">{prompt.template}</pre>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setActivePrompt(prompt)}
                    className="gap-1.5 text-xs flex-1 sm:flex-initial"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Điền thông tin & Dùng ngay</span>
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(prompt.template, prompt.id)}
                      className="gap-1.5 text-xs"
                      aria-label={`Sao chép câu lệnh ${prompt.name}`}
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() =>
                        toggle({
                          itemType: 'prompt',
                          itemId: prompt.id,
                          itemTitle: prompt.name,
                          itemSlug: prompt.skillSlug,
                          categoryId: prompt.categoryId,
                        })
                      }
                      className={`p-2 rounded-lg border transition-colors ${
                        isBookmarked(prompt.id)
                          ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:text-amber-500 hover:border-amber-300'
                      }`}
                      title={isBookmarked(prompt.id) ? 'Bỏ lưu' : 'Lưu vào Yêu thích'}
                      aria-label={isBookmarked(prompt.id) ? 'Bỏ lưu câu lệnh' : 'Lưu câu lệnh vào yêu thích'}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${isBookmarked(prompt.id) ? 'fill-current' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[11px] text-gray-400 mr-auto">Mở nhanh trên:</span>
                  <button
                    type="button"
                    onClick={() => handleOpenAI(prompt.template, 'chatgpt')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-600 transition-colors"
                    title="Mở trên ChatGPT"
                    aria-label={`Mở câu lệnh ${prompt.name} trên ChatGPT`}
                  >
                    ChatGPT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAI(prompt.template, 'claude')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:text-amber-600 transition-colors"
                    title="Mở trên Claude"
                    aria-label={`Mở câu lệnh ${prompt.name} trên Claude`}
                  >
                    Claude
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAI(prompt.template, 'gemini')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    title="Sao chép và mở trên Gemini"
                    aria-label={`Sao chép và mở câu lệnh ${prompt.name} trên Gemini`}
                  >
                    Gemini
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          Không tìm thấy mẫu câu lệnh nào phù hợp với từ khóa của bạn.
        </div>
      )}

      {/* Interactive Prompt Builder Modal */}
      {activePrompt && (
        <PromptBuilder
          prompt={activePrompt}
          skillId={activePrompt.skillId}
          skillName={activePrompt.skillName}
          skillSlug={activePrompt.skillSlug}
          onClose={() => setActivePrompt(null)}
        />
      )}
    </div>
  );
}
