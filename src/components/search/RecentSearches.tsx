'use client';

import { useCallback } from 'react';

interface RecentSearchesProps {
  searches: string[];
  onSearch: (query: string) => void;
  onClear: () => void;
  className?: string;
}

export function RecentSearches({ searches, onSearch, onClear, className = '' }: RecentSearchesProps) {
  const handleClick = useCallback(
    (query: string) => {
      onSearch(query);
    },
    [onSearch]
  );

  if (searches.length === 0) return null;

  return (
    <div className={`${className} animate-in fade-in-0 duration-150`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Tìm kiếm gần đây
        </span>
        {searches.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Xóa lịch sử tìm kiếm"
          >
            Xóa
          </button>
        )}
      </div>
      <ul className="py-1" role="listbox" aria-label="Lịch sử tìm kiếm gần đây">
        {searches.map((search) => (
          <li key={search} role="option" aria-selected={false}>
            <button
              type="button"
              onClick={() => handleClick(search)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-2"
              tabIndex={-1}
            >
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="truncate flex-1">{search}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
