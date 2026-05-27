<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
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
  <main class="auth-page">
    <form class="panel auth-card" @submit.prevent="submit">
      <h1>Create account</h1>
      <p>Register with the Java backend local auth API.</p>
      <label>
        <span>Name</span>
        <input v-model="form.name" required type="text" placeholder="Alex" />
      </label>
      <label>
        <span>Email</span>
        <input v-model="form.email" required type="email" placeholder="you@example.com" />
      </label>
      <label>
        <span>Password</span>
        <input v-model="form.password" required minlength="6" type="password" placeholder="Minimum 6 characters" />
      </label>
      <p v-if="error" class="error-text">{{ error }}</p>
      <button class="primary-button" :disabled="authStore.state.loading">{{ authStore.state.loading ? 'Creating...' : 'Create account' }}</button>
      <p class="auth-foot">Already have an account? <RouterLink to="/login">Sign in</RouterLink></p>
    </form>
  </main>
</template>
