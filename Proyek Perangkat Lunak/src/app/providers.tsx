'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPaletteProvider } from '@/components/providers/CommandPaletteProvider'
import { SnackbarProvider } from '@/components/providers/SnackbarProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider>
      <LanguageProvider>
        <ThemeProvider>
          <CommandPaletteProvider>
            {children}
          </CommandPaletteProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SnackbarProvider>
  )
}

