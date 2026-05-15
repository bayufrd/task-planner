import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useCommandPalette } from '@/components/providers/CommandPaletteProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Search } from 'lucide-react'

export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  const { theme, toggleTheme } = useTheme()
  const { open } = useCommandPalette()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Public Header with Logo */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Click to home */}
            <Link href="/" className="flex items-center" aria-label="Go to home">
              <div className="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
                <Image
                  src="/opt-logo/logo3.png"
                  alt="Task Planner"
                  width={160}
                  height={48}
                  className="h-11 w-auto rounded-xl"
                  priority
                />
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={open}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                title={t('header.command')}
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>
              
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {children}
    </div>
  )
}