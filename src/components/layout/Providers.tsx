'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { clsx } from 'clsx'
import { Toaster } from 'sonner'

// ============================================
// Theme Provider (next-themes pattern)
// ============================================

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = 'system', enableSystem = true }: {
  children: ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    root.classList.remove('light', 'dark')

    let resolved: 'light' | 'dark'

    if (theme === 'system' && enableSystem) {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = theme === 'dark' ? 'dark' : 'light'
    }

    root.classList.add(resolved)
    setResolvedTheme(resolved)
    localStorage.setItem('theme', theme)
  }, [theme, mounted, enableSystem])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      const resolved = e.matches ? 'dark' : 'light'
      root.classList.add(resolved)
      setResolvedTheme(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem])

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: defaultTheme, setTheme: () => {}, resolvedTheme: 'dark' }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// ============================================
// Search Provider (Lunr index state)
// ============================================

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  href: string
  type: 'tool' | 'resource' | 'category'
  tags: string[]
}

interface SearchContextType {
  index: SearchResult[] | null
  isLoading: boolean
  error: Error | null
  search: (query: string) => SearchResult[]
  refreshIndex: () => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<SearchResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const buildIndex = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // In production, fetch from API or load pre-built Lunr index
      // For now, using mock data
      const mockIndex: SearchResult[] = [
        {
          id: '1',
          title: 'ChatGPT',
          description: 'Advanced conversational AI assistant',
          category: 'Chat & Assistant',
          href: '/tools/chatgpt',
          type: 'tool',
          tags: ['chat', 'assistant', 'openai', 'conversation'],
        },
        {
          id: '2',
          title: 'Midjourney',
          description: 'AI image generation from text prompts',
          category: 'Image Generation',
          href: '/tools/midjourney',
          type: 'tool',
          tags: ['image', 'generation', 'art', 'creative'],
        },
        {
          id: '3',
          title: 'Cursor',
          description: 'AI-powered code editor',
          category: 'Code & Development',
          href: '/tools/cursor',
          type: 'tool',
          tags: ['code', 'editor', 'ide', 'development'],
        },
        {
          id: '4',
          title: 'Notion AI',
          description: 'AI writing assistant in Notion',
          category: 'Productivity',
          href: '/tools/notion-ai',
          type: 'tool',
          tags: ['writing', 'productivity', 'notes', 'workspace'],
        },
        {
          id: '5',
          title: 'Runway Gen-2',
          description: 'Text-to-video generation model',
          category: 'Video Generation',
          href: '/tools/runway',
          type: 'tool',
          tags: ['video', 'generation', 'text-to-video', 'creative'],
        },
        {
          id: '6',
          title: 'ElevenLabs',
          description: 'AI voice synthesis and cloning',
          category: 'Audio & Voice',
          href: '/tools/elevenlabs',
          type: 'tool',
          tags: ['voice', 'audio', 'tts', 'speech'],
        },
        {
          id: '7',
          title: 'Perplexity',
          description: 'AI-powered search engine',
          category: 'Search & Research',
          href: '/tools/perplexity',
          type: 'tool',
          tags: ['search', 'research', 'answers', 'citations'],
        },
        {
          id: '8',
          title: 'LangChain',
          description: 'Framework for LLM applications',
          category: 'Code & Development',
          href: '/resources/langchain',
          type: 'resource',
          tags: ['framework', 'llm', 'chain', 'agents'],
        },
      ]

      setIndex(mockIndex)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to build search index'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    buildIndex()
  }, [buildIndex])

  const search = useCallback((query: string): SearchResult[] => {
    if (!index || !query.trim()) return []

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return index
      .map((item) => {
        const searchableText = `${item.title} ${item.description} ${item.category} ${item.tags.join(' ')}`.toLowerCase()
        let score = 0

        for (const term of terms) {
          if (item.title.toLowerCase().includes(term)) score += 10
          if (item.category.toLowerCase().includes(term)) score += 5
          if (item.tags.some((tag) => tag.includes(term))) score += 3
          if (item.description.toLowerCase().includes(term)) score += 1
        }

        return { item, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
  }, [index])

  const refreshIndex = useCallback(async () => {
    await buildIndex()
  }, [buildIndex])

  return (
    <SearchContext.Provider value={{ index, isLoading, error, search, refreshIndex }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// ============================================
// Favorites Provider (localStorage)
// ============================================

interface FavoriteItem {
  id: string
  title: string
  href: string
  type: 'tool' | 'resource' | 'category'
  addedAt: number
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('favorites')
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  const persist = useCallback((newFavorites: FavoriteItem[]) => {
    setFavorites(newFavorites)
    if (mounted) {
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
  }, [mounted])

  const isFavorite = useCallback((id: string) => {
    return favorites.some((f) => f.id === id)
  }, [favorites])

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id)
      if (exists) {
        return prev.filter((f) => f.id !== item.id)
      } else {
        return [...prev, { ...item, addedAt: Date.now() }]
      }
    })
  }, [])

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev
      return [...prev, { ...item, addedAt: Date.now() }]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  if (!mounted) {
    return (
      <FavoritesContext.Provider
        value={{
          favorites: [],
          isFavorite: () => false,
          toggleFavorite: () => {},
          addFavorite: () => {},
          removeFavorite: () => {},
          clearFavorites: () => {},
        }}
      >
        {children}
      </FavoritesContext.Provider>
    )
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

// ============================================
// Toast Context (Simple replacement for Sonner)
// ============================================

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: Toast['type'], message: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-md animate-slide-in',
            toast.type === 'success' && 'bg-green-600 text-white',
            toast.type === 'error' && 'bg-red-600 text-white',
            toast.type === 'info' && 'bg-blue-600 text-white'
          )}
          role="alert"
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Combined Providers Wrapper
// ============================================

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem={true}>
      <SearchProvider>
        <FavoritesProvider>
          <ToastProvider>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </ToastProvider>
        </FavoritesProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}