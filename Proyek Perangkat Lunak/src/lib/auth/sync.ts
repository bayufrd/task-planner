/**
 * Sync NextAuth (Google OAuth) session to Express JWT
 * Called when NextAuth session exists but no Express token in localStorage
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const AUTH_TOKEN_KEY = 'token'
const BACKEND_USER_KEY = 'backendUser'

function setBackendAuthCookie(token: string, expiresInDays: number = 7) {
  const expires = new Date()
  expires.setDate(expires.getDate() + expiresInDays)
  document.cookie = `backendAuthToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export async function syncNextAuthToExpress(sessionUser?: {
  email?: string | null
  name?: string | null
  accessToken?: string
}): Promise<boolean> {
  // Skip if server-side
  if (typeof window === 'undefined') return false

  // Skip if already has Express token
  const existingToken = localStorage.getItem(AUTH_TOKEN_KEY)
  if (existingToken) {
    console.debug('[auth:sync] Express token already exists, skipping sync')
    return true
  }

  if (!sessionUser?.accessToken) {
    console.debug('[auth:sync] No NextAuth Google accessToken found in session')
    return false
  }

  try {
    console.debug('[auth:sync] Syncing NextAuth session to Express JWT...')

    const response = await fetch(`${API_BASE}/api/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleAccessToken: sessionUser.accessToken,
        email: sessionUser.email,
        name: sessionUser.name,
      }),
    })

    const data = await response.json()

    if (data.success && data.data?.token) {
      // Store Express token and user info
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token)
      localStorage.setItem('auth-token', data.data.token)
      localStorage.setItem(BACKEND_USER_KEY, JSON.stringify(data.data.user))
      setBackendAuthCookie(data.data.token)

      console.debug('[auth:sync] Successfully synced NextAuth session to Express JWT', {
        email: data.data.user?.email,
      })
      return true
    } else {
      console.warn('[auth:sync] Sync failed:', data.error?.message || 'Unknown error')
      return false
    }
  } catch (error) {
    console.error('[auth:sync] Sync request failed:', error)
    return false
  }
}
