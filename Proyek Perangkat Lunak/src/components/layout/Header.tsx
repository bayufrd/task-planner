'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Search, Menu, X, Moon, Sun, Globe, CheckSquare2, Calendar, Settings } from 'lucide-react'

interface HeaderProps {
  onToggleTheme: () => void
  currentTheme: string
  onOpenCommand?: () => void
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

export default function Header({ onToggleTheme, currentTheme, onOpenCommand, onMenuToggle, isMenuOpen = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <CheckSquare2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t('header.title')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Smart Planner</span>
            </div>
          </div>

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

            {/* Mobile Command Button */}
            <button
              onClick={onOpenCommand}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Open command palette"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Language Toggle Switch */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={() => setLanguage('en')}
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
              <button
                onClick={() => setLanguage('id')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  language === 'id'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Indonesia"
                title="Indonesia"
              >
                <span>🇮🇩</span>
                <span>ID</span>
              </button>
            </div>

            {/* Mobile Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 text-gray-700 dark:text-gray-300"
              aria-label={t('header.toggleLanguage')}
              title={t('header.toggleLanguage')}
            >
              <Globe className="w-5 h-5" strokeWidth={2} />
            </button>

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

            {/* Menu Button - Always Visible */}
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 text-gray-700 dark:text-gray-300"
              aria-label={t('header.menu')}
              title="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
