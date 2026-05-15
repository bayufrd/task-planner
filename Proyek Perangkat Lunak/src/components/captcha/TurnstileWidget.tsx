'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileConfig {
  siteKey: string
  callback: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'auto' | 'light' | 'dark'
}

export function useTurnstile() {
  const [isReady, setIsReady] = useState(false)
  const widgetRef = useRef<string | null>(null)

  useEffect(() => {
    // Check if already loaded
    if (window.turnstile) {
      setIsReady(true)
      return
    }

    // Load Turnstile script
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsReady(true)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
    }
  }, [])

  const render = useCallback((container: string | HTMLElement, options: TurnstileConfig) => {
    if (!window.turnstile) {
      console.error('Turnstile not loaded')
      return
    }

    widgetRef.current = window.turnstile.render(container, {
      sitekey: options.siteKey,
      theme: options.theme || 'auto',
      callback: options.callback,
      'error-callback': options.onError,
      'expired-callback': options.onExpire,
    })
  }, [])

  const reset = useCallback(() => {
    if (window.turnstile && widgetRef.current) {
      window.turnstile.reset(widgetRef.current)
    }
  }, [])

  const remove = useCallback(() => {
    if (window.turnstile && widgetRef.current) {
      window.turnstile.remove(widgetRef.current)
      widgetRef.current = null
    }
  }, [])

  return { isReady, render, reset, remove }
}

// Simple component version
interface TurnstileWidgetProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'auto' | 'light' | 'dark'
  className?: string
}

export function TurnstileWidget({ 
  siteKey, 
  onVerify, 
  onError, 
  onExpire, 
  theme = 'auto',
  className = ''
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const { theme: appTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const scriptId = 'cloudflare-turnstile-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement

    const onScriptLoad = () => {
      setIsLoading(false)
    }

    const onScriptError = () => {
      setError(true)
      setIsLoading(false)
    }

    if (!window.turnstile) {
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', onScriptLoad)
      script.addEventListener('error', onScriptError)
    } else {
      setIsLoading(false)
    }

    return () => {
      if (script) {
        script.removeEventListener('load', onScriptLoad)
        script.removeEventListener('error', onScriptError)
      }
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || isLoading || error) return

    const effectiveTheme = theme === 'auto' 
      ? (appTheme === 'dark' ? 'dark' : 'light')
      : theme

    widgetIdRef.current = window.turnstile!.render(containerRef.current, {
      sitekey: siteKey,
      theme: effectiveTheme as 'light' | 'dark',
      callback: onVerify,
      'error-callback': () => {
        setError(true)
        onError?.()
      },
      'expired-callback': () => {
        onExpire?.()
      },
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [siteKey, isLoading, error, theme, appTheme, onVerify, onError, onExpire])

  if (error) {
    return (
      <div className={`p-4 rounded-lg border ${appTheme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
        <p className={`text-sm ${appTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          Gagal memuat CAPTCHA. Silakan refresh halaman.
        </p>
      </div>
    )
  }

  return (
    <div className={`flex justify-center ${className}`}>
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Memuat CAPTCHA...</span>
        </div>
      )}
      <div ref={containerRef} className={isLoading ? 'hidden' : ''} />
    </div>
  )
}