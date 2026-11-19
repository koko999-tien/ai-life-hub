'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { SearchResultItem } from './SearchResultItem';
import { useSearch } from './useSearch';
import type { SearchDocument, SearchResultType, SearchFilters } from '@/types/search';
import { DIFFICULTY_LABELS } from '@/lib/constants';
import { resolveCategoryName } from '@/components/skill/categoryHelpers';

const RESULTS_PER_PAGE = 20;

const typeOptions: { value: SearchResultType; label: string }[] = [
  { value: 'skill', label: 'Kỹ năng' },
  { value: 'prompt', label: 'Câu lệnh mẫu' },
  { value: 'agent', label: 'Trợ lý AI' },
  { value: 'resource', label: 'Tài nguyên' },
  { value: 'category', label: 'Danh mục' },
];

const difficultyOptions: { value: string; label: string }[] = [
  { value: 'beginner', label: DIFFICULTY_LABELS.beginner },
  { value: 'intermediate', label: DIFFICULTY_LABELS.intermediate },
  { value: 'advanced', label: DIFFICULTY_LABELS.advanced },
];

export function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const initialFilters: SearchFilters = useMemo(
    () => ({
      category: searchParams.get('category') || undefined,
      type: (searchParams.get('type') as SearchResultType) || undefined,
      difficulty: (searchParams.get('difficulty') as SearchFilters['difficulty']) || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: RESULTS_PER_PAGE,
    }),
    [searchParams]
  );

  const {
    query,
    filteredResults,
    filters,
    isLoading,
    totalResults,
    totalPages,
    setQuery,
    setFilters,
    clearFilters,
    addToHistory,
  } = useSearch(initialFilters);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category) params.set('category', filters.category);
    if (filters.type) params.set('type', filters.type);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [query, filters, router, pathname]);

  useEffect(() => {
    if (query.trim()) {
      addToHistory(query);
    }
  }, [query, addToHistory]);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
    },
    [setQuery]
  );

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string | number | undefined) => {
      setFilters({ [key]: value } as Partial<SearchFilters>);
    },
    [setFilters]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setQuery('');
  }, [clearFilters, setQuery]);

  const hasActiveFilters = Boolean(filters.category || filters.type || filters.difficulty);

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    filteredResults.forEach((r) => {
      const cat = r.category || (r as SearchDocument & { categoryId?: string }).categoryId;
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [filteredResults]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Kết quả tìm kiếm
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tìm thấy {totalResults} kết quả
              {query && (
                <span className="ml-1.5">
                  cho &ldquo;<strong>{query}</strong>&rdquo;
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200"
            aria-label="Mở bộ lọc tìm kiếm"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Bộ lọc
          </button>
        </header>

        <div className="flex gap-6">
          <aside
            className={`
              w-64 shrink-0
              ${isMobileDrawerOpen ? 'fixed inset-y-0 left-0 z-40 block bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto' : 'hidden lg:block'}
            `}
            aria-label="Bộ lọc tìm kiếm"
          >
            <div className="sticky top-8 space-y-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 h-fit">
              {isMobileDrawerOpen && (
                <div className="flex items-center justify-between lg:hidden pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Bộ lọc</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                    aria-label="Đóng bộ lọc"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="search-input" className="sr-only">
                  Từ khóa tìm kiếm
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="search-input"
                    type="search"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Lọc thêm kết quả..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa tất cả bộ lọc
                </button>
              )}

              <FilterSection
                title="Danh mục"
                options={uniqueCategories}
                selected={filters.category}
                onChange={(v) => handleFilterChange('category', v)}
                renderOption={(cat) => resolveCategoryName(cat)}
              />

              <FilterSection
                title="Loại nội dung"
                options={typeOptions}
                selected={filters.type}
                onChange={(v) => handleFilterChange('type', v)}
                renderOption={(opt) => opt.label}
                getValue={(opt) => opt.value}
              />

              <FilterSection
                title="Độ khó"
                options={difficultyOptions}
                selected={filters.difficulty}
                onChange={(v) => handleFilterChange('difficulty', v)}
                renderOption={(opt) => opt.label}
                getValue={(opt) => opt.value}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-4" aria-busy="true" aria-label="Đang tải kết quả">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Không tìm thấy kết quả</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {query ? `Không có kết quả nào khớp với “${query}”` : 'Hãy nhập từ khóa hoặc điều chỉnh bộ lọc để tìm kiếm'}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6" role="listbox" aria-label="Danh sách kết quả tìm kiếm">
                  {filteredResults.map((result) => (
                    <SearchResultItem key={result.id} result={result} query={query} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2" aria-label="Phân trang kết quả tìm kiếm">
                    <button
                      type="button"
                      onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                      disabled={!filters.page || filters.page <= 1}
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Trang trước"
                    >
                      Trang trước
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if ((filters.page || 1) <= 3) {
                          pageNum = i + 1;
                        } else if ((filters.page || 1) >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = (filters.page || 1) - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handleFilterChange('page', pageNum)}
                            className={`
                              w-10 h-10 text-sm font-medium rounded-lg transition-colors
                              ${
                                pageNum === (filters.page || 1)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }
                            `}
                            aria-label={`Trang ${pageNum}`}
                            aria-current={pageNum === (filters.page || 1) ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                      disabled={(filters.page || 1) >= totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Trang sau"
                    >
                      Trang sau
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

interface FilterSectionProps<T> {
  title: string;
  options: T[] | readonly T[];
  selected: string | undefined;
  onChange: (value: string | undefined) => void;
  renderOption: (option: T) => string;
  getValue?: (option: T) => string;
}

function FilterSection<T>({ title, options, selected, onChange, renderOption, getValue }: FilterSectionProps<T>) {
  return (
    <details open>
      <summary className="flex items-center justify-between cursor-pointer font-medium text-gray-900 dark:text-gray-100">
        {title}
        <svg className="w-4 h-4 text-gray-500 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="mt-2 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
        {options.map((option) => {
          const value = getValue ? getValue(option) : String(option);
          const label = renderOption(option);
          const isSelected = selected === value;
          return (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onChange(e.target.checked ? value : undefined)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{label}</span>
            </label>
          );
        })}
      </div>
    </details>
  );
}

export default function SearchResultsPage() {
  return <SearchResultsClient />;
}
