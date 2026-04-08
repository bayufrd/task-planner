/**
 * Frontend Routes
 * Untuk navigation di aplikasi
 */

export const FRONTEND_ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
  ANALYTICS: '/analytics',
  ARCHIVE: '/archive',
} as const

export type FrontendRoute = keyof typeof FRONTEND_ROUTES
