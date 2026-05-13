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
import { Search, CheckSquare2, LogOut, UserCircle } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { getAuthCookie, removeAuthCookie } from '@/lib/auth/cookies'

type BackendUser = {
  id?: string | number
  name?: string | null
  email?: string | null
}

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
  const [backendToken, setBackendToken] = useState<string | null>(null)
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const { status, data: session } = useSession()
  const router = useRouter()

  const activeUser = session?.user ?? backendUser

  useEffect(() => {
    // Check both cookie and localStorage for token
    const cookieToken = getAuthCookie()
    const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const token = cookieToken || localStorageToken
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('backendUser') : null
    setMounted(true)
    setBackendToken(token)

    if (savedUser) {
      try {
        setBackendUser(JSON.parse(savedUser) as BackendUser)
      } catch {
        setBackendUser(null)
      }
    }
    console.debug('[ProtectedLayout] Auth token check:', {
      hasCookieToken: !!cookieToken,
      hasLocalStorageToken: !!localStorageToken,
      finalToken: !!token,
    })
  }, [status])

  // If not authenticated, redirect to signin
  useEffect(() => {
    if (mounted && status === 'unauthenticated' && !backendToken) {
      console.debug('[ProtectedLayout] No auth detected, redirecting to signin')
      router.push('/auth/signin')
    } else {
      console.debug('[ProtectedLayout] Auth detected, allowing access:', {
        status,
        hasBackendToken: !!backendToken,
        hasNextAuthSession: status === 'authenticated',
      })
    }
  }, [backendToken, mounted, status, router])

  if (status === 'loading' && !backendToken) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' && !backendToken) {
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
              {mounted && activeUser && (
                <div className="px-4 py-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 mb-4">
                  <div className="flex items-center gap-3">
                    {'image' in activeUser && activeUser.image ? (
                      <Image
                        src={activeUser.image}
                        alt={activeUser.name || 'User'}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                      />
                    ) : (
                      <UserCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {activeUser.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {activeUser.email || '-'}
                      </p>
                      {activeUser.id && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate font-mono mt-1">
                          ID: {activeUser.id}
                        </p>
                      )}
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
              
              <div className="border-t border-gray-200/50 dark:border-gray-800/50 my-4 pt-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    removeAuthCookie()
                    localStorage.removeItem('token')
                    localStorage.removeItem('backendUser')
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
