'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ArrowRight, BookOpen, Sparkles, ExternalLink, BookmarkX } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Button } from '@/components/ui';

export default function FavoritesPage() {
  const { bookmarks, isLoading, toggle } = useBookmarks();
  const [filterType, setFilterType] = useState<'all' | 'skill' | 'prompt' | 'resource'>('all');

  const filtered = bookmarks.filter((b) => filterType === 'all' || b.itemType === filterType);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-xs font-semibold mb-3">
            <Bookmark className="h-3.5 w-3.5 fill-current" />
            <span>Đồng bộ Supabase & LocalStorage</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Mục Yêu Thích Của Bạn
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">
            Tất cả các kỹ năng, prompt templates và tài nguyên bạn đã đánh dấu lưu lại để truy cập nhanh chóng bất cứ lúc nào.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Tất cả ({bookmarks.length})
          </button>
          <button
            onClick={() => setFilterType('skill')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === 'skill'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Kỹ năng ({bookmarks.filter((b) => b.itemType === 'skill').length})
          </button>
          <button
            onClick={() => setFilterType('prompt')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === 'prompt'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Prompt Templates ({bookmarks.filter((b) => b.itemType === 'prompt').length})
          </button>
          <button
            onClick={() => setFilterType('resource')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === 'resource'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Tài nguyên ({bookmarks.filter((b) => b.itemType === 'resource').length})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">Đang tải danh sách yêu thích...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <BookmarkX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Chưa có mục nào trong danh sách
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Bạn có thể bấm vào biểu tượng dấu trang ở bất kỳ kỹ năng hay prompt nào để lưu lại tại đây.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/categories">Khám phá kỹ năng</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/prompts">Xem Prompt Templates</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      {item.itemType}
                    </span>
                    <button
                      onClick={() =>
                        toggle({
                          itemType: item.itemType,
                          itemId: item.itemId,
                          itemTitle: item.itemTitle,
                          itemSlug: item.itemSlug,
                          categoryId: item.categoryId,
                        })
                      }
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {item.itemTitle}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Danh mục: {item.categoryId}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Lưu ngày {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <Link
                    href={
                      item.itemType === 'skill'
                        ? `/skill/${item.itemSlug}`
                        : item.itemType === 'prompt'
                        ? `/prompts`
                        : `/resources`
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
