'use client';

import { forwardRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { SearchResult } from '@/types/search';
import { highlightMatches } from './useSearch';

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const typeIcons: Record<SearchResult['type'], string> = {
  skill: '⚡',
  prompt: '💬',
  agent: '🤖',
  resource: '📄',
  category: '📁',
};

const typeLabels: Record<SearchResult['type'], string> = {
  skill: 'Skill',
  prompt: 'Prompt',
  agent: 'Agent',
  resource: 'Resource',
  category: 'Category',
};

const difficultyColors: Record<NonNullable<SearchResult['difficulty']>, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const SearchResultItem = forwardRef<HTMLDivElement, SearchResultItemProps>(
  ({ result, query, isSelected = false, onClick, className = '' }, ref) => {
    const handleClick = () => {
      onClick?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <Link
        ref={ref}
        href={result.url || '#'}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          group flex items-start gap-3 p-3 rounded-lg transition-all duration-150
          ${isSelected 
            ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/50' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
          ${className}
        `}
        role="option"
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
      >
        <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
          {result.icon || typeIcons[result.type]}
        </span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {highlightMatches(result.title, query)}
            </h3>
            <span className={`
              px-2 py-0.5 text-xs font-medium rounded-full 
              bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400
            `}>
              {typeLabels[result.type]}
            </span>
            {result.category && (
              <span className={`
                px-2 py-0.5 text-xs font-medium rounded-full 
                bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400
              `}>
                {result.category}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {highlightMatches(result.description, query)}
          </p>

          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.tags.slice(0, 5).map((tag, i) => (
                <span
                  key={i}
                  className={`
                    px-2 py-0.5 text-xs rounded 
                    bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400
                    hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
                  `}
                >
                  {tag}
                </span>
              ))}
              {result.tags.length > 5 && (
                <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-500">
                  +{result.tags.length - 5}
                </span>
              )}
            </div>
          )}

          {result.difficulty && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`
                px-2 py-0.5 text-xs font-medium rounded-full 
                ${difficultyColors[result.difficulty]}
              `}>
                {result.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Score: {result.score.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <svg
          className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }
);

SearchResultItem.displayName = 'SearchResultItem';