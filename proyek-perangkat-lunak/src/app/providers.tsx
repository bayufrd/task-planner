'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPaletteProvider } from '@/components/providers/CommandPaletteProvider'
import { SnackbarProvider } from '@/components/providers/SnackbarProvider'
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider>
      <LanguageProvider>
        <ThemeProvider>
          <CommandPaletteProvider>
            <AuthSessionProvider>
              {children}
            </AuthSessionProvider>
          </CommandPaletteProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SnackbarProvider>
  )
}

