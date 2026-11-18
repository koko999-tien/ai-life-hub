'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight, Clock, BookOpen, FileText, Bot, Link as LinkIcon, Tag, Wrench } from 'lucide-react';
import { SearchResult, SearchDocument } from '@/types';
import { cn, normalizeVietnamese } from '@/lib/utils';
import { Highlight } from './Highlight';
import { normalizeSearchUrl, resolveCategoryName } from '@/components/skill/categoryHelpers';
import { resolveTagLabel } from '@/lib/constants';

const TYPE_ICONS = {
  tool: Wrench,
  skill: BookOpen,
  prompt: FileText,
  agent: Bot,
  resource: LinkIcon,
  category: Tag,
};

const TYPE_LABELS = {
  tool: 'Công cụ & Không gian làm việc',
  skill: 'Kỹ năng',
  prompt: 'Câu lệnh mẫu',
  agent: 'Trợ lý AI',
  resource: 'Tài nguyên',
  category: 'Danh mục',
};

const TYPE_COLORS = {
  tool: 'text-orange-600 dark:text-orange-400',
  skill: 'text-blue-600 dark:text-blue-400',
  prompt: 'text-amber-600 dark:text-amber-400',
  agent: 'text-purple-600 dark:text-purple-400',
  resource: 'text-green-600 dark:text-green-400',
  category: 'text-slate-600 dark:text-slate-400',
};

let cachedIndex: SearchDocument[] | null = null;

function searchIndexDocuments(q: string, docs: SearchDocument[]): SearchResult[] {
  if (!q.trim() || docs.length === 0) {
    return [];
  }

  const lowerQuery = q.trim().toLowerCase();
  const normalizedQuery = normalizeVietnamese(q);
  const queryTerms = normalizedQuery.split(' ').filter((t) => t.length >= 2);

  const scored = docs
    .map((doc) => {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();
      const tagsLower = doc.tags.map((t) => t.toLowerCase()).join(' ');

      const titleNorm = normalizeVietnamese(doc.title);
      const contentNorm = normalizeVietnamese(doc.content);
      const tagsNorm = normalizeVietnamese(tagsLower);

      if (titleLower.includes(lowerQuery)) score += 14 * (doc.boost || 1);
      else if (normalizedQuery && titleNorm.includes(normalizedQuery)) score += 10 * (doc.boost || 1);

      if (contentLower.includes(lowerQuery)) score += 6;
      else if (normalizedQuery && contentNorm.includes(normalizedQuery)) score += 4;

      if (tagsLower.includes(lowerQuery) || (normalizedQuery && tagsNorm.includes(normalizedQuery))) {
        score += 4;
      }

      queryTerms.forEach((term) => {
        if (titleNorm.includes(term)) score += 3;
        if (contentNorm.includes(term)) score += 1.5;
        if (tagsNorm.includes(term)) score += 1;
      });

      return { ...doc, score };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  const grouped: Record<string, SearchResult[]> = {};
  scored.forEach((doc) => {
    if (!grouped[doc.type]) grouped[doc.type] = [];
    if (grouped[doc.type].length < 5) {
      grouped[doc.type].push({
        id: doc.id,
        type: doc.type,
        title: doc.title,
        description: doc.content.slice(0, 160),
        categoryId: doc.categoryId,
        skillId: doc.skillId,
        tags: doc.tags,
        url: normalizeSearchUrl(doc.url),
      });
    }
  });

  return Object.values(grouped).flatMap((items) =>
    items.map((item) => ({ ...item, type: item.type as SearchResult['type'] }))
  );
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState<SearchDocument[]>(() => cachedIndex ?? []);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(() => cachedIndex === null);
  const [loadError, setLoadError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchIndexDocuments(query, index), [query, index]);

  useEffect(() => {
    const stored = localStorage.getItem('ai-life-hub-recent-searches');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item): item is string => typeof item === 'string'));
        }
      } catch {
        // Ignore
      }
    }

    if (cachedIndex !== null) {
      setIndex(cachedIndex);
      setLoading(false);
      setLoadError(false);
      return;
    }

    const controller = new AbortController();
    const loadIndex = async () => {
      try {
        const res = await fetch('/search-index.json', { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!controller.signal.aborted) {
          const docs: SearchDocument[] = Array.isArray(data?.documents) ? data.documents : [];
          cachedIndex = docs;
          setIndex(docs);
          setLoadError(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setLoadError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    loadIndex();

    return () => {
      controller.abort();
    };
  }, []);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      const trimmed = query.trim();
      if (trimmed) {
        const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 10);
        try {
          localStorage.setItem('ai-life-hub-recent-searches', JSON.stringify(updated));
        } catch {
          // Ignore storage errors
        }
        setRecentSearches(updated);
      }
      const targetUrl = normalizeSearchUrl(result.url);
      onClose();
      if (/^https?:\/\//.test(targetUrl)) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        router.push(targetUrl);
      }
    },
    [query, recentSearches, onClose, router]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (results.length > 0) {
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (results.length > 0) {
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleResultClick]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    setSelectedIndex(0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  const handleRecentClick = (recent: string) => {
    setQuery(recent);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const activeDescendantId = results[selectedIndex] ? `result-${results[selectedIndex].id}` : undefined;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm nhanh"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl animate-scale-in">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-elevated border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              value={query}
              onChange={handleInputChange}
              placeholder="Tìm kỹ năng, câu lệnh mẫu, trợ lý AI, tài nguyên... (⌘K để mở)"
              className="w-full pl-12 pr-28 py-4 text-base sm:text-lg bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500"
              autoComplete="off"
              spellCheck={false}
              aria-label="Tìm kiếm"
              aria-autocomplete="list"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={activeDescendantId}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 text-xs text-gray-400 pointer-events-none">
              <kbd className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 font-mono dark:bg-gray-800">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </div>
          </div>

          <div id="search-results" className="max-h-[60vh] overflow-y-auto" role="listbox" aria-label="Kết quả tìm kiếm">
            {loading ? (
              <div className="p-8 text-center text-gray-500" role="status">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto mb-2" />
                Đang tải dữ liệu tìm kiếm...
              </div>
            ) : loadError ? (
              <div className="p-8 text-center text-red-600 dark:text-red-400" role="alert">
                <p className="text-base font-medium">Không thể tải dữ liệu tìm kiếm</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Vui lòng tải lại trang hoặc thử lại sau.
                </p>
              </div>
            ) : query.trim() === '' ? (
              <div className="p-6">
                {recentSearches.length > 0 && (
                  <div className="mb-6" role="group" aria-label="Tìm kiếm gần đây">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tìm kiếm gần đây
                    </h3>
                    <div className="flex flex-wrap gap-2 px-4">
                      {recentSearches.slice(0, 8).map((recent) => (
                        <button
                          key={recent}
                          type="button"
                          onClick={() => handleRecentClick(recent)}
                          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          role="option"
                          aria-selected={false}
                        >
                          <Clock className="h-3 w-3 mr-1.5 inline" aria-hidden="true" />
                          {recent}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="px-4" role="group" aria-label="Gợi ý phổ biến">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gợi ý phổ biến
                  </h3>
                  <div className="space-y-1">
                    {[
                      { query: 'học tập', label: 'Kỹ năng học tập' },
                      { query: 'viết blog', label: 'Viết bài blog' },
                      { query: 'review code', label: 'Đánh giá mã nguồn' },
                      { query: 'thiết kế UI', label: 'Thiết kế giao diện' },
                      { query: 'tài chính cá nhân', label: 'Quản lý tài chính cá nhân' },
                    ].map((suggestion) => (
                      <button
                        key={suggestion.query}
                        type="button"
                        onClick={() => handleRecentClick(suggestion.query)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        role="option"
                        aria-selected={false}
                      >
                        <span>{suggestion.label}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p className="text-lg font-medium">Không tìm thấy kết quả</p>
                <p className="mt-2 text-sm">Thử từ khóa khác hoặc kiểm tra chính tả</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(
                  results.reduce((acc, result) => {
                    if (!acc[result.type]) acc[result.type] = [];
                    acc[result.type].push(result);
                    return acc;
                  }, {} as Record<string, SearchResult[]>)
                ).map(([type, items]) => {
                  const TypeIcon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
                  const typeLabel = TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type;
                  return (
                    <div key={type} className="mb-4" role="group" aria-label={typeLabel}>
                      <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        {TypeIcon && <TypeIcon className={cn('h-4 w-4', TYPE_COLORS[type as keyof typeof TYPE_COLORS])} aria-hidden="true" />}
                        {typeLabel} ({items.length})
                      </h3>
                      <div className="space-y-1 px-2 pb-2">
                        {items.map((result) => {
                          const globalIndex = results.indexOf(result);
                          const isSelected = globalIndex === selectedIndex;
                          const ResultIcon = TYPE_ICONS[result.type as keyof typeof TYPE_ICONS];
                          const categoryName = result.categoryId ? resolveCategoryName(result.categoryId) : '';
                          return (
                            <button
                              key={result.id}
                              type="button"
                              onClick={() => handleResultClick(result)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={cn(
                                'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                isSelected
                                  ? 'bg-brand-50 dark:bg-brand-900/30 text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              )}
                              role="option"
                              aria-selected={isSelected}
                              id={`result-${result.id}`}
                            >
                              {ResultIcon && (
                                <ResultIcon
                                  className={cn('h-5 w-5 flex-shrink-0 mt-0.5', TYPE_COLORS[result.type as keyof typeof TYPE_COLORS])}
                                  aria-hidden="true"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Highlight text={result.title} query={query} className="font-medium" />
                                  {categoryName && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                      {categoryName}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-sm line-clamp-2">
                                  <Highlight text={result.description} query={query} />
                                </p>
                                {result.tags.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {result.tags.slice(0, 3).map((tag) => (
                                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        {`#${resolveTagLabel(tag)}`}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <ChevronRight className="h-4 w-4 text-brand-500 flex-shrink-0" aria-hidden="true" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Nhấn <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Esc</kbd> để đóng</span>
            <span>↑ ↓ để chọn, Enter để mở</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
