/**
 * Custom Hooks
 * Reusable React hooks untuk component functionality
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * useDebounce - Debounce state value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * useLocalStorage - Manage state dengan localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key])

  return [storedValue, setValue]
}

/**
 * useAsync - Handle async operations
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true
): { status: 'idle' | 'pending' | 'success' | 'error'; value?: T; error?: E } {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [value, setValue] = useState<T | undefined>(undefined)
  const [error, setError] = useState<E | undefined>(undefined)

  const execute = useCallback(async () => {
    setStatus('pending')
    setValue(undefined)
    setError(undefined)

    try {
      const response = await asyncFunction()
      setValue(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { status, value, error }
}

/**
 * useClickOutside - Detect click outside element
 */
export function useClickOutside(callback: () => void) {
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return

    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [callback])

  return ref
}
