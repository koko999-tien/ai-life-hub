'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, ChevronRight, Clock, BookOpen, FileText, Bot, Link as LinkIcon, Tag } from 'lucide-react';
import { SearchResult, SearchDocument } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Highlight } from './Highlight';

const TYPE_ICONS = {
  skill: BookOpen,
  prompt: FileText,
  agent: Bot,
  resource: LinkIcon,
  category: Tag,
};

const TYPE_LABELS = {
  skill: 'Skill',
  prompt: 'Prompt',
  agent: 'Agent',
  resource: 'Tài nguyên',
  category: 'Danh mục',
};

const TYPE_COLORS = {
  skill: 'text-blue-600 dark:text-blue-400',
  prompt: 'text-amber-600 dark:text-amber-400',
  agent: 'text-purple-600 dark:text-purple-400',
  resource: 'text-green-600 dark:text-green-400',
  category: 'text-slate-600 dark:text-slate-400',
};

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState<SearchDocument[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadIndex = async () => {
      try {
        const res = await fetch('/search-index.json');
        if (res.ok) {
          const data = await res.json();
          setIndex(data.documents || []);
        }
      } catch {
        // Ignore errors
      } finally {
        setLoading(false);
      }
    };
    loadIndex();

    const stored = localStorage.getItem('ai-life-hub-recent-searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      const maxIndex = results.length - 1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, maxIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      if (portalRef.current) {
        document.body.appendChild(portalRef.current);
      }
    }
    return () => {
      if (portalRef.current?.parentNode) {
        portalRef.current.parentNode.removeChild(portalRef.current);
      }
    };
  }, [isOpen]);

  const performSearch = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = q.toLowerCase();
    const scored = index
      .map((doc) => {
        let score = 0;
        const title = doc.title.toLowerCase();
        const content = doc.content.toLowerCase();
        const tags = doc.tags.map((t) => t.toLowerCase()).join(' ');

        if (title.includes(lowerQuery)) score += 10 * (doc.boost || 1);
        if (content.includes(lowerQuery)) score += 5;
        if (tags.includes(lowerQuery)) score += 3;

        lowerQuery.split(' ').forEach((term) => {
          if (term.length > 2) {
            if (title.includes(term)) score += 3;
            if (content.includes(term)) score += 2;
            if (tags.includes(term)) score += 1;
          }
        });

        return { ...doc, score };
      })
      .filter((d) => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

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
          url: doc.url,
        });
      }
    });

    const flattened = Object.entries(grouped).flatMap(([type, items]) =>
      items.map((item) => ({ ...item, type: item.type as SearchResult['type'] }))
    );

    setResults(flattened);
  }, [index]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    performSearch(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    if (recentSearches.includes(query) === false && query.trim()) {
      const updated = [query, ...recentSearches].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('ai-life-hub-recent-searches', JSON.stringify(updated));
    }
    window.location.href = result.url;
    onClose();
  };

  const handleRecentClick = (recent: string) => {
    setQuery(recent);
    performSearch(recent);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const content = (
    <div
      ref={portalRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
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
              value={query}
              onChange={handleInputChange}
              placeholder="Tìm skills, prompts, agents, tài nguyên... (⌘K để mở)"
              className="w-full pl-12 pr-12 py-4 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500"
              autoComplete="off"
              spellCheck={false}
              aria-label="Tìm kiếm"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-gray-400">
              <kbd className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 font-mono dark:bg-gray-800">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </div>
          </div>

          <div id="search-results" className="max-h-[60vh] overflow-y-auto" role="listbox" aria-label="Kết quả tìm kiếm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto mb-2" />
                Đang tải chỉ mục tìm kiếm...
              </div>
            ) : query.trim() === '' ? (
              <div className="p-6">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tìm kiếm gần đây
                    </h3>
                    <div className="flex flex-wrap gap-2 px-4">
                      {recentSearches.slice(0, 8).map((recent) => (
                        <button
                          key={recent}
                          onClick={() => handleRecentClick(recent)}
                          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          role="option"
                        >
                          <Clock className="h-3 w-3 mr-1.5 inline" aria-hidden="true" />
                          {recent}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="px-4">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gợi ý
                  </h3>
                  <div className="space-y-1">
                    {[
                      { query: 'học tập', label: 'Kỹ thuật học tập' },
                      { query: 'viết blog', label: 'Viết bài blog' },
                      { query: 'review code', label: 'Code review' },
                      { query: 'thiết kế UI', label: 'UI design' },
                      { query: 'tài chính cá nhân', label: 'Quản lý tiền' },
                    ].map((suggestion) => (
                      <button
                        key={suggestion.query}
                        onClick={() => handleRecentClick(suggestion.query)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        role="option"
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
              <div className="p-2" role="list">
                {Object.entries(
                  results.reduce((acc, result) => {
                    if (!acc[result.type]) acc[result.type] = [];
                    acc[result.type].push(result);
                    return acc;
                  }, {} as Record<string, SearchResult[]>)
                ).map(([type, items]) => {
                  const TypeIcon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
                  return (
                    <div key={type} className="mb-4">
                      <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        {TypeIcon && <TypeIcon className={cn('h-4 w-4', TYPE_COLORS[type as keyof typeof TYPE_COLORS])} aria-hidden="true" />}
                        {TYPE_LABELS[type as keyof typeof TYPE_LABELS]} ({items.length})
                      </h3>
                      <div className="space-y-1 px-2 pb-2" role="listbox">
                        {items.map((result, i) => {
                          const globalIndex = results.indexOf(result);
                          const isSelected = globalIndex === selectedIndex;
                          const ResultIcon = TYPE_ICONS[result.type as keyof typeof TYPE_ICONS];
                          return (
                            <button
                              key={result.id}
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
                              {ResultIcon && <ResultIcon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', TYPE_COLORS[result.type as keyof typeof TYPE_COLORS])} aria-hidden="true" />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Highlight text={result.title} query={query} className="font-medium" />
                                {result.categoryId && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    {result.categoryId}
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
                                      #{tag}
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