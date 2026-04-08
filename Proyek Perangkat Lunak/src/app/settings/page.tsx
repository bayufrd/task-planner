'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Save, Bell, Moon, Sun, Lock, Database, Trash2, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('header.settings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your preferences and account settings
          </p>
        </div>

        {/* Save Feedback */}
        {saved && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 flex items-center gap-2">
            <Save className="w-5 h-5" strokeWidth={2} />
            Settings saved successfully!
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Language</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">🇬🇧 English</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="id"
                  checked={language === 'id'}
                  onChange={() => setLanguage('id')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">🇮🇩 Indonesian (Bahasa Indonesia)</span>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" strokeWidth={2} />
              Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">Enable notifications</span>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer opacity-50">
                <span className="text-gray-700 dark:text-gray-300">Email reminders</span>
                <input
                  type="checkbox"
                  disabled
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {theme === 'light' ? (
                <Sun className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Moon className="w-5 h-5" strokeWidth={2} />
              )}
              Theme
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">☀️ Light Mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">🌙 Dark Mode</span>
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" strokeWidth={2} />
              Data Management
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">Auto-save changes</span>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                  className="w-5 h-5"
                />
              </label>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Trash2 className="w-5 h-5" strokeWidth={2} />
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" strokeWidth={2} />
              Account
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2 font-medium">
                <LogOut className="w-5 h-5" strokeWidth={2} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" strokeWidth={2} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
