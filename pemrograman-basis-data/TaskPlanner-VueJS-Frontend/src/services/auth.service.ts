import { authApi } from './api'
import type { AuthResult, LoginPayload, RegisterPayload } from '../types'

export interface User {
  id: string
  email: string
  name: string
  image?: string | null
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    token: string
  }
  error?: {
    message: string
  }
}

class AuthService {
  private readonly TOKEN_KEY = 'auth-token'
  private readonly USER_KEY = 'auth-user'

  /**
   * Register new user with email/password
   */
  async register(data: RegisterPayload): Promise<AuthResult> {
    const response = await authApi.register(data)
    return response
  }

  /**
   * Login with email/password
   */
  async login(data: LoginPayload): Promise<AuthResult> {
    const response = await authApi.login(data)
    return response
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authApi.me()
      return response
    } catch (error) {
      console.error('[auth] Failed to get current user:', error)
      return null
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('[auth] Logout request failed:', error)
    } finally {
      this.clearAuth()
    }
  }

  /**
   * Initiate Google OAuth flow
   */
  initiateGoogleLogin(): void {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
    const googleAuthUrl = `${apiBase.replace('/api', '')}/api/auth/google`
    window.location.href = googleAuthUrl
  }

  /**
   * Handle Google OAuth callback with token
   */
  handleGoogleCallback(token: string): void {
    this.setToken(token)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Set token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    if (!userJson) return null
    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  }

  /**
   * Clear all auth data
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }
}

export const authService = new AuthService()
