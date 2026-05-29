import { computed, reactive } from 'vue'
import { authApi } from '../services/api'
import type { AuthResult, LoginPayload, RegisterPayload, UserProfile } from '../types'

const TOKEN_KEY = 'taskplanner_token'
const REFRESH_TOKEN_KEY = 'taskplanner_refresh_token'
const USER_KEY = 'taskplanner_user'

function readStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

const state = reactive({
  token: localStorage.getItem(TOKEN_KEY) || '',
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || '',
  user: readStoredUser() as UserProfile | null,
  loading: false,
})

function persist() {
  if (state.token) localStorage.setItem(TOKEN_KEY, state.token)
  else localStorage.removeItem(TOKEN_KEY)

  if (state.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken)
  else localStorage.removeItem(REFRESH_TOKEN_KEY)

  if (state.user) localStorage.setItem(USER_KEY, JSON.stringify(state.user))
  else localStorage.removeItem(USER_KEY)
}

function applyAuthResult(result: AuthResult) {
  state.token = result.token
  state.refreshToken = result.refreshToken || ''
  state.user = result.user
  persist()
}

export const authStore = {
  state,
  isAuthenticated: computed(() => Boolean(state.token)),
  async login(payload: LoginPayload) {
    state.loading = true
    try {
      const result = await authApi.login(payload)
      applyAuthResult(result)
      return result
    } finally {
      state.loading = false
    }
  },
  async register(payload: RegisterPayload) {
    state.loading = true
    try {
      const result = await authApi.register(payload)
      applyAuthResult(result)
      return result
    } finally {
      state.loading = false
    }
  },
  async refreshSession() {
    if (!state.refreshToken) {
      this.logoutLocal()
      throw new Error('No refresh token available')
    }

    const result = await authApi.refresh(state.refreshToken)
    applyAuthResult(result)
    return result
  },
  async fetchMe() {
    const profile = await authApi.me()
    state.user = profile
    persist()
    return profile
  },
  async logout() {
    try {
      await authApi.logout()
    } finally {
      this.logoutLocal()
    }
  },
  logoutLocal() {
    state.token = ''
    state.refreshToken = ''
    state.user = null
    persist()
  },
}

export function getAuthToken() {
  return state.token
}
