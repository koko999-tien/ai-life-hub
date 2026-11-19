'use client'

import type { ReactNode } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme as useNextThemes } from 'next-themes'
import { Toaster } from 'sonner'

// ============================================
// Theme Provider (next-themes)
// ============================================

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
}: {
  children: ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme(): ThemeContextType {
  const { theme, setTheme, resolvedTheme } = useNextThemes()

  return {
    theme: (theme as Theme) ?? 'system',
    setTheme: (next: Theme) => setTheme(next),
    resolvedTheme: resolvedTheme === 'dark' ? 'dark' : 'light',
  }
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
      {children}
      <Toaster richColors position="top-right" closeButton />
    </ThemeProvider>
  )
}
