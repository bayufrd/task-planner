<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import { authService } from '../services/auth.service'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const token = route.query.token as string

  if (token) {
    // Store token from Google OAuth callback
    authService.handleGoogleCallback(token)

    // Fetch user info
    await authStore.fetchMe()

    // Redirect to dashboard
    router.push('/dashboard')
  } else {
    // No token, redirect to login with error
    router.push('/auth/signin?error=auth_failed')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="text-center">
      <div class="inline-block">
        <svg
          class="animate-spin h-12 w-12 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p class="mt-4 text-lg text-gray-600 font-medium">Completing authentication...</p>
      <p class="mt-2 text-sm text-gray-500">Please wait while we set up your account</p>
    </div>
  </div>
</template>
