<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRight, House, LayoutDashboard, LogIn, Mail, Lock, Sparkles, User, UserPlus } from '@lucide/vue'
import { authStore } from '../stores/auth'

const router = useRouter()
const form = reactive({ name: '', email: '', password: '' })
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await authStore.register(form)
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
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

    <main class="next-auth-layout next-auth-layout-signup">
      <section class="next-auth-visual-panel">
        <div class="next-auth-visual-blur next-auth-visual-blur-top"></div>
        <div class="next-auth-visual-blur next-auth-visual-blur-bottom"></div>
        <div class="next-auth-visual-card">
          <div class="next-auth-logo-center">
            <img src="/opt-logo/logo3.png" alt="TaskPlanner Logo" />
          </div>
          <div class="next-auth-heading-block">
            <h1>Join TaskPlanner</h1>
            <p>Create your account to start planning smarter.</p>
          </div>
          <ul class="next-auth-feature-list">
            <li><UserPlus :size="18" /> Quick account setup for a smoother planning flow</li>
            <li><ArrowRight :size="18" /> Start building better daily habits from your first task</li>
            <li><Sparkles :size="18" /> Unlock overview insights, task planning, and reminders in one place</li>
          </ul>
        </div>
      </section>

      <form class="next-auth-form-card" @submit.prevent="submit">
        <div class="next-auth-card-head centered">
          <div class="next-auth-card-logo-wrap">
            <img src="/opt-logo/logo3.png" alt="TaskPlanner Logo" class="next-auth-card-logo" />
          </div>
          <div>
            <h2>Join TaskPlanner</h2>
            <p>Create your account to start planning smarter</p>
          </div>
        </div>

        <div v-if="error" class="next-auth-alert error">
          <p>{{ error }}</p>
        </div>

        <div class="next-auth-form-grid">
          <label class="next-auth-field">
            <span>Full Name</span>
            <div class="next-auth-input-shell">
              <User :size="18" />
              <input v-model="form.name" required type="text" placeholder="Enter your full name" />
            </div>
          </label>

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
              <input v-model="form.password" required minlength="6" type="password" placeholder="Minimum 6 characters" />
            </div>
          </label>
        </div>

        <button class="next-auth-submit-button" :disabled="authStore.state.loading">
          <template v-if="authStore.state.loading">Creating account...</template>
          <template v-else>
            <Sparkles :size="16" />
            <span>Create Account</span>
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
            <p>Overview insights and planning trends from your activity</p>
          </div>
          <div class="next-auth-benefit-item">
            <span>✓</span>
            <p>Focused dashboard workspace with reminders and task flow</p>
          </div>
        </div>

        <div class="next-auth-link-block">
          <p>Already have an account? <RouterLink to="/login">Sign in here</RouterLink></p>
        </div>

        <div class="next-auth-footnote">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
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
