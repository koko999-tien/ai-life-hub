'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, BookOpen, FileText, Bot, FolderOpen, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui';
import { searchDocuments, type SearchResult } from '@/lib/search';
import { normalizeSearchUrl, resolveCategoryName } from '@/components/skill/categoryHelpers';
import type { SearchResult as CoreSearchResult } from '@/types';

type FilterType = 'all' | CoreSearchResult['type'];

const TYPE_META: Record<
  CoreSearchResult['type'],
  { label: string; badgeClass: string; Icon: typeof BookOpen }
> = {
  skill: {
    label: 'Kỹ năng',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Icon: BookOpen,
  },
  prompt: {
    label: 'Câu lệnh mẫu',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    Icon: FileText,
  },
  agent: {
    label: 'Trợ lý AI',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Icon: Bot,
  },
  category: {
    label: 'Danh mục',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    Icon: FolderOpen,
  },
  resource: {
    label: 'Tài nguyên',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    Icon: LinkIcon,
  },
};

const QUICK_SUGGESTIONS = ['Viết email', 'Học tập', 'Tài chính', 'Lập trình', 'Thiết kế', 'SEO'];

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeType, setActiveType] = useState<FilterType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const searchRes = await searchDocuments(query, { limit: 100 });
        setResults(searchRes);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const counts = useMemo(() => {
    const map: Record<FilterType, number> = {
      all: results.length,
      skill: 0,
      prompt: 0,
      agent: 0,
      category: 0,
      resource: 0,
    };
    results.forEach((item) => {
      const t = item.type as CoreSearchResult['type'];
      if (t in map) {
        map[t] += 1;
      }
    });
    return map;
  }, [results]);

  const filteredResults = useMemo(() => {
    if (activeType === 'all') return results;
    return results.filter((r) => r.type === activeType);
  }, [results, activeType]);

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'skill', label: 'Kỹ năng' },
    { id: 'prompt', label: 'Câu lệnh mẫu' },
    { id: 'agent', label: 'Trợ lý AI' },
    { id: 'category', label: 'Danh mục' },
    { id: 'resource', label: 'Tài nguyên' },
  ];

  return (
    <div className="container mx-auto px-section-x pt-24 pb-16 max-w-5xl">
      <h1 className="heading-2 mb-3 text-text">Tìm kiếm toàn trang</h1>
      <p className="text-text-muted mb-8">
        Tìm nhanh kỹ năng ứng dụng AI, câu lệnh mẫu, trợ lý AI cấu hình sẵn, danh mục và tài nguyên học tập.
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập từ khóa: viết email, học tiếng Anh, tài chính, lập trình..."
          aria-label="Tìm kiếm kỹ năng, câu lệnh mẫu, trợ lý AI và tài nguyên"
          className="pl-11 h-14 text-base sm:text-lg"
          autoFocus
        />
      </div>

      {/* Type Filter Tabs */}
      {query.trim() && !loading && results.length > 0 && (
        <div
          role="tablist"
          aria-label="Lọc kết quả theo loại nội dung"
          className="flex flex-wrap gap-2 mb-8"
        >
          {filterTabs.map((tab) => {
            const isSelected = activeType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-bg-elevated border border-border text-text-muted hover:text-text hover:border-accent/40'
                }`}
              >
                {tab.label} ({counts[tab.id]})
              </button>
            );
          })}
        </div>
      )}

      {!query.trim() ? (
        <div className="rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8">
          <h2 className="text-base font-semibold text-text mb-3">Gợi ý tìm kiếm nhanh</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {QUICK_SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3.5 py-1.5 rounded-full text-sm bg-bg border border-border text-text-muted hover:text-text hover:border-accent/40 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/prompts" className="inline-flex items-center gap-1.5 text-accent font-medium hover:underline">
              Khám phá thư viện câu lệnh <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-accent font-medium hover:underline">
              Xem tất cả 16 danh mục <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted" role="status">
          <Loader2 className="h-8 w-8 text-accent animate-spin" aria-hidden="true" />
          <span className="text-sm">Đang tìm kiếm...</span>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="rounded-2xl border border-border bg-bg-elevated p-10 text-center">
          <p className="text-base font-medium text-text mb-2">
            Không tìm thấy kết quả phù hợp cho &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-text-muted mb-4">
            Thử từ khóa ngắn gọn hơn hoặc chuyển sang mục &ldquo;Tất cả&rdquo;.
          </p>
          {activeType !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveType('all')}
              className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Xem tất cả kết quả ({results.length})
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="Danh sách kết quả tìm kiếm">
          {filteredResults.map((item) => {
            const meta = TYPE_META[item.type as CoreSearchResult['type']] || TYPE_META.skill;
            const ItemIcon = meta.Icon;
            const targetUrl = normalizeSearchUrl(item.url);
            const isExternal = /^https?:\/\//.test(targetUrl);
            const categoryLabel = item.categoryId ? resolveCategoryName(item.categoryId) : '';

            const cardInner = (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center flex-shrink-0 mt-0.5 text-accent">
                  <ItemIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                    {categoryLabel && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs bg-bg border border-border text-text-muted">
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-text group-hover:text-accent transition-colors">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            );

            return (
              <div key={item.id} role="listitem">
                {isExternal ? (
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group card p-4 block hover:border-accent/40 transition-colors"
                  >
                    {cardInner}
                  </a>
                ) : (
                  <Link
                    href={targetUrl}
                    className="group card p-4 block hover:border-accent/40 transition-colors"
                  >
                    {cardInner}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-section-x pt-24 pb-16 text-text-muted">Đang tải trang tìm kiếm...</div>}>
      <SearchContent />
    </Suspense>
  );
}
