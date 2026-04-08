'use client'

import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useCommandPalette } from '@/components/providers/CommandPaletteProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Search, CheckSquare2, Calendar, Settings } from 'lucide-react'

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  const { theme, toggleTheme } = useTheme()
  const { open } = useCommandPalette()
  const { language, setLanguage, t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // If not authenticated, redirect to signin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onToggleTheme={toggleTheme} 
        currentTheme={theme}
        onOpenCommand={open}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      <div className="flex-1 overflow-hidden relative z-0">
        {children}
      </div>

      {/* Menu Dropdown & Backdrop - Render backdrop via Portal to body */}
      {isMenuOpen && mounted && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop - spans full viewport */}
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-30 pointer-events-auto"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed right-4 sm:right-6 lg:right-8 top-16 max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 z-40 overflow-y-auto shadow-xl shadow-black/10 dark:shadow-black/40">
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  open()
                  setIsMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium"
              >
                <Search className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span>{t('header.command')}</span>
              </button>
              
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3"
              >
                <CheckSquare2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span>{t('header.dashboard')}</span>
              </Link>
              
              <Link
                href="/calendar"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3"
              >
                <Calendar className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span>{t('header.calendar')}</span>
              </Link>
              
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3"
              >
                <Settings className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span>{t('header.settings')}</span>
              </Link>
              
              <div className="border-t border-gray-200/50 dark:border-gray-800/50 my-4 pt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-3">{t('header.language')}</p>
                <div className="flex gap-2 px-4">
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsMenuOpen(false)
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      language === 'en'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    🇬🇧 {t('header.english')}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id')
                      setIsMenuOpen(false)
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      language === 'id'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    🇮🇩 {t('header.indonesia')}
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
