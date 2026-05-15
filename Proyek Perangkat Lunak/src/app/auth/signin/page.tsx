'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useState } from 'react'
import { Globe, ArrowRight, Sparkles, Moon, Sun, Mail, Lock } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import Link from 'next/link'
import Image from 'next/image'
import { setAuthCookie } from '@/lib/auth/cookies'
import { TurnstileWidget } from '@/components/captcha/TurnstileWidget'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { theme, toggleTheme } = useTheme()

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  // Custom Google Icon Component
  const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
  // Get callback URL from query params or default to dashboard
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const registered = searchParams.get('registered')

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { redirect: true, callbackUrl })
  }

  const handleBackHome = () => {
    router.push('/')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'


      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          captchaToken
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Login gagal')
      }

      // Save JWT token to cookie AND localStorage — both needed by different parts of app
      if (data?.data?.token) {
        // Save to cookie for middleware
        setAuthCookie(data.data.token, 7) // 7 days expiry
        // Save to localStorage for dashboard/task API calls (single auth key)
        localStorage.setItem('auth-token', data.data.token)

        // Save user data for form-login fallback profile
        if (data?.data?.user) {
          localStorage.setItem('backendUser', JSON.stringify(data.data.user))
        }
      } else {
        console.warn('[auth:login] success response did not include token')
      }


      // Redirect to dashboard
      router.push(callbackUrl)
    } catch (error) {
      console.error('[auth:login] failed', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Terjadi kesalahan saat login'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      {/* Header */}
      <nav className={`border-b transition-colors ${theme === 'dark' ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50' : 'border-white/20 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
              <Image src="/opt-logo/logo3.png" alt="TaskPlanner Logo" width={120} height={40} className="h-10 w-auto rounded-xl" priority />
            </div>
          </Link>

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
            {/* Logo & Header */}
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="rounded-xl p-1 shadow-md shadow-black/10 dark:shadow-black/30 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                  <Image
                    src="/opt-logo/logo1.png"
                    alt="TaskPlanner Logo"
                    width={160}
                    height={160}
                    className="w-28 h-auto sm:w-32 md:w-36 rounded-lg"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Back
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in to continue managing your tasks
                </p>
              </div>
            </div>

            {/* Success Message */}
            {registered && (
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-800/50 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                <p className="text-sm">Account created successfully! Please sign in.</p>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border border-red-800/50 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className={`relative rounded-lg border ${errors.email ? 'border-red-500' : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} transition-colors`}>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className={`w-5 h-5 ${errors.email ? 'text-red-500' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'} ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className={`relative rounded-lg border ${errors.password ? 'border-red-500' : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} transition-colors`}>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className={`w-5 h-5 ${errors.password ? 'text-red-500' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'} ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* CAPTCHA Widget */}
              {turnstileSiteKey && (
                <TurnstileWidget
                  siteKey={turnstileSiteKey}
                  onVerify={handleCaptchaVerify}
                  onExpire={handleCaptchaExpire}
                  theme="auto"
                />
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (!turnstileSiteKey && !captchaToken)}
                className="w-full relative h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-1" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800/80 text-gray-400' : 'bg-white/80 text-gray-600'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full relative h-12 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 disabled:border-gray-300 dark:disabled:border-gray-700 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow"
            >
                <GoogleIcon className="w-5 h-5" />
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>
                Continue with Google
              </span>
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {'Don\'t have an account? '}
                <Link
                  href={`/auth/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>

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
