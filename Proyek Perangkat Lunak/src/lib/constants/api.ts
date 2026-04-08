/**
 * API Routes Documentation
 */

export const API_ROUTES = {
  TASKS: {
    BASE: '/api/tasks',
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    BY_ID: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
    PRIORITY: '/api/tasks/priority',
  },
} as const

export const API_METHODS = {
  TASKS: {
    LIST: { method: 'GET', endpoint: '/api/tasks' },
    CREATE: { method: 'POST', endpoint: '/api/tasks' },
    GET_BY_ID: { method: 'GET', endpoint: '/api/tasks/:id' },
    UPDATE: { method: 'PUT', endpoint: '/api/tasks/:id' },
    DELETE: { method: 'DELETE', endpoint: '/api/tasks/:id' },
    GET_PRIORITY: { method: 'GET', endpoint: '/api/tasks/priority' },
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
