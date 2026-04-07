'use client'

import { useState } from 'react'

interface HeaderProps {
  onToggleTheme: () => void
  currentTheme: string
}

export default function Header({ onToggleTheme, currentTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              📅 Task Planner
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Keyboard Shortcut Hint */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-semibold">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-semibold">K</kbd>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {currentTheme === 'light' ? (
                <span className="text-xl">🌙</span>
              ) : (
                <span className="text-xl">☀️</span>
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-6 lg:px-8">
          <nav className="space-y-2">
            <a
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/calendar"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Calendar
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Settings
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
