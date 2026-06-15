import { authApi } from './api'

export interface User {
  id: string
  email: string
  name: string
  image?: string
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

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

class AuthService {
  private readonly TOKEN_KEY = 'auth-token'
  private readonly USER_KEY = 'auth-user'

  /**
   * Register new user with email/password
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await authApi.register(data)
    if (response.data.success && response.data.data) {
      this.setToken(response.data.data.token)
      this.setUser(response.data.data.user)
    }
    return response.data
  }

  /**
   * Login with email/password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.login(data)
    if (response.data.success && response.data.data) {
      this.setToken(response.data.data.token)
      this.setUser(response.data.data.user)
    }
    return response.data
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authApi.getCurrentUser()
      if (response.data.success && response.data.data) {
        this.setUser(response.data.data.user)
        return response.data.data.user
      }
      return null
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
   * Set user
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
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
