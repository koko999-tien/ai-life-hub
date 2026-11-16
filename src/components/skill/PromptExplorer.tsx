'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Copy, Check, ExternalLink, ArrowRight, Bot, Cpu, Bookmark, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useBookmarks } from '@/hooks/useBookmarks';

interface PromptItem {
  id: string;
  name: string;
  description: string;
  template: string;
  skillName: string;
  skillSlug: string;
  categoryId: string;
  variables?: Array<{ name: string; label: string; default?: string }>;
}

interface PromptExplorerProps {
  initialPrompts: PromptItem[];
}

export function PromptExplorer({ initialPrompts }: PromptExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isBookmarked, toggle } = useBookmarks();

  const categories = useMemo(() => {
    const set = new Set(initialPrompts.map((p) => p.categoryId));
    return ['all', ...Array.from(set)];
  }, [initialPrompts]);

  const filteredPrompts = useMemo(() => {
    return initialPrompts.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const query = search.toLowerCase();
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.skillName.toLowerCase().includes(query) ||
        p.template.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [initialPrompts, selectedCategory, search]);

  const handleCopy = (template: string, id: string) => {
    navigator.clipboard.writeText(template);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAI = (template: string, service: 'chatgpt' | 'claude' | 'gemini') => {
    const encoded = encodeURIComponent(template);
    if (service === 'chatgpt') {
      window.open(`https://chatgpt.com/?q=${encoded}`, '_blank');
    } else if (service === 'claude') {
      window.open(`https://claude.ai/new?q=${encoded}`, '_blank');
    } else if (service === 'gemini') {
      window.open(`https://gemini.google.com/app`, '_blank');
    }
  };

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm prompt theo tên, nội dung hoặc kỹ năng..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Count & Submit CTA */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{filteredPrompts.length}</span> prompt templates
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-300 text-xs font-semibold transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Đóng góp Prompt mới</span>
        </Link>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  {prompt.categoryId}
                </span>
                <Link
                  href={`/skill/${prompt.skillSlug}`}
                  className="text-xs text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
                >
                  {prompt.skillName} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{prompt.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {prompt.description}
              </p>

              {/* Template Preview Box */}
              <div className="relative rounded-xl bg-gray-50 dark:bg-gray-950 p-4 border border-gray-100 dark:border-gray-800 mb-4 font-mono text-xs text-gray-700 dark:text-gray-300 max-h-36 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{prompt.template}</pre>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(prompt.template, prompt.id)}
                  className="gap-1.5 text-xs"
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>

                <button
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
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isBookmarked(prompt.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenAI(prompt.template, 'chatgpt')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-600 transition-colors"
                  title="Chạy trên ChatGPT"
                >
                  ChatGPT
                </button>
                <button
                  onClick={() => handleOpenAI(prompt.template, 'claude')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:text-amber-600 transition-colors"
                  title="Chạy trên Claude"
                >
                  Claude
                </button>
                <button
                  onClick={() => handleOpenAI(prompt.template, 'gemini')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  title="Chạy trên Gemini"
                >
                  Gemini
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          Không tìm thấy prompt nào phù hợp với từ khóa của bạn.
        </div>
      )}
    </div>
  );
}
