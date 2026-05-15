/**
 * API Client with Auth Token Support
 * Uses localStorage token for authenticated requests
 */

export const AUTH_TOKEN_KEY = 'auth-token'

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  // 1. Check localStorage - unified to use only AUTH_TOKEN_KEY ('auth-token')
  const localToken = localStorage.getItem(AUTH_TOKEN_KEY)
  if (localToken) return localToken

  // 2. Check cookies (backendAuthToken)
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'backendAuthToken') {
      return value
    }
  }

  return null
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      }
    }

    return {
      success: true,
      data: data.data || data,
    }
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

export interface TaskStats {
  pending: number
  done: number
  skipped: number
}

export interface DailyStat {
  date: string
  count: number
}

export interface WeeklyStat {
  week: string
  count: number
}

export interface OverviewAnalysis {
  score: number
  insights: string[]
  advice: Array<{
    title: string
    description: string
    type: 'success' | 'warning' | 'info'
  }>
}

// Task API helpers
export const taskApi = {
  getStats: async (): Promise<{ success: boolean; data?: TaskStats; error?: string }> => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest<TaskStats>(`${API_BASE}/api/tasks/stats`)
  },

  getDailyStats: async (days: number = 30): Promise<{ success: boolean; data?: DailyStat[]; error?: string }> => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest<DailyStat[]>(`${API_BASE}/api/tasks/stats/daily?days=${days}`)
  },

  getWeeklyStats: async (weeks: number = 12): Promise<{ success: boolean; data?: WeeklyStat[]; error?: string }> => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest<WeeklyStat[]>(`${API_BASE}/api/tasks/stats/weekly?weeks=${weeks}`)
  },

  updateStatus: async (taskId: string, status: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest(`${API_BASE}/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  
  complete: async (taskId: string) => {
    return taskApi.updateStatus(taskId, 'DONE')
  },
  
  skip: async (taskId: string) => {
    return taskApi.updateStatus(taskId, 'SKIPPED')
  },

  delete: async (taskId: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest(`${API_BASE}/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
  },
}

// AI / LLM parsing helpers
export interface ParsedTaskCommand {
  title: string
  description?: string
  deadline: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedDuration: number
  tags: string[]
  reminderTime: number
}

export const aiApi = {
  parseTaskCommand: async (command: string): Promise<{ success: boolean; data?: ParsedTaskCommand; error?: string }> => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest<ParsedTaskCommand>(`${API_BASE}/api/ai/parse-task`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    })
  },

  analyzeOverview: async (
    stats: TaskStats,
    dailyData: DailyStat[]
  ): Promise<{ success: boolean; data?: OverviewAnalysis; error?: string }> => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return apiRequest<OverviewAnalysis>(`${API_BASE}/api/ai/overview-analysis`, {
      method: 'POST',
      body: JSON.stringify({ stats, dailyData }),
    })
  },
}
