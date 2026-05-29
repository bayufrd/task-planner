<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowRight, House, LayoutDashboard, LogIn, Mail, Lock, ShieldCheck, Sparkles, UserPlus } from '@lucide/vue'
import { authStore } from '../stores/auth'

const router = useRouter()
const form = reactive({ email: '', password: '' })
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await authStore.login(form)
    router.push('/dashboard')
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
          <RouterLink to="/" class="next-brand-link" aria-label="Go to home">
            <div class="next-brand-image-wrap">
              <img class="next-brand-image" src="/opt-logo/logo3.png" alt="Smart Task Planner" />
            </div>
          </RouterLink>
          <nav class="next-landing-nav">
            <RouterLink to="/">Home</RouterLink>
            <a href="/#features">Features</a>
          </nav>
        </div>
        <div class="next-header-actions">
          <RouterLink to="/login" class="next-header-link">Sign in</RouterLink>
          <RouterLink to="/register" class="next-header-cta">Get started</RouterLink>
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue managing your tasks.</p>
          </div>
          <ul class="next-auth-feature-list">
            <li><ShieldCheck :size="18" /> Secure account access for your daily planning</li>
            <li><ArrowRight :size="18" /> Continue where you left off with tasks and reminders</li>
            <li><Sparkles :size="18" /> Keep everything focused inside one productive workspace</li>
          </ul>
        </div>
      </section>

      <form class="next-auth-form-card" @submit.prevent="submit">
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
            <p>AI-powered task creation & prioritization</p>
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
          <p>Don't have an account? <RouterLink to="/register">Sign up here</RouterLink></p>
        </div>

        <div class="next-auth-footnote">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          <p>TaskPlanner Vue version uses email/password authentication only</p>
        </div>
      </form>
    </main>

    <nav class="mobile-tabbar mobile-tabbar-public" aria-label="Public mobile navigation">
      <RouterLink class="mobile-tab" to="/">
        <House :size="18" />
        <span>Home</span>
      </RouterLink>
      <a class="mobile-tab" href="/#features">
        <LayoutDashboard :size="18" />
        <span>Features</span>
      </a>
      <RouterLink class="mobile-tab" to="/login">
        <LogIn :size="18" />
        <span>Sign in</span>
      </RouterLink>
      <RouterLink class="mobile-tab" to="/register">
        <UserPlus :size="18" />
        <span>Register</span>
      </RouterLink>
    </nav>
  </div>
</template>
