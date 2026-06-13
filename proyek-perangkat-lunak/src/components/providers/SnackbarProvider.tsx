'use client'

import { SnackbarProvider as NotistackProvider } from 'notistack'
import { ReactNode } from 'react'

export function SnackbarProvider({ children }: { children: ReactNode }) {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={4000}
      variant="default"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {children}
    </NotistackProvider>
  )
}
