'use client'

import { useState, useCallback } from 'react'
import { taskApi, TaskStats } from '@/lib/api/client'

export interface UseTaskStatsReturn {
  stats: TaskStats | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useTaskStats(): UseTaskStatsReturn {
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const result = await taskApi.getStats()
    
    if (result.success && result.data) {
      setStats(result.data)
    } else {
      setError(result.error || 'Failed to fetch stats')
    }
    
    setLoading(false)
  }, [])

  return { stats, loading, error, refresh }
}