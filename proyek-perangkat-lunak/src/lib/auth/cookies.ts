/**
 * Helper functions for managing authentication cookies
 */

export function setAuthCookie(token: string, expiresInDays: number = 7) {
  const expires = new Date()
  expires.setDate(expires.getDate() + expiresInDays)
  
  document.cookie = `backendAuthToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export function getAuthCookie(): string | null {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'backendAuthToken') {
      return value
    }
  }
  return null
}

export function removeAuthCookie() {
  document.cookie = 'backendAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax'
}