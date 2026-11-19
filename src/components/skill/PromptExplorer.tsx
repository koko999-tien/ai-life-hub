'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Copy,
  Check,
  ArrowRight,
  Bookmark,
  PlusCircle,
  SlidersHorizontal,
  Play,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Tag,
  Trash2,
  Layers,
  Workflow,
  Bot,
  FileText,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Prompt, PromptDifficulty, PromptExample, PromptVariable } from '@/types';
import { PromptBuilder } from './PromptBuilder';
import {
  copyToClipboardWithFallback,
  resolveCanonicalCategoryId,
  resolveCategoryName,
} from './categoryHelpers';
import {
  PROMPT_DIFFICULTY_COLORS,
  PROMPT_DIFFICULTY_LABELS,
  resolveTagLabel,
} from '@/lib/constants';
import { normalizeVietnamese } from '@/lib/utils';
import {
  fetchCommunityPrompts,
  deleteLocalCommunityPrompt,
  type CommunityPromptItem,
} from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';

type AudienceSegment = 'all' | 'everyday' | 'technical';
type SortOption = 'recommended' | 'easy-first' | 'variables-desc' | 'community-first';

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
  isCommunity?: boolean;
  isLocalOnly?: boolean;
  authorName?: string;
}

interface PromptExplorerProps {
  initialPrompts: PromptItem[];
}

const TECHNICAL_CATEGORY_IDS = new Set(['coding', 'prompt-engineering']);

function isTechnicalPrompt(prompt: PromptItem): boolean {
  const canonicalCategory = resolveCanonicalCategoryId(prompt.categoryId);
  return TECHNICAL_CATEGORY_IDS.has(canonicalCategory);
}

function mapCommunityPromptToItem(cp: CommunityPromptItem): PromptItem {
  const detectedVars = Array.from(
    new Set((cp.template.match(/\{\{([^}]+)\}\}/g) || []).map((m) => m.replace(/[{}]/g, '').trim()))
  );

  return {
    id: cp.id,
    skillId: 'community',
    skillName: cp.isLocalOnly ? `Của bạn (${cp.authorName})` : `Cộng đồng (${cp.authorName})`,
    skillSlug: '',
    name: cp.title,
    description: cp.description,
    template: cp.template,
    categoryId: cp.categoryId || 'work',
    tags: cp.tags || [],
    variables: detectedVars.map((v) => ({
      name: v,
      type: 'text',
      label: v.replace(/_/g, ' '),
      required: true,
    })),
    examples: [],
    useCases: [],
    difficulty: detectedVars.length > 2 ? 'medium' : 'easy',
    isCommunity: true,
    isLocalOnly: cp.isLocalOnly,
    authorName: cp.authorName,
  };
}

export function PromptExplorer({ initialPrompts }: PromptExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<AudienceSegment>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({});
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const [communityPrompts, setCommunityPrompts] = useState<PromptItem[]>([]);
  const { isBookmarked, toggle } = useBookmarks();

  useEffect(() => {
    let mounted = true;
    fetchCommunityPrompts().then((items) => {
      if (mounted) {
        setCommunityPrompts(items.map(mapCommunityPromptToItem));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const combinedPrompts = useMemo(() => {
    return [...communityPrompts, ...initialPrompts];
  }, [communityPrompts, initialPrompts]);

  const audienceCounts = useMemo(() => {
    let everyday = 0;
    let technical = 0;
    combinedPrompts.forEach((p) => {
      if (isTechnicalPrompt(p)) technical += 1;
      else everyday += 1;
    });
    return {
      all: combinedPrompts.length,
      everyday,
      technical,
    };
  }, [combinedPrompts]);

  const promptsInAudience = useMemo(() => {
    if (selectedAudience === 'all') return combinedPrompts;
    return combinedPrompts.filter((p) =>
      selectedAudience === 'technical' ? isTechnicalPrompt(p) : !isTechnicalPrompt(p)
    );
  }, [combinedPrompts, selectedAudience]);

  const categories = useMemo(() => {
    const set = new Set(promptsInAudience.map((p) => resolveCanonicalCategoryId(p.categoryId)));
    return ['all', ...Array.from(set)];
  }, [promptsInAudience]);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    promptsInAudience.forEach((p) => {
      const matchCat =
        selectedCategory === 'all' || resolveCanonicalCategoryId(p.categoryId) === selectedCategory;
      if (!matchCat) return;
      (p.tags || []).forEach((t) => {
        const key = t.trim().toLowerCase();
        if (key && key !== 'community') {
          counts.set(key, (counts.get(key) || 0) + 1);
        }
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [promptsInAudience, selectedCategory]);

  const handleAudienceChange = (nextAudience: AudienceSegment) => {
    setSelectedAudience(nextAudience);
    setSelectedTag('all');
    if (selectedCategory !== 'all') {
      const nextPrompts =
        nextAudience === 'all'
          ? combinedPrompts
          : combinedPrompts.filter((p) =>
              nextAudience === 'technical' ? isTechnicalPrompt(p) : !isTechnicalPrompt(p)
            );
      const nextCategories = new Set(nextPrompts.map((p) => resolveCanonicalCategoryId(p.categoryId)));
      if (!nextCategories.has(selectedCategory)) {
        setSelectedCategory('all');
      }
    }
  };

  const filteredPrompts = useMemo(() => {
    const queryLower = search.trim().toLowerCase();
    const queryNorm = normalizeVietnamese(search);

    const list = promptsInAudience.filter((p) => {
      const canonicalCat = resolveCanonicalCategoryId(p.categoryId);
      const matchCat = selectedCategory === 'all' || canonicalCat === selectedCategory;
      const matchTag =
        selectedTag === 'all' ||
        (p.tags || []).some((t) => t.trim().toLowerCase() === selectedTag);

      if (!matchCat || !matchTag) return false;
      if (!queryLower) return true;

      const catName = resolveCategoryName(p.categoryId);
      const tagLabels = (p.tags || []).map((t) => resolveTagLabel(t)).join(' ');
      const directHit =
        p.name.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower) ||
        p.skillName.toLowerCase().includes(queryLower) ||
        p.template.toLowerCase().includes(queryLower) ||
        catName.toLowerCase().includes(queryLower) ||
        tagLabels.toLowerCase().includes(queryLower);

      if (directHit) return true;
      if (!queryNorm) return false;

      const normHaystack = normalizeVietnamese(
        `${p.name} ${p.description} ${p.skillName} ${catName} ${tagLabels}`
      );
      return normHaystack.includes(queryNorm);
    });

    const difficultyOrder: Record<PromptDifficulty, number> = {
      easy: 1,
      medium: 2,
      advanced: 3,
    };

    return [...list].sort((a, b) => {
      if (sortBy === 'easy-first') {
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      if (sortBy === 'variables-desc') {
        return (b.variables?.length || 0) - (a.variables?.length || 0);
      }
      if (sortBy === 'community-first') {
        return Number(Boolean(b.isCommunity)) - Number(Boolean(a.isCommunity));
      }
      return 0;
    });
  }, [promptsInAudience, selectedCategory, selectedTag, search, sortBy]);

  const handleCopy = async (template: string, id: string, categoryId: string) => {
    const ok = await copyToClipboardWithFallback(template);
    if (ok) {
      setCopiedId(id);
      trackEvent('prompt_copied', { promptId: id, category: categoryId });
      toast.success('Đã sao chép câu lệnh vào bộ nhớ tạm!');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.error('Không thể sao chép tự động. Vui lòng thử lại.');
    }
  };

  const handleDeleteLocalPrompt = (id: string) => {
    deleteLocalCommunityPrompt(id);
    setCommunityPrompts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Đã xóa câu lệnh cá nhân khỏi trình duyệt.');
  };

  const handleOpenBuilder = (prompt: PromptItem) => {
    trackEvent('prompt_opened', { promptId: prompt.id, category: prompt.categoryId });
    setActivePrompt(prompt);
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
      {/* Resource Type Distinction Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-text mb-1">
            <FileText className="w-3.5 h-3.5 text-brand-500" />
            <span>Câu lệnh dùng ngay</span>
          </div>
          <p className="text-text-muted leading-relaxed">
            Văn bản chỉ dẫn hoàn chỉnh cho 1 tác vụ cụ thể, sao chép hoặc chạy trực tiếp trong AI Workspace.
          </p>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-text mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
            <span>Mẫu câu lệnh có biến</span>
          </div>
          <p className="text-text-muted leading-relaxed">
            Có sẵn các ô trống để bạn điền bối cảnh riêng (người nhận, mục tiêu, dữ liệu) trước khi chạy.
          </p>
        </div>
        <Link
          href="/workspace"
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 p-3.5 text-xs transition-colors group"
        >
          <div className="flex items-center justify-between font-bold text-text mb-1">
            <span className="flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-emerald-500" />
              <span>Quy trình AI Workspace</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-text-muted leading-relaxed">
            Luồng làm việc có cấu trúc (Email, Họp, Tài liệu) thực thi AI thật và lưu phiên làm việc.
          </p>
        </Link>
        <Link
          href="/agents"
          className="rounded-2xl border border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60 p-3.5 text-xs transition-colors group"
        >
          <div className="flex items-center justify-between font-bold text-text mb-1">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-500" />
              <span>Mẫu Trợ lý AI (14 mẫu)</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-text-muted leading-relaxed">
            Chỉ dẫn hệ thống (System Prompt) kèm cấu hình công cụ cho lập trình viên xây dựng trợ lý chuyên trách.
          </p>
        </Link>
      </div>

      {/* Audience Segment Tabs + Sort Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div
          role="tablist"
          aria-label="Phân loại theo đối tượng sử dụng"
          className="flex flex-wrap items-center gap-2"
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

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
          <label htmlFor="prompt-sort-select" className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Sắp xếp:
          </label>
          <select
            id="prompt-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          >
            <option value="recommended">Đề xuất mặc định</option>
            <option value="easy-first">Dễ áp dụng trước</option>
            <option value="variables-desc">Nhiều ô tùy chỉnh nhất</option>
            <option value="community-first">Đóng góp mới trước</option>
          </select>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm câu lệnh (hỗ trợ gõ có dấu hoặc không dấu)..."
            aria-label="Tìm kiếm câu lệnh"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
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
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedTag('all');
              }}
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

      {/* Tag Quick Filters */}
      {popularTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6" role="group" aria-label="Lọc theo chủ đề">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mr-1">
            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
            Chủ đề phổ biến:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            aria-pressed={selectedTag === 'all'}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              selectedTag === 'all'
                ? 'border-accent bg-accent/10 text-accent font-semibold'
                : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-accent/40'
            }`}
          >
            Tất cả chủ đề
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              aria-pressed={selectedTag === tag}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                selectedTag === tag
                  ? 'border-accent bg-accent/10 text-accent font-semibold'
                  : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-accent/40'
              }`}
            >
              {resolveTagLabel(tag)}
            </button>
          ))}
        </div>
      )}

      {/* Prompts Count & Submit CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{filteredPrompts.length}</span> mẫu câu lệnh
          {communityPrompts.length > 0 && (
            <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">
              (bao gồm {communityPrompts.length} câu lệnh đóng góp)
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/ai-work"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-accent/50 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span>Chọn theo nhóm việc</span>
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-300 text-xs font-semibold transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Đóng góp câu lệnh mới</span>
          </Link>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPrompts.map((prompt) => {
          const categoryLabel = resolveCategoryName(prompt.categoryId);
          const variableCount = prompt.variables?.length ?? 0;
          const isExpanded = Boolean(expandedTemplates[prompt.id]);
          const workspaceHref = `/workspace?workflow=custom-prompt&promptId=${encodeURIComponent(prompt.id)}`;

          return (
            <div
              key={prompt.id}
              id={`prompt-${prompt.id}`}
              className="min-w-0 flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      {categoryLabel}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                      {variableCount > 0 ? `Mẫu có ${variableCount} ô điền` : 'Câu lệnh dùng ngay'}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${PROMPT_DIFFICULTY_COLORS[prompt.difficulty]}`}>
                      {PROMPT_DIFFICULTY_LABELS[prompt.difficulty]}
                    </span>
                    {prompt.isCommunity && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {prompt.isLocalOnly ? 'Đã lưu cục bộ' : 'Cộng đồng'}
                      </span>
                    )}
                  </div>

                  {prompt.skillSlug ? (
                    <Link
                      href={`/skill/${prompt.skillSlug}`}
                      className="text-xs text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
                    >
                      {prompt.skillName} <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">{prompt.skillName}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{prompt.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {prompt.description}
                </p>

                {/* Variable Preview Chips */}
                {variableCount > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Thông tin cần điền:</span>
                    {prompt.variables.slice(0, 4).map((v) => (
                      <span
                        key={v.name}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {v.label}
                      </span>
                    ))}
                    {variableCount > 4 && (
                      <span className="text-[11px] text-gray-400">+{variableCount - 4}</span>
                    )}
                  </div>
                )}

                {/* Collapsible Clean Template Preview */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTemplates((prev) => ({ ...prev, [prompt.id]: !prev[prompt.id] }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Thu gọn câu lệnh gốc</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Xem đầy đủ câu lệnh gốc</span>
                        </>
                      )}
                    </button>
                    {prompt.isLocalOnly && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLocalPrompt(prompt.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
                        aria-label={`Xóa câu lệnh cá nhân ${prompt.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  <div
                    className={`relative rounded-xl bg-gray-50 dark:bg-gray-950 p-3.5 border border-gray-100 dark:border-gray-800 font-mono text-xs text-gray-700 dark:text-gray-300 overflow-auto transition-all ${
                      isExpanded ? 'max-h-72' : 'max-h-24'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap wrap-break-word">{prompt.template}</pre>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenBuilder(prompt)}
                      className="gap-1.5 text-xs"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Điền thông tin & Dùng ngay</span>
                    </Button>

                    <Link
                      href={workspaceHref}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem(
                            'ai_life_hub_workspace_draft_prompt',
                            JSON.stringify({
                              id: prompt.id,
                              title: prompt.name,
                              template: prompt.template,
                              categoryId: prompt.categoryId,
                            })
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/30 text-xs font-semibold transition-all"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Chạy trong AI Workspace</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(prompt.template, prompt.id, prompt.categoryId)}
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

                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                  <span className="text-[11px] text-gray-400 mr-auto">Mở ngoài trên:</span>
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
        <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
            Không tìm thấy mẫu câu lệnh nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedTag('all');
              setSelectedAudience('all');
            }}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Đặt lại toàn bộ bộ lọc
          </button>
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
