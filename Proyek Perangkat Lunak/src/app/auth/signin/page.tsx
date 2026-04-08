'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Globe, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Get callback URL from query params or default to dashboard
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { redirect: true, callbackUrl })
  }

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      {/* Header */}
      <nav className={`border-b transition-colors ${theme === 'dark' ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50' : 'border-white/20 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskPlanner
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2} />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" strokeWidth={2} />
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-300/20'}`}></div>
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-300/20'}`}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Card */}
          <div className={`rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/30 border transition-colors ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-sm p-8 space-y-8`}>
            {/* Header */}
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{
                backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(191, 219, 254, 0.5)',
                borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(147, 197, 253, 0.5)'
              }}>
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Secure Login
                </span>
              </div>

              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Welcome Back
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Sign in with your Google account to get started
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800/80 text-gray-400' : 'bg-white/80 text-gray-600'}`}>
                  Login via Google
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full relative h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" strokeWidth={2} />
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2} />
                </>
              )}
            </button>

            {/* Features Info */}
            <div className="space-y-3 pt-6 border-t" style={{
              borderColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
            }}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                What You Get
              </h3>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>AI-powered task creation & prioritization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>Real-time sync with Google Calendar</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>Smart command palette (Ctrl+K)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>Haptic reminders for wearable devices</span>
                </li>
              </ul>
            </div>

            {/* Footer Text */}
            <div className={`text-center text-xs space-y-2 pt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              <p>
                By signing in, you agree to our<br />
                <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>
              </p>
              <p className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>
                We never share your Google Calendar data with third parties
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function SignInLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

// Wrap with Suspense
export default function SignIn() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  )
}
