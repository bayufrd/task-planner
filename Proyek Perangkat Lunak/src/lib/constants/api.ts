/**
 * API Routes Documentation
 * Backend Express API: http://localhost:5000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const API_ROUTES = {
  TASKS: {
    BASE: `${API_BASE_URL}/api/tasks`,
    LIST: `${API_BASE_URL}/api/tasks`,
    CREATE: `${API_BASE_URL}/api/tasks`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    PRIORITY: (id: string) => `${API_BASE_URL}/api/tasks/${id}/priority`,
    STATS: `${API_BASE_URL}/api/tasks/stats`,
    STATUS: (id: string) => `${API_BASE_URL}/api/tasks/${id}/status`,
    SKIP: (id: string) => `${API_BASE_URL}/api/tasks/${id}/skip`,
  },
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  },
  REMINDERS: {
    BASE: `${API_BASE_URL}/api/reminders`,
    LIST: `${API_BASE_URL}/api/reminders`,
    CREATE: `${API_BASE_URL}/api/reminders`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/reminders/${id}`,
    DUE: `${API_BASE_URL}/api/reminders/due`,
  },
  CALENDAR: {
    BASE: `${API_BASE_URL}/api/calendar`,
    LIST: `${API_BASE_URL}/api/calendar`,
    CREATE: `${API_BASE_URL}/api/calendar`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/calendar/${id}`,
    DEFAULT: `${API_BASE_URL}/api/calendar/default`,
    SYNC: `${API_BASE_URL}/api/calendar/sync`,
    REFRESH: (id: string) => `${API_BASE_URL}/api/calendar/${id}/refresh`,
  },
} as const

export const API_METHODS = {
  TASKS: {
    LIST: { method: 'GET', endpoint: '/api/tasks' },
    CREATE: { method: 'POST', endpoint: '/api/tasks' },
    GET_BY_ID: { method: 'GET', endpoint: '/api/tasks/:id' },
    UPDATE: { method: 'PATCH', endpoint: '/api/tasks/:id' },
    DELETE: { method: 'DELETE', endpoint: '/api/tasks/:id' },
    GET_PRIORITY: { method: 'POST', endpoint: '/api/tasks/:id/priority' },
    GET_STATS: { method: 'GET', endpoint: '/api/tasks/stats' },
    UPDATE_STATUS: { method: 'PATCH', endpoint: '/api/tasks/:id/status' },
    SKIP: { method: 'POST', endpoint: '/api/tasks/:id/skip' },
  },
} as const

export const QUERY_PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ORDER: 'order',
  SEARCH: 'q',
  PRIORITY: 'priority',
  STATUS: 'status',
} as const

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const

export function buildApiUrl(baseRoute: string, params?: Record<string, string>): string {
  let url = baseRoute
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value)
    })
  }
  return url
}
