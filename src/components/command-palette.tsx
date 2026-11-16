'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  type: 'category' | 'skill' | 'resource' | 'prompt';
}

const mockResults: SearchResult[] = [
  { id: '1', title: 'Prompt Engineering Basics', description: 'Học cách viết prompt hiệu quả cho LLM', href: '/skill/prompt-engineering-basics', category: 'Kỹ năng', type: 'skill' },
  { id: '2', title: 'AI Agents Workshop', description: 'Xây dựng agent AI tự động hóa quy trình', href: '/skill/ai-agents-workshop', category: 'Kỹ năng', type: 'skill' },
  { id: '3', title: 'ChatGPT Prompt Library', description: 'Bộ sưu tập 100+ prompt sẵn sàng sử dụng', href: '/resources/chatgpt-prompt-library', category: 'Tài nguyên', type: 'resource' },
  { id: '4', title: 'LLM Fine-tuning Guide', description: 'Hướng dẫn tinh chỉnh mô hình ngôn ngữ lớn', href: '/category/llm-fine-tuning', category: 'Danh mục', type: 'category' },
  { id: '5', title: 'RAG Implementation', description: 'Triển khai Retrieval-Augmented Generation', href: '/skill/rag-implementation', category: 'Kỹ năng', type: 'skill' },
  { id: '6', title: 'Vector Databases Comparison', description: 'So sánh Pinecone, Weaviate, Qdrant, Chroma', href: '/resources/vector-databases', category: 'Tài nguyên', type: 'resource' },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setResults(mockResults);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        window.location.href = results[selectedIndex].href;
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(0);
    setIsLoading(true);

    setTimeout(() => {
      const filtered = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(value.toLowerCase()) ||
          r.description.toLowerCase().includes(value.toLowerCase()) ||
          r.category.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 150);
  }, []);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl animate-scale-in glass-strong rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="relative flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
          <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm danh mục, kỹ năng, tài nguyên... (⌘K)"
            className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none"
            aria-label="Tìm kiếm"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400">
            ⌘K
          </kbd>
          {isLoading && <Loader2 className="h-5 w-5 text-brand-600 animate-spin" aria-hidden="true" />}
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p className="font-medium">Không tìm thấy kết quả</p>
              <p className="text-sm mt-1">Thử từ khóa khác hoặc <a href="/search" className="text-brand-600 dark:text-brand-400 hover:underline" onClick={onClose}>xem tất cả</a></p>
            </div>
          ) : (
            <ul role="listbox" aria-label="Kết quả tìm kiếm" className="divide-y divide-gray-200 dark:divide-gray-800">
              {results.map((result, index) => (
                <li key={result.id} role="option" aria-selected={index === selectedIndex}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 p-3 rounded-lg transition-colors',
                      index === selectedIndex ? 'bg-brand-50 dark:bg-brand-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    onClick={() => {
                      window.location.href = result.href;
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">{result.title}</span>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          result.type === 'category' && 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
                          result.type === 'skill' && 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300',
                          result.type === 'resource' && 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
                          result.type === 'prompt' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
                        )}>
                          {result.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">{result.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <kbd className="px-2 py-1 font-mono bg-gray-100 dark:bg-gray-800 rounded">⌘K</kbd> mở &nbsp;
          <kbd className="px-2 py-1 font-mono bg-gray-100 dark:bg-gray-800 rounded">↑↓</kbd> điều hướng &nbsp;
          <kbd className="px-2 py-1 font-mono bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> chọn &nbsp;
          <kbd className="px-2 py-1 font-mono bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd> đóng
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}