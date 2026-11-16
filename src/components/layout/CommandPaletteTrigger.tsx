'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Command, X } from 'lucide-react'
import { clsx } from 'clsx'
import { SearchProvider } from './Providers'

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  href: string
  type: 'tool' | 'resource' | 'category'
}

const mockSearchIndex: SearchResult[] = [
  {
    id: '1',
    title: 'ChatGPT',
    description: 'Advanced conversational AI assistant',
    category: 'Chat & Assistant',
    href: '/tools/chatgpt',
    type: 'tool',
  },
  {
    id: '2',
    title: 'Midjourney',
    description: 'AI image generation from text prompts',
    category: 'Image Generation',
    href: '/tools/midjourney',
    type: 'tool',
  },
  {
    id: '3',
    title: 'Cursor',
    description: 'AI-powered code editor',
    category: 'Code & Development',
    href: '/tools/cursor',
    type: 'tool',
  },
  {
    id: '4',
    title: 'Notion AI',
    description: 'AI writing assistant in Notion',
    category: 'Productivity',
    href: '/tools/notion-ai',
    type: 'tool',
  },
  {
    id: '5',
    title: 'Runway Gen-2',
    description: 'Text-to-video generation model',
    category: 'Video Generation',
    href: '/tools/runway',
    type: 'tool',
  },
  {
    id: '6',
    title: 'ElevenLabs',
    description: 'AI voice synthesis and cloning',
    category: 'Audio & Voice',
    href: '/tools/elevenlabs',
    type: 'tool',
  },
  {
    id: '7',
    title: 'Perplexity',
    description: 'AI-powered search engine',
    category: 'Search & Research',
    href: '/tools/perplexity',
    type: 'tool',
  },
  {
    id: '8',
    title: 'LangChain',
    description: 'Framework for LLM applications',
    category: 'Code & Development',
    href: '/resources/langchain',
    type: 'resource',
  },
]

export function CommandPaletteTrigger({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const filteredResults = mockSearchIndex
    .filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
        setSelectedIndex(0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredResults[selectedIndex]) {
          window.location.href = filteredResults[selectedIndex].href
          setIsOpen(false)
          setQuery('')
        }
        break
    }
  }

  const handleResultClick = (href: string) => {
    window.location.href = href
    setIsOpen(false)
    setQuery('')
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-fast',
          'bg-hover text-text-muted hover:text-text hover:bg-hover/80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'border border-border',
          className
        )}
        aria-label="Open search (⌘K)"
        aria-haspopup="dialog"
      >
        <Search size={16} />
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono text-text-subtle bg-bg/50 rounded border border-border">
          <Command size={10} />
          <span>K</span>
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-popover" role="dialog" aria-modal="true" aria-label="Search">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-fast"
        onClick={() => {
          setIsOpen(false)
          setQuery('')
        }}
        aria-hidden="true"
      />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-popover">
        <div className="bg-bg-elevated border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-base">
          <div className="relative p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-text-subtle" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tools, resources, categories... (⌘K to close)"
                className="w-full pl-10 pr-12 py-3 bg-bg border border-border-light rounded-lg text-text placeholder-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition-colors duration-fast"
                autoComplete="off"
                spellCheck={false}
                aria-label="Search query"
                aria-controls="search-results"
                aria-activedescendant={filteredResults[selectedIndex] ? `result-${selectedIndex}` : undefined}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-subtle hover:text-text transition-colors duration-fast rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-text-subtle">
              <kbd className="px-1.5 py-0.5 bg-bg/50 rounded border border-border font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-bg/50 rounded border border-border font-mono">↓</kbd>
              <span>Navigate</span>
              <kbd className="px-1.5 py-0.5 bg-bg/50 rounded border border-border font-mono">Enter</kbd>
              <span>Open</span>
              <kbd className="px-1.5 py-0.5 bg-bg/50 rounded border border-border font-mono">Esc</kbd>
              <span>Close</span>
            </div>
          </div>

          <div
            id="search-results"
            ref={resultsRef}
            className="max-h-96 overflow-y-auto p-2"
            role="listbox"
            aria-label="Search results"
          >
            {query.length === 0 ? (
              <div className="py-8 text-center text-text-muted">
                <Search className="mx-auto mb-2 size-8 opacity-30" aria-hidden="true" />
                <p>Start typing to search tools and resources</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-8 text-center text-text-muted">
                <Search className="mx-auto mb-2 size-8 opacity-30" aria-hidden="true" />
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <ul role="list" className="space-y-1">
                {filteredResults.map((result, index) => (
                  <li key={result.id} role="option" aria-selected={index === selectedIndex}>
                    <button
                      type="button"
                      id={`result-${index}`}
                      onClick={() => handleResultClick(result.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={clsx(
                        'w-full px-3 py-3 rounded-lg text-left transition-colors duration-fast',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                        index === selectedIndex
                          ? 'bg-accent/10 text-text'
                          : 'text-text-muted hover:text-text hover:bg-hover'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{result.title}</span>
                            <span
                              className={clsx(
                                'px-1.5 py-0.5 text-xs font-medium rounded-full',
                                result.type === 'tool' && 'bg-accent/20 text-accent',
                                result.type === 'resource' && 'bg-info/20 text-info',
                                result.type === 'category' && 'bg-success/20 text-success'
                              )}
                            >
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-text-subtle truncate">{result.description}</p>
                          <p className="text-xs text-text-subtle mt-1">{result.category}</p>
                        </div>
                        <Command className="size-4 text-text-subtle shrink-0 mt-0.5" aria-hidden="true" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}