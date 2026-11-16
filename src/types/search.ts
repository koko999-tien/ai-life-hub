export type SearchResultType = 'skill' | 'prompt' | 'agent' | 'resource' | 'category';

export interface SearchDocument {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  icon?: string;
  boost?: number;
}

export interface SearchResult extends SearchDocument {
  score: number;
  matchedFields?: string[];
  highlights?: Record<string, string[]>;
}

export interface SearchIndex {
  version: string;
  createdAt: string;
  documents: SearchDocument[];
  index?: any;
}

export interface SearchFilters {
  category?: string;
  type?: SearchResultType;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  page?: number;
  limit?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  filteredResults: SearchResult[];
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];
  selectedIndex: number;
  totalResults: number;
  totalPages: number;
}

export interface UseSearchReturn extends SearchState {
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  selectResult: (index: number) => void;
  navigateUp: () => void;
  navigateDown: () => void;
  resetSelection: () => void;
}