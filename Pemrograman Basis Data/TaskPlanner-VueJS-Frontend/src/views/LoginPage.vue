<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowRight, ShieldCheck, Sparkles } from '@lucide/vue'
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
  <div class="next-landing-page auth-page-with-chrome">
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

    <main class="auth-page auth-layout auth-page-chrome-body">
      <section class="auth-showcase auth-showcase-image-shell">
        <img src="/opt-hero/2.png" alt="Smart Task Planner login preview" class="auth-showcase-image" />
        <div class="auth-showcase-overlay"></div>
        <div class="auth-showcase-copy auth-showcase-copy-overlay">
          <span class="hero-badge auth-hero-badge"><Sparkles :size="14" /> Secure access</span>
          <h1>Welcome back to your planning workspace.</h1>
          <p>Sign in and continue managing tasks, reminders, and daily priorities with a simpler workflow.</p>
          <ul class="auth-points">
            <li><ShieldCheck :size="18" /> Secure account access for your daily planning</li>
            <li><ArrowRight :size="18" /> Continue where you left off with tasks and reminders</li>
          </ul>
        </div>
      </section>

      <form class="panel auth-card auth-card-next" @submit.prevent="submit">
        <div class="auth-card-head">
          <span class="eyebrow">Sign in</span>
          <h2>Continue with Smart Task Planner</h2>
          <p>Access your tasks, reminders, and daily planning workspace in one place.</p>
        </div>

        <label>
          <span>Email</span>
          <input v-model="form.email" required type="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Password</span>
          <input v-model="form.password" required type="password" placeholder="••••••••" />
        </label>

        <p v-if="error" class="error-text">{{ error }}</p>

        <button class="primary-button auth-submit" :disabled="authStore.state.loading">
          {{ authStore.state.loading ? 'Signing in...' : 'Open my planner' }}
        </button>

        <p class="auth-foot">New to Smart Task Planner? <RouterLink to="/register">Create your account</RouterLink></p>
      </form>
    </main>

    <footer class="next-footer auth-chrome-footer">
      <div class="next-footer-grid">
        <div>
          <img src="/opt-logo/logo3.png" alt="Smart Task Planner" class="next-footer-logo" />
          <p class="next-footer-text">
            Smart task planning UI in Vue.js with backend-aligned authentication, task management, reminders, and AI parsing.
          </p>
        </div>
        <div>
          <h4>Product</h4>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/register">Create account</RouterLink></li>
            <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><a href="/#features">Features</a></li>
            <li><RouterLink to="/login">Sign in</RouterLink></li>
            <li><RouterLink to="/ai-assistant">AI Helper</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="/#pricing">Pricing</a></li>
            <li><RouterLink to="/reminders">Reminders</RouterLink></li>
            <li><RouterLink to="/dashboard">Workspace</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="next-footer-bottom">
        <span>© 2026 Task Planner. All rights reserved.</span>
        <div>
          <a href="/#features">Privacy Policy</a>
          <a href="/#pricing">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
</template>
