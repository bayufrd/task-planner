'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPaletteProvider } from '@/components/providers/CommandPaletteProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CommandPaletteProvider>
          {children}
        </CommandPaletteProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

