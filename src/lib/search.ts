'use client';

import { SearchDocument } from '@/types';

export const SEARCH_INDEX_VERSION = '1.0.0';

export const SEARCH_BOOSTS = {
  category: 0.5,
  skill: 2,
  prompt: 1.5,
  agent: 1.5,
  resource: 1,
} as const;

export const SEARCH_TYPES = ['category', 'skill', 'prompt', 'agent', 'resource'] as const;

export interface SearchFilters {
  type?: string;
  categoryId?: string;
  difficulty?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  categoryId?: string;
  skillId?: string;
  tags: string[];
  url: string;
  score: number;
}

const indexCache: { documents: SearchDocument[]; loaded: boolean } = {
  documents: [],
  loaded: false,
};

export async function loadSearchIndex(): Promise<SearchDocument[]> {
  if (indexCache.loaded) {
    return indexCache.documents;
  }

  try {
    const response = await fetch('/search-index.json');
    const data = await response.json();
    indexCache.documents = data.documents || [];
    indexCache.loaded = true;
    return indexCache.documents;
  } catch {
    return [];
  }
}

export async function searchDocuments(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult[]> {
  const documents = await loadSearchIndex();
  const { type, categoryId, difficulty, tags, limit = 20, offset = 0 } = filters;

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (terms.length === 0) {
    return [];
  }

  const results: Array<SearchResult & { score: number }> = [];

  for (const doc of documents) {
    const title = doc.title.toLowerCase();
    const content = doc.content.toLowerCase();
    const tagsStr = (doc.tags || []).map((t) => t.toLowerCase());

    let score = 0;
    const queryLower = query.toLowerCase();

    // Title match
    if (title.includes(queryLower)) {
      score += 10;
    } else if (title.includes(terms[0])) {
      score += 8;
    }

    // Content match
    for (const term of terms) {
      if (content.includes(term)) {
        score += 3;
      }
    }

    // Tag match
    if (tags) {
      for (const tag of tags) {
        if (tagsStr.includes(tag.toLowerCase())) {
          score += 5;
        }
      }
    }

    if (score > 0) {
      results.push({
        ...doc,
        description: doc.content ? doc.content.slice(0, 160) : '',
        score,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  const filtered = results.filter((r) => {
    if (type && r.type !== type) return false;
    if (categoryId && r.categoryId !== categoryId) return false;
    if (difficulty) {
      // Difficulty filtering is handled via metadata
      // Simplified here
    }
    if (tags && tags.length > 0) {
      const hasTag = tags.some((t) => r.tags.includes(t));
      if (!hasTag) return false;
    }
    return true;
  });

  const pageItems = filtered.slice(offset, offset + limit);

  return pageItems.map(({ score, ...result }) => ({
    ...result,
    score,
  }));
}

export function highlightMatches(text: string, query: string): string {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) return text;

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);
  const highlighted = parts.map((part, i) =>
    regex.test(part) ? `[HIGHLIGHT]${part}[/HIGHLIGHT]` : part
  );

  return highlighted.join('');
}
