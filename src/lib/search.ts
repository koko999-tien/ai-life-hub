'use client';

import { SearchDocument } from '@/types';
import { normalizeVietnamese } from '@/lib/utils';

export const SEARCH_INDEX_VERSION = '1.1.0';

export const SEARCH_BOOSTS = {
  tool: 2.5,
  category: 0.5,
  skill: 2,
  prompt: 1.5,
  agent: 1.5,
  resource: 1,
} as const;

export const SEARCH_TYPES = ['tool', 'category', 'skill', 'prompt', 'agent', 'resource'] as const;

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
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch('/search-index.json', { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Không thể tải chỉ mục tìm kiếm (HTTP ${response.status})`);
    }
    const data = await response.json();
    if (data.version && data.version !== SEARCH_INDEX_VERSION) {
      // Index cũ vẫn dùng được (shape document tương thích ngược) nhưng
      // có thể thiếu trường mới (difficulty, titleNorm...): báo để rebuild.
      console.warn(
        `Phiên bản chỉ mục tìm kiếm không khớp: ${data.version} (kỳ vọng ${SEARCH_INDEX_VERSION}). Hãy chạy lại "npm run search:index".`
      );
    }
    indexCache.documents = data.documents || [];
    indexCache.loaded = true;
    return indexCache.documents;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function searchDocuments(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult[]> {
  const documents = await loadSearchIndex();
  const { type, categoryId, difficulty, tags, limit = 20, offset = 0 } = filters;

  const queryNorm = normalizeVietnamese(query);
  const terms = queryNorm
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (terms.length === 0) {
    return [];
  }

  const results: Array<SearchResult & { score: number }> = [];

  for (const doc of documents) {
    const title = doc.title.toLowerCase();
    const content = doc.content.toLowerCase();
    // Dùng trường đã tiền tính lúc build nếu có, fallback tự normalize
    // cho index cũ chưa có titleNorm/contentNorm.
    const titleNorm = doc.titleNorm ?? normalizeVietnamese(doc.title);
    const contentNorm = doc.contentNorm ?? normalizeVietnamese(doc.content);
    const tagsStr = (doc.tags || []).map((t) => t.toLowerCase());

    let score = 0;
    const queryLower = query.toLowerCase().trim();

    // Title match (exact diacritics boosted, accent-insensitive supported)
    if (title.includes(queryLower)) {
      score += 14;
    } else if (titleNorm.includes(queryNorm)) {
      score += 10;
    } else if (titleNorm.includes(terms[0])) {
      score += 6;
    }

    // Content match
    for (const term of terms) {
      if (contentNorm.includes(term) || content.includes(term)) {
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
    // Lọc độ khó thật theo trường difficulty của document (đã chuẩn hóa
    // về beginner | intermediate | advanced lúc build index).
    // Document không có difficulty (tool/category, hoặc index cũ chưa
    // rebuild) sẽ bị loại khi người dùng chọn lọc độ khó.
    if (difficulty && r.difficulty !== difficulty) return false;
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

  // Không dùng flag `g`: regex có flag g giữ state `lastIndex` giữa các
  // lần .test() nên cùng một part có thể lúc match lúc không. Chỉ cần `i`
  // (không phân biệt hoa/thường); split vẫn giữ lại nhóm bắt được.
  const regex = new RegExp(`(${terms.join('|')})`, 'i');
  const parts = text.split(regex);
  const highlighted = parts.map((part, i) =>
    regex.test(part) ? `[HIGHLIGHT]${part}[/HIGHLIGHT]` : part
  );

  return highlighted.join('');
}
