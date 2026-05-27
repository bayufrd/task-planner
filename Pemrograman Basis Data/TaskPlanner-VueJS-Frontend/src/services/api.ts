import { getAuthToken } from '../stores/auth'
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAuthToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload?.message || payload?.error || `HTTP ${response.status}`
    throw new Error(message)
  }

  return payload as T
}

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as ApiEnvelope<T>)) {
    return (payload as ApiEnvelope<T>).data
  }
  return payload as T
}

export const authApi = {
  async register(payload: RegisterPayload) {
    const result = await request<ApiEnvelope<AuthResult>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async login(payload: LoginPayload) {
    const result = await request<ApiEnvelope<AuthResult>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async me() {
    const result = await request<ApiEnvelope<UserProfile>>('/auth/me')
    return unwrap(result)
  },
  async logout() {
    const result = await request<ApiEnvelope<null>>('/auth/logout', { method: 'POST' })
    return unwrap(result)
  },
}

export const taskApi = {
  async list(params: Record<string, string | number | undefined>) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, String(value))
    })
    const result = await request<ApiEnvelope<Task[]>>(`/tasks?${query.toString()}`)
    return { data: unwrap(result) }
  },
  async create(payload: Partial<Task>) {
    const result = await request<ApiEnvelope<Task>>('/tasks', {
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
    const result = await request<ApiEnvelope<Task>>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async updateStatus(id: string, status: TaskStatus) {
    const result = await request<ApiEnvelope<Task>>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return unwrap(result)
  },
  async complete(id: string) {
    const result = await request<ApiEnvelope<Task>>(`/tasks/${id}/complete`, { method: 'POST' })
    return unwrap(result)
  },
  async skip(id: string) {
    const result = await request<ApiEnvelope<Task>>(`/tasks/${id}/skip`, { method: 'POST' })
    return unwrap(result)
  },
  async remove(id: string) {
    const result = await request<ApiEnvelope<null>>(`/tasks/${id}`, { method: 'DELETE' })
    return unwrap(result)
  },
  async stats() {
    const result = await request<ApiEnvelope<TaskStats>>('/tasks/stats')
    return unwrap(result)
  },
  async dailyStats(days = 7) {
    const result = await request<ApiEnvelope<DailyStatsItem[]>>(`/tasks/stats/daily?days=${days}`)
    return unwrap(result)
  },
  async weeklyStats(weeks = 4) {
    const result = await request<ApiEnvelope<WeeklyStatsItem[]>>(`/tasks/stats/weekly?weeks=${weeks}`)
    return unwrap(result)
  },
  async byPriority(level: TaskPriority) {
    const result = await request<ApiEnvelope<Task[]>>(`/tasks/priority/${level}?page=1&limit=20`)
    return unwrap(result)
  },
}

export const plannerApi = {
  async today(limit = 5) {
    const result = await request<ApiEnvelope<PlannerItem[]>>(`/planner/today?limit=${limit}`)
    return unwrap(result)
  },
}

export const reminderApi = {
  async list() {
    const result = await request<ApiEnvelope<Reminder[]>>('/reminders')
    return unwrap(result)
  },
  async create(payload: Partial<Reminder>) {
    const result = await request<ApiEnvelope<Reminder>>('/reminders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async update(id: string, payload: Partial<Reminder>) {
    const result = await request<ApiEnvelope<Reminder>>(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return unwrap(result)
  },
  async remove(id: string) {
    const result = await request<ApiEnvelope<null>>(`/reminders/${id}`, { method: 'DELETE' })
    return unwrap(result)
  },
}

export const aiApi = {
  async parseTask(text: string) {
    const result = await request<ApiEnvelope<ParsedTaskDraft>>('/ai/parse-task', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return unwrap(result)
  },
  async overviewAnalysis() {
    const result = await request<ApiEnvelope<OverviewAnalysis>>('/ai/overview-analysis', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    return unwrap(result)
  },
}
