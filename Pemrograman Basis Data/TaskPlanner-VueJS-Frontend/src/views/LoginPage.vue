<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
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
  <main class="auth-page">
    <form class="panel auth-card" @submit.prevent="submit">
      <h1>Welcome back</h1>
      <p>Sign in with email and password.</p>
      <label>
        <span>Email</span>
        <input v-model="form.email" required type="email" placeholder="you@example.com" />
      </label>
      <label>
        <span>Password</span>
        <input v-model="form.password" required type="password" placeholder="••••••••" />
      </label>
      <p v-if="error" class="error-text">{{ error }}</p>
      <button class="primary-button" :disabled="authStore.state.loading">{{ authStore.state.loading ? 'Signing in...' : 'Sign in' }}</button>
      <p class="auth-foot">No account yet? <RouterLink to="/register">Create one</RouterLink></p>
    </form>
  </main>
</template>
