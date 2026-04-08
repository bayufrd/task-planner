import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider'

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
        <AuthSessionProvider>
          <Providers>
            {children}
          </Providers>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
