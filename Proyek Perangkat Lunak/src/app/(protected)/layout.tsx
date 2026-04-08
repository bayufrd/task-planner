'use client'

import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useCommandPalette } from '@/components/providers/CommandPaletteProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Search, CheckSquare2, Calendar, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

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
  const { status, data: session } = useSession()
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
      <div className="flex-1 overflow-y-auto relative z-0">
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
          <div className="fixed right-0 sm:right-0 lg:right-0 top-16 w-full sm:w-96 max-w-sm bg-white dark:bg-gray-900 rounded-b-2xl sm:rounded-2xl border-b sm:border border-gray-200/50 dark:border-gray-800/50 z-40 overflow-y-auto shadow-xl shadow-black/10 dark:shadow-black/40 sm:rounded-t-2xl">
            <nav className="px-4 py-4 space-y-2">
              {/* User Profile Card */}
              {mounted && session?.user && (
                <div className="px-4 py-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 mb-4">
                  <div className="flex items-center gap-3">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {session.user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 truncate font-mono mt-1">
                        ID: {session.user.id}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {(session.user as any).emailVerified && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                            ✓ Verified
                          </span>
                        )}
                        {(session.user as any).locale && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
                            {(session.user as any).locale}
                          </span>
                        )}
                        {(session.user as any).hd && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                            {(session.user as any).hd}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
              
              <div className="border-t border-gray-200/50 dark:border-gray-800/50 my-4 pt-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut({ redirect: true, callbackUrl: '/' })
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600 dark:text-red-400 font-medium flex items-center gap-3"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
