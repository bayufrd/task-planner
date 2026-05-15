'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import CommandPalette from '@/components/command/CommandPalette'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useCommandPalette } from '@/components/providers/CommandPaletteProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Search, CheckSquare2, LogOut, UserCircle, LayoutDashboard, User, Moon, Sun, Globe, PieChart } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { getAuthCookie, removeAuthCookie } from '@/lib/auth/cookies'
import { syncNextAuthToExpress } from '@/lib/auth/sync'

type BackendUser = {
  id?: string | number
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  const { theme, toggleTheme } = useTheme()
  const { isOpen, open, close } = useCommandPalette()
  const { language, setLanguage } = useLanguage()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [backendToken, setBackendToken] = useState<string | null>(null)
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const { status, data: session } = useSession()
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement>(null)

  const activeUser = session?.user ?? backendUser

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  useEffect(() => {
    const checkAndSyncAuth = async () => {
      // Check both cookie and localStorage for token
      const cookieToken = getAuthCookie()
      const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      let token = cookieToken || localStorageToken
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('backendUser') : null
      setMounted(true)

      // If user logged in via NextAuth Google but no Express token, sync it first
      if (!token && status === 'authenticated' && session?.user) {
        const synced = await syncNextAuthToExpress(session.user as BackendUser & { accessToken?: string })
        if (synced) {
          token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
          window.dispatchEvent(new CustomEvent('tasks:changed'))
        }
      }

      setBackendToken(token)

      const latestSavedUser = typeof window !== 'undefined' ? localStorage.getItem('backendUser') : savedUser
      if (latestSavedUser) {
        try {
          setBackendUser(JSON.parse(latestSavedUser) as BackendUser)
        } catch {
          setBackendUser(null)
        }
      }
    }

    checkAndSyncAuth()
  }, [status, session?.user])

  // If not authenticated, redirect to signin
  useEffect(() => {
    if (mounted && status === 'unauthenticated' && !backendToken) {
      router.push('/auth/signin')
    } else {
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
      {/* Header - Desktop only, no hamburger */}
      <Header
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        onOpenCommand={open}
        onProfileToggle={() => setIsProfileOpen(!isProfileOpen)}
        isProfileOpen={isProfileOpen}
        activeUser={activeUser}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'id' : 'en')}
        language={language}
        
      />
      <div className="flex-1 overflow-y-auto relative z-0 pb-20 lg:pb-0">
        {children}
      </div>

      {/* Command Palette - Available on all protected pages */}
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        onOpen={open}
      />

      {/* Bottom Tab Bar - Mobile only */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-[60] bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2 px-2">
          {/* Tasks Tab */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[60px]"
          >
            <CheckSquare2 className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold">Dashboard</span>
          </Link>

          {/* Command Tab */}
          <button
            onClick={open}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[60px]"
          >
            <Search className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold">Command</span>
          </button>

          {/* Overview Tab */}
          <Link
            href="/overview"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[60px]"
          >
            <PieChart className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold">Overview</span>
          </Link>

          {/* Profile Tab */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[60px]"
          >
            <User className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold">Profil</span>
          </button>
        </div>
      </div>

      {/* Profile Dropdown - Desktop & Mobile */}
      {isProfileOpen && mounted && (
        <div className="fixed inset-0 z-[70]" onClick={() => setIsProfileOpen(false)}>
          {/* Profile Card - Drops UP from bottom on mobile, top-right on desktop */}
          <div
            ref={profileRef}
            className="absolute bottom-20 left-0 right-0 z-[80] max-h-[calc(100dvh-6rem)] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl lg:bottom-auto lg:left-auto lg:right-4 lg:top-20 lg:w-80 lg:max-h-[calc(100dvh-6rem)] lg:shadow-2xl"
          >
            <div className="px-4 py-4 space-y-2">
              {/* User Profile Header */}
              {mounted && activeUser && (
                <div className="flex items-center gap-3 px-2 py-3">
                  {activeUser.image ? (
                    <Image
                      src={activeUser.image}
                      alt={activeUser.name || 'User'}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 flex items-center justify-center">
                      <UserCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {activeUser.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activeUser.email || 'No email'}
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-2 mt-2 space-y-1">
                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  <span>Dashboard</span>
                </Link>

                {/* Overview Link */}
                <Link
                  href="/overview"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  <PieChart className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  <span>Overview</span>
                </Link>

                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  <span>Language ({language === 'en' ? 'EN' : 'ID'})</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  ) : (
                    <Sun className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  )}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-2 mt-2">
                  {/* Logout */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      removeAuthCookie()
                      localStorage.removeItem('token')
                      localStorage.removeItem('backendUser')
                      signOut({ redirect: true, callbackUrl: '/' })
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600 dark:text-red-400 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
