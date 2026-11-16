'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { SearchDocument, SearchResult, SearchFilters, SearchIndex, UseSearchReturn } from '@/types/search';

const STORAGE_KEY = 'ai-life-hub-recent-searches';
const MAX_HISTORY = 10;
const DEBOUNCE_MS = 150;

export function useSearch(initialFilters: SearchFilters = {}): UseSearchReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [filters, setFiltersState] = useState<SearchFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const indexRef = useRef<SearchIndex | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const loadIndex = useCallback(async () => {
    if (indexRef.current) return indexRef.current;

    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error('Failed to load search index');
      const index = await response.json() as SearchIndex;
      indexRef.current = index;
      return index;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load search index');
      return null;
    }
  }, []);

  const performSearch = useCallback(async (searchQuery: string, currentFilters: SearchFilters) => {
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    searchAbortRef.current = new AbortController();

    const index = await loadIndex();
    if (!index) return;

    if (!searchQuery.trim()) {
      setResults([]);
      setFilteredResults([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const lunr = await import('lunr');
      const idx = lunr.Index.load(index);

      const searchResults = idx.search(searchQuery);
      const docMap = new Map(index.documents.map(d => [d.id, d]));

      const results: SearchResult[] = searchResults
        .map(r => {
          const doc = docMap.get(r.ref);
          if (!doc) return null;
          const boost = (doc as SearchDocument).boost || 1;
          return {
            ...doc,
            score: r.score * boost,
            matchedFields: r.matchData.metadata ? Object.keys(r.matchData.metadata) : [],
          } as SearchResult;
        })
        .filter((r): r is SearchResult => r !== null)
        .sort((a, b) => b.score - a.score);

      setResults(results);
      applyFilters(results, currentFilters);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadIndex]);

  const applyFilters = useCallback((sourceResults: SearchResult[], currentFilters: SearchFilters) => {
    let filtered = [...sourceResults];

    if (currentFilters.category) {
      filtered = filtered.filter(r => r.category === currentFilters.category);
    }
    if (currentFilters.type) {
      filtered = filtered.filter(r => r.type === currentFilters.type);
    }
    if (currentFilters.difficulty) {
      filtered = filtered.filter(r => r.difficulty === currentFilters.difficulty);
    }

    const limit = currentFilters.limit || 20;
    const page = currentFilters.page || 1;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    setFilteredResults(paginated);
    setTotalResults(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
    setSelectedIndex(-1);
  }, []);

  const debouncedSearch = useCallback((searchQuery: string, currentFilters: SearchFilters) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery, currentFilters);
    }, DEBOUNCE_MS);
  }, [performSearch]);

  useEffect(() => {
    debouncedSearch(query, filters);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, filters, debouncedSearch]);

  useEffect(() => {
    applyFilters(results, filters);
  }, [filters, results, applyFilters]);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    setFiltersState(prev => ({ ...prev, page: 1 }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({ page: 1, limit: 20 });
  }, []);

  const addToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const selectResult = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const navigateUp = useCallback(() => {
    setSelectedIndex(prev => Math.max(-1, prev - 1));
  }, []);

  const navigateDown = useCallback(() => {
    setSelectedIndex(prev => Math.min(filteredResults.length - 1, prev + 1));
  }, [filteredResults.length]);

  const resetSelection = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  return {
    query,
    results,
    filteredResults,
    filters,
    isLoading,
    error,
    recentSearches,
    selectedIndex,
    totalResults,
    totalPages,
    setQuery,
    setFilters,
    clearFilters,
    addToHistory,
    clearHistory,
    selectResult,
    navigateUp,
    navigateDown,
    resetSelection,
  };
}

export function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;

  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </>
  );
}