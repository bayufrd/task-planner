<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ArrowRight, House, LayoutDashboard, LogIn, Mail, Lock, ShieldCheck, Sparkles, UserPlus } from '@lucide/vue'
import { authStore } from '../stores/auth'
import { canonicalRouteNames, routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const error = ref('')
const isCallbackBridge = computed(() => route.name === canonicalRouteNames.authCallback)
const callbackUrl = computed(() => {
  const value = route.query.callbackUrl
  return typeof value === 'string' && value.startsWith('/') ? value : routePaths.dashboard
})

onMounted(async () => {
  if (!isCallbackBridge.value) return

  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    error.value = 'No callback token found. Please sign in again.'
    await router.replace({ name: canonicalRouteNames.authSignin, query: { callbackUrl: callbackUrl.value } })
    return
  }

  authStore.state.token = token
  authStore.state.refreshToken = ''

  try {
    await authStore.fetchMe()
    await router.replace(callbackUrl.value)
  } catch {
    authStore.logoutLocal()
    error.value = 'Failed to restore your session from the callback token.'
    await router.replace({ name: canonicalRouteNames.authSignin, query: { callbackUrl: callbackUrl.value } })
  }
})

async function submit() {
  error.value = ''
  try {
    await authStore.login(form)
    await router.push(callbackUrl.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  }
}
</script>

<template>
  <div class="next-landing-page auth-page-with-chrome next-auth-page-shell">
    <header class="next-landing-header auth-chrome-header">
      <div class="next-header-content">
        <div class="next-brand-block">
          <RouterLink :to="routePaths.landing" class="next-brand-link" aria-label="Go to home">
            <div class="next-brand-image-wrap">
              <img class="next-brand-image" src="/opt-logo/logo3.png" alt="Smart Task Planner" />
            </div>
          </RouterLink>
          <nav class="next-landing-nav">
            <RouterLink :to="routePaths.landing">Home</RouterLink>
            <a href="/#features">Features</a>
          </nav>
        </div>
        <div class="next-header-actions">
          <button class="next-header-link" type="button" @click="uiStore.toggleTheme()">
            {{ uiStore.state.theme === 'dark' ? 'Light mode' : 'Dark mode' }}
          </button>
          <RouterLink :to="routePaths.authSignup" class="next-header-cta">Get started</RouterLink>
        </div>
      </div>
    </header>

    <main class="next-auth-layout next-auth-layout-signin">
      <section class="next-auth-visual-panel">
        <div class="next-auth-visual-blur next-auth-visual-blur-top"></div>
        <div class="next-auth-visual-blur next-auth-visual-blur-bottom"></div>
        <div class="next-auth-visual-card">
          <div class="next-auth-logo-center">
            <img src="/opt-logo/logo3.png" alt="TaskPlanner Logo" />
          </div>
          <div class="next-auth-heading-block">
            <h1>{{ isCallbackBridge ? 'Processing sign in' : 'Welcome Back' }}</h1>
            <p>{{ isCallbackBridge ? 'Completing your session and redirecting you now.' : 'Sign in to continue managing your tasks.' }}</p>
          </div>
          <ul class="next-auth-feature-list">
            <li><ShieldCheck :size="18" /> Secure account access for your daily planning</li>
            <li><ArrowRight :size="18" /> Continue where you left off with tasks and reminders</li>
            <li><Sparkles :size="18" /> Keep everything focused inside one productive workspace</li>
          </ul>
        </div>
      </section>

      <form v-if="!isCallbackBridge" class="next-auth-form-card" @submit.prevent="submit">
        <div v-if="import.meta.env.VITE_TURNSTILE_SITE_KEY" class="next-auth-turnstile">
          <!-- Cloudflare Turnstile Widget Placeholder -->
          <iframe
            :src="`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&sitekey=${import.meta.env.VITE_TURNSTILE_SITE_KEY}`"
            style="width: 100%; min-height: 80px; border: none; background: transparent;"
            title="Cloudflare Turnstile"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
        <div class="next-auth-card-head centered">
          <div class="next-auth-card-logo-wrap">
            <img src="/opt-logo/logo3.png" alt="TaskPlanner Logo" class="next-auth-card-logo" />
          </div>
          <div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue managing your tasks</p>
          </div>
        </div>

        <div v-if="error" class="next-auth-alert error">
          <p>{{ error }}</p>
        </div>

        <div class="next-auth-form-grid">
          <label class="next-auth-field">
            <span>Email Address</span>
            <div class="next-auth-input-shell">
              <Mail :size="18" />
              <input v-model="form.email" required type="email" placeholder="you@example.com" />
            </div>
          </label>

          <label class="next-auth-field">
            <span>Password</span>
            <div class="next-auth-input-shell">
              <Lock :size="18" />
              <input v-model="form.password" required type="password" placeholder="Enter your password" />
            </div>
          </label>
        </div>

        <button class="next-auth-submit-button" :disabled="authStore.state.loading">
          <template v-if="authStore.state.loading">Signing in...</template>
          <template v-else>
            <span>Sign In</span>
            <ArrowRight :size="16" />
          </template>
        </button>

        <div class="next-auth-divider">
          <span>What You Get</span>
        </div>

        <div class="next-auth-benefits">
          <div class="next-auth-benefit-item">
            <span>✓</span>
            <p>AI-powered task creation and prioritization</p>
          </div>
          <div class="next-auth-benefit-item">
            <span>✓</span>
            <p>Real-time planning flow with reminders and overview insights</p>
          </div>
          <div class="next-auth-benefit-item">
            <span>✓</span>
            <p>Focused dashboard workspace for your daily execution</p>
          </div>
        </div>

        <div class="next-auth-link-block">
          <p>Don't have an account? <RouterLink :to="routePaths.authSignup">Sign up here</RouterLink></p>
        </div>

        <div class="next-auth-footnote">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          <p>Canonical sign-in route follows the parity plan at <code>{{ routePaths.authSignin }}</code></p>
        </div>
      </form>

      <section v-else class="next-auth-form-card">
        <div class="next-auth-card-head centered">
          <div class="next-auth-card-logo-wrap">
            <img src="/opt-logo/logo3.png" alt="TaskPlanner Logo" class="next-auth-card-logo" />
          </div>
          <div>
            <h2>Processing sign in</h2>
            <p>Please wait while we restore your session.</p>
          </div>
        </div>

        <div class="next-auth-benefits">
          <div class="next-auth-benefit-item">
            <span>✓</span>
            <p>Callback route resolved through the canonical parity flow.</p>
          </div>
          <div class="next-auth-benefit-item">
            <span>✓</span>
            <p>You will be redirected back to your protected destination automatically.</p>
          </div>
        </div>

        <div v-if="error" class="next-auth-alert error">
          <p>{{ error }}</p>
        </div>
      </section>
    </main>

    <nav class="mobile-tabbar mobile-tabbar-public" aria-label="Public mobile navigation">
      <RouterLink class="mobile-tab" :to="routePaths.landing">
        <House :size="18" />
        <span>Home</span>
      </RouterLink>
      <a class="mobile-tab" href="/#features">
        <LayoutDashboard :size="18" />
        <span>Features</span>
      </a>
      <RouterLink class="mobile-tab" :to="routePaths.authSignin">
        <LogIn :size="18" />
        <span>Sign in</span>
      </RouterLink>
      <RouterLink class="mobile-tab" :to="routePaths.authSignup">
        <UserPlus :size="18" />
        <span>Register</span>
      </RouterLink>
    </nav>
  </div>
</template>
