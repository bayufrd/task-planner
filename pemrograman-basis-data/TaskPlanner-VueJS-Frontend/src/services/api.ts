import { authStore, getAuthToken } from '../stores/auth'
import type {
  ApiEnvelope,
  AuthResult,
  DailyStatsItem,
  LoginPayload,
  OverviewAnalysis,
  ParsedTaskDraft,
  PlannerItem,
  RegisterPayload,
  Reminder,
  Task,
  TaskPriority,
  TaskStats,
  TaskStatus,
  UserProfile,
  WeeklyStatsItem,
} from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

let refreshPromise: Promise<AuthResult> | null = null

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  return (isJson ? await response.json() : await response.text()) as T
}

function getErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'string') return payload
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, any>
    if (obj.error && typeof obj.error === 'object') {
      return obj.error.message || obj.error.code || `HTTP ${status}`
    }
    if (typeof obj.error === 'string') return obj.error
    return obj.message || `HTTP ${status}`
  }
  return `HTTP ${status}`
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = authStore.refreshSession().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

async function request<T>(path: string, options: RequestInit = {}, allowRefresh = true): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAuthToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('Unable to reach the backend server. Please check whether the API is running and reachable.')
  }

  const payload = await parseResponse<T>(response)

  if (!response.ok) {
    const message = getErrorMessage(payload, response.status)
    const isAuthRoute = path.startsWith('/auth/')
    const shouldTryRefresh = allowRefresh
      && response.status === 401
      && !isAuthRoute
      && Boolean(authStore.state.refreshToken)

    if (shouldTryRefresh) {
      try {
        await refreshAccessToken()
        return request<T>(path, options, false)
      } catch {
        authStore.logoutLocal()
      }
    }

    throw new Error(message)
  }

  return payload
}

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as ApiEnvelope<T>)) {
    return (payload as ApiEnvelope<T>).data
  }
  return payload as T
}

const authApi = {
  async register(payload: RegisterPayload) {
    const result = await request<ApiEnvelope<AuthResult>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async login(payload: LoginPayload) {
    const result = await request<ApiEnvelope<AuthResult>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async refresh(refreshToken: string) {
    const result = await request<ApiEnvelope<AuthResult>>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }, false)
    return unwrap(result)
  },
  async me() {
    const result = await request<ApiEnvelope<UserProfile>>('/api/auth/me')
    return unwrap(result)
  },
  async logout() {
    const result = await request<ApiEnvelope<null>>('/api/auth/logout', { method: 'POST' })
    return unwrap(result)
  },
}

export const taskApi = {
  async list(params: Record<string, string | number | undefined>) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, String(value))
    })
    const result = await request<ApiEnvelope<Task[]>>(`/api/tasks?${query.toString()}`)
    return { data: unwrap(result) }
  },
  async create(payload: Partial<Task>) {
    const result = await request<ApiEnvelope<Task>>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline,
        priority: payload.priority || 'MEDIUM',
        status: payload.status || 'TODO',
        estimatedDuration: payload.estimatedDuration || 60,
      }),
    })
    return unwrap(result)
  },
  async update(id: string, payload: Partial<Task>) {
    const result = await request<ApiEnvelope<Task>>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async updateStatus(id: string, status: TaskStatus) {
    const result = await request<ApiEnvelope<Task>>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return unwrap(result)
  },
  async complete(id: string) {
    const result = await request<ApiEnvelope<Task>>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DONE' }),
    })
    return unwrap(result)
  },
  async skip(id: string) {
    const result = await request<ApiEnvelope<Task>>(`/api/tasks/${id}/skip`, { method: 'POST' })
    return unwrap(result)
  },
  async remove(id: string) {
    const result = await request<ApiEnvelope<null>>(`/api/tasks/${id}`, { method: 'DELETE' })
    return unwrap(result)
  },
  async stats() {
    const result = await request<ApiEnvelope<TaskStats>>('/api/tasks/stats')
    return unwrap(result)
  },
  async dailyStats(days = 7) {
    const result = await request<ApiEnvelope<DailyStatsItem[]>>(`/api/tasks/stats/daily?days=${days}`)
    return unwrap(result)
  },
  async weeklyStats(weeks = 4) {
    const result = await request<ApiEnvelope<WeeklyStatsItem[]>>(`/api/tasks/stats/weekly?weeks=${weeks}`)
    return unwrap(result)
  },
  async byPriority(level: TaskPriority) {
    const result = await request<ApiEnvelope<Task[]>>(`/api/tasks/priority/${level}?page=1&limit=20`)
    return unwrap(result)
  },
}

export const plannerApi = {
  async today(limit = 5) {
    const result = await request<ApiEnvelope<PlannerItem[]>>(`/api/planner/today?limit=${limit}`)
    return unwrap(result)
  },
}

export const reminderApi = {
  async list() {
    const result = await request<ApiEnvelope<Reminder[]>>('/api/reminders')
    return unwrap(result)
  },
  async create(payload: Partial<Reminder>) {
    const result = await request<ApiEnvelope<Reminder>>('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async update(id: string, payload: Partial<Reminder>) {
    const result = await request<ApiEnvelope<Reminder>>(`/api/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async remove(id: string) {
    const result = await request<ApiEnvelope<null>>(`/api/reminders/${id}`, { method: 'DELETE' })
    return unwrap(result)
  },
}

export { authApi }

export const aiApi = {
  async parseTask(text: string) {
    const result = await request<ApiEnvelope<ParsedTaskDraft>>('/api/ai/parse-task', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return unwrap(result)
  },
  async overviewAnalysis() {
    const result = await request<ApiEnvelope<OverviewAnalysis>>('/api/ai/overview-analysis', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    return unwrap(result)
  },
}
