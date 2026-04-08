'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Globe, ArrowRight } from 'lucide-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-200/50 dark:border-gray-700/50 p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Smart Task Planner
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intelligent task management with Google Calendar sync
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Get started
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full relative h-12 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
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

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Your Google Calendar will be synced automatically
            </p>
          </div>

          {/* Features Info */}
          <div className="space-y-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>AI-powered task prioritization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Real-time Google Calendar sync</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Command palette (Ctrl+K)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Dark mode & responsive design</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
