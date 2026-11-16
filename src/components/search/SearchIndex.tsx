'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { SearchIndex as SearchIndexType, SearchDocument, SearchResult } from '@/types/search';

interface SearchIndexProps {
  onIndexLoaded?: (index: SearchIndexType) => void;
  children?: React.ReactNode | ((props: { index: SearchIndexType | null; isLoading: boolean; error: string | null }) => React.ReactNode);
}

interface UseSearchIndexReturn {
  index: SearchIndexType | null;
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<SearchResult[]>;
}

let lunrIndex: any = null;
let searchIndexData: SearchIndexType | null = null;
let loadPromise: Promise<SearchIndexType> | null = null;

async function loadSearchIndex(): Promise<SearchIndexType> {
  if (searchIndexData) return searchIndexData;
  
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const response = await fetch('/search-index.json');
    if (!response.ok) throw new Error('Failed to load search index');
    const data = await response.json() as SearchIndexType;
    searchIndexData = data;
    return data;
  })();

  return loadPromise;
}

async function initializeLunr(indexData: SearchIndexType) {
  if (lunrIndex) return lunrIndex;

  const lunrModule = await import('lunr');
  const lunr = (lunrModule as any).default || lunrModule;
  
  lunrIndex = lunr(function (this: any) {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('content', { boost: 3 });
    this.field('category', { boost: 2 });
    this.field('tags', { boost: 4 });
    this.field('type', { boost: 1 });
    
    indexData.documents.forEach(doc => {
      this.add({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        content: doc.content,
        category: doc.category || '',
        tags: doc.tags?.join(' ') || '',
        type: doc.type,
      });
    });
  });

  return lunrIndex;
}

export function useSearchIndex(): UseSearchIndexReturn {
  const [index, setIndex] = useState<SearchIndexType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        setIsLoading(true);
        const data = await loadSearchIndex();
        await initializeLunr(data);
        setIndex(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize search');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim() || !lunrIndex || !searchIndexData) return [];

    try {
      const results = lunrIndex.search(query);
      const docMap = new Map(searchIndexData.documents.map(d => [d.id, d]));

      return results
        .map((r: any) => {
          const doc = docMap.get(r.ref);
          if (!doc) return null;
          const boost = doc.boost || 1;
          return {
            ...doc,
            score: r.score * boost,
            matchedFields: r.matchData.metadata ? Object.keys(r.matchData.metadata) : [],
          } as SearchResult;
        })
        .filter((r: SearchResult | null): r is SearchResult => r !== null)
        .sort((a: SearchResult, b: SearchResult) => b.score - a.score);
    } catch {
      return [];
    }
  }, []);

  return { index, isLoading, error, search };
}

export function SearchIndex({ onIndexLoaded, children }: SearchIndexProps) {
  const { index, isLoading, error } = useSearchIndex();

  useEffect(() => {
    if (index) {
      onIndexLoaded?.(index);
    }
  }, [index, onIndexLoaded]);

  if (children) {
    return typeof children === 'function' ? <>{children({ index, isLoading, error })}</> : <>{children}</>;
  }

  return null;
}

export async function getSearchIndex(): Promise<SearchIndexType | null> {
  try {
    return await loadSearchIndex();
  } catch {
    return null;
  }
}

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const data = await loadSearchIndex();
  await initializeLunr(data);
  
  const results = lunrIndex.search(query);
  const docMap = new Map(data.documents.map(d => [d.id, d]));

  return results
    .map((r: any) => {
      const doc = docMap.get(r.ref);
      if (!doc) return null;
      const boost = doc.boost || 1;
      return {
        ...doc,
        score: r.score * boost,
        matchedFields: r.matchData.metadata ? Object.keys(r.matchData.metadata) : [],
      } as SearchResult;
    })
    .filter((r: SearchResult | null): r is SearchResult => r !== null)
    .sort((a: SearchResult, b: SearchResult) => b.score - a.score);
}