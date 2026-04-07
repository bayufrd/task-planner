import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Smart Task Planner',
  description: 'Manage and prioritize your tasks with AI-powered scheduling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
