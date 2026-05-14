'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Search, Moon, Sun, User, ChevronDown } from 'lucide-react'

type BackendUser = {
  id?: string | number
  name?: string | null
  email?: string | null
  image?: string | null
}

interface HeaderProps {
  onToggleTheme: () => void
  currentTheme: string
  onOpenCommand?: () => void
  onProfileToggle?: () => void
  isProfileOpen?: boolean
  activeUser?: BackendUser | null
  onLanguageToggle?: () => void
  language?: string
}

export default function Header({
  onToggleTheme,
  currentTheme,
  onOpenCommand,
  onProfileToggle,
  isProfileOpen = false,
  activeUser,
  onLanguageToggle,
  language,
}: HeaderProps) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center" aria-label="Go to dashboard">
            <Image
              src="/logo3.webp"
              alt="Smart Task Planner"
              width={160}
              height={48}
              priority
              className="h-11 w-auto"
            />
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            {/* Command Palette Button */}
            <button
              onClick={onOpenCommand}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-gray-700 dark:text-gray-300 text-sm font-medium group"
              aria-label="Open command palette"
              title={`${t('header.command')} (Ctrl+K)`}
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span className="hidden md:inline">{t('header.command')}</span>
              <kbd className="hidden lg:inline px-2 py-0.5 bg-gray-200/60 dark:bg-gray-700/60 rounded text-xs font-semibold ml-1 text-gray-600 dark:text-gray-400">⌘K</kbd>
            </button>

            {/* Language Toggle Switch */}
            {onLanguageToggle && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={onLanguageToggle}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    language === 'id'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="Indonesia"
                  title="Bahasa Indonesia"
                >
                  <span>🇮🇩</span>
                  <span>ID</span>
                </button>
                <button
                  onClick={onLanguageToggle}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    language === 'en'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="English"
                  title="English"
                >
                  <span>🇬🇧</span>
                  <span>EN</span>
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 text-gray-700 dark:text-gray-300"
              aria-label={t('header.toggleTheme')}
              title={t('header.toggleTheme')}
            >
              {currentTheme === 'light' ? (
                <Moon className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Sun className="w-5 h-5" strokeWidth={2} />
              )}
            </button>

            {/* Profile Button - Desktop */}
            {onProfileToggle && (
              <button
                onClick={onProfileToggle}
                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isProfileOpen
                    ? 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                }`}
                aria-label="Profile menu"
                title="Profile"
              >
                {activeUser?.image ? (
                  <Image
                    src={activeUser.image}
                    alt={activeUser.name || 'User'}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <User className="w-5 h-5" strokeWidth={2} />
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
