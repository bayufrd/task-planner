export const routePaths = {
  landing: '/',
  authSignin: '/auth/signin',
  authSignup: '/auth/signup',
  authCallback: '/auth/callback',
  dashboard: '/dashboard',
  overview: '/overview',
  connectWhatsapp: '/connectwhatsapp',
  loginAlias: '/login',
  registerAlias: '/register',
  reminders: '/reminders',
  assistant: '/assistant',
} as const

export const canonicalRouteNames = {
  landing: 'landing',
  authSignin: 'auth-signin',
  authSignup: 'auth-signup',
  authCallback: 'auth-callback',
  dashboard: 'dashboard',
  overview: 'overview',
  connectWhatsapp: 'connect-whatsapp',
} as const

export const deferredRouteNames = {
  reminders: 'reminders',
  assistant: 'assistant',
} as const

export const routeMeta = {
  public: { layout: 'public' },
  auth: { layout: 'auth', guestOnly: true },
  protected: { layout: 'protected', requiresAuth: true },
  deferred: { layout: 'protected', requiresAuth: true, deferred: true },
} as const

export const protectedNavigationRoutes = [
  canonicalRouteNames.dashboard,
  canonicalRouteNames.overview,
  canonicalRouteNames.connectWhatsapp,
] as const
