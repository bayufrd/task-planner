<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ArrowRight, Mail, Lock, Sun, Moon } from '@lucide/vue'
import { authStore } from '../stores/auth'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'
import { authService } from '../services/auth.service'

const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const errors = reactive<Record<string, string>>({})
const isLoading = ref(false)
const isGoogleLoading = ref(false)
const captchaToken = ref('')

// Turnstile configuration
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

const callbackUrl = computed(() => {
  const value = route.query.callbackUrl
  return typeof value === 'string' && value.startsWith('/') ? value : routePaths.dashboard
})

const registered = computed(() => route.query.registered === 'true')

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
  }

  if (!form.password) {
    errors.password = 'Password wajib diisi'
  }

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validateForm()) return

  if (turnstileSiteKey && !captchaToken.value) {
    errors.submit = 'Silakan selesaikan CAPTCHA terlebih dahulu.'
    return
  }

  errors.submit = ''
  isLoading.value = true
  try {
    await authStore.login({ ...form, captchaToken: captchaToken.value })
    await router.push(callbackUrl.value)
  } catch (err) {
    errors.submit = err instanceof Error ? err.message : 'Login gagal'
    isLoading.value = false
  }
}

function handleGoogleLogin() {
  isGoogleLoading.value = true
  authService.initiateGoogleLogin()
}

// Turnstile integration
onMounted(() => {
  if (turnstileSiteKey && (window as any).turnstile) {
    (window as any).turnstile.render('#turnstile-container', {
      sitekey: turnstileSiteKey,
      callback: (token: string) => {
        captchaToken.value = token
        delete errors.submit
      },
      'error-callback': () => {
        captchaToken.value = ''
        errors.submit = 'CAPTCHA gagal dimuat. Periksa konfigurasi Turnstile.'
      },
      'expired-callback': () => {
        captchaToken.value = ''
      }
    })
  }
})
</script>

<template>
  <div :class="[
    'min-h-screen w-full flex flex-col transition-colors',
    uiStore.state.theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
  ]">
    <!-- Header -->
    <nav :class="[
      'border-b transition-colors',
      uiStore.state.theme === 'dark'
        ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50'
        : 'border-gray-200/50 backdrop-blur-sm bg-white/50'
    ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <RouterLink :to="routePaths.landing" class="flex items-center">
          <div class="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
            <img src="/opt-logo/logo3.webp" alt="TaskPlanner Logo" class="h-10 w-auto rounded-xl" />
          </div>
        </RouterLink>

        <!-- Theme Toggle -->
        <button
          @click="uiStore.toggleTheme()"
          class="p-2 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun v-if="uiStore.state.theme === 'dark'" class="w-5 h-5 text-yellow-500" :stroke-width="2" />
          <Moon v-else class="w-5 h-5 text-indigo-500" :stroke-width="2" />
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 relative">
      <!-- Decorative Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div :class="['absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl', uiStore.state.theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-300/20']"></div>
        <div :class="['absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl', uiStore.state.theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-300/20']"></div>
      </div>

      <div class="w-full max-w-md relative z-10">
        <!-- Card -->
        <div :class="[
          'rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/30 border transition-colors backdrop-blur-sm p-8 space-y-8',
          uiStore.state.theme === 'dark' ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
        ]">
          <!-- Logo & Header -->
          <div class="space-y-5 text-center">
            <div class="flex justify-center">
              <div class="rounded-xl p-1 shadow-md shadow-black/10 dark:shadow-black/30 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                <img src="/opt-logo/logo1.webp" alt="TaskPlanner Logo" class="w-28 h-auto sm:w-32 md:w-36 rounded-lg" />
              </div>
            </div>

            <div class="space-y-2">
              <h1 :class="['text-3xl font-bold', uiStore.state.theme === 'dark' ? 'text-white' : 'text-gray-900']">
                Welcome Back
              </h1>
              <p :class="['text-sm', uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
                Sign in to continue managing your tasks
              </p>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="registered" :class="['p-3 rounded-lg', uiStore.state.theme === 'dark' ? 'bg-green-900/20 border border-green-800/50 text-green-300' : 'bg-green-50 border border-green-200 text-green-700']">
            <p class="text-sm">Account created successfully! Please sign in.</p>
          </div>

          <!-- Error Message -->
          <div v-if="errors.submit" :class="['p-3 rounded-lg', uiStore.state.theme === 'dark' ? 'bg-red-900/20 border border-red-800/50 text-red-300' : 'bg-red-50 border border-red-200 text-red-700']">
            <p class="text-sm">{{ errors.submit }}</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="submit" class="space-y-4">
            <!-- Email Field -->
            <div class="space-y-2">
              <label :class="['text-sm font-medium', uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
                Email Address
              </label>
              <div :class="[
                'relative rounded-lg border transition-colors',
                errors.email ? 'border-red-500' : uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              ]">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail :class="['w-5 h-5', errors.email ? 'text-red-500' : uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400']" />
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  :class="[
                    'w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2',
                    errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500',
                    uiStore.state.theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  ]"
                  placeholder="you@example.com"
                  :disabled="isLoading"
                />
              </div>
              <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label :class="['text-sm font-medium', uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
                Password
              </label>
              <div :class="[
                'relative rounded-lg border transition-colors',
                errors.password ? 'border-red-500' : uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              ]">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock :class="['w-5 h-5', errors.password ? 'text-red-500' : uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400']" />
                </div>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  :class="[
                    'w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2',
                    errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500',
                    uiStore.state.theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  ]"
                  placeholder="Enter your password"
                  :disabled="isLoading"
                />
              </div>
              <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <!-- CAPTCHA Widget -->
            <div v-if="turnstileSiteKey" id="turnstile-container" class="flex justify-center"></div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || (!!turnstileSiteKey && !captchaToken)"
              class="w-full relative h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <template v-if="isLoading">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </template>
              <template v-else>
                <span>Sign In</span>
                <ArrowRight class="w-4 h-4 ml-1" :stroke-width="2" />
              </template>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div :class="['w-full border-t', uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200']"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span :class="['px-2', uiStore.state.theme === 'dark' ? 'bg-gray-800/80 text-gray-400' : 'bg-white/80 text-gray-600']">
                Or continue with
              </span>
            </div>
          </div>

          <!-- Google Sign In Button -->
          <button
            @click="handleGoogleLogin"
            :disabled="isLoading"
            class="w-full relative h-12 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 disabled:border-gray-300 dark:disabled:border-gray-700 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span :class="uiStore.state.theme === 'dark' ? 'text-white' : 'text-gray-700'">
              Continue with Google
            </span>
          </button>

          <!-- Sign Up Link -->
          <div class="text-center pt-4">
            <p :class="['text-sm', uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
              Don't have an account?
              <RouterLink
                :to="routePaths.register"
                class="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1"
              >
                Sign up here
              </RouterLink>
            </p>
          </div>

          <!-- Features Info -->
          <div class="space-y-3 pt-6 border-t" :style="{
            borderColor: uiStore.state.theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
          }">
            <h3 :class="['text-xs font-semibold uppercase tracking-wider', uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-700']">
              What You Get
            </h3>
            <ul :class="['space-y-2 text-sm', uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                <span>AI-powered task creation & prioritization</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                <span>Real-time sync with Google Calendar</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                <span>Smart command palette (Ctrl+K)</span>
              </li>
            </ul>
          </div>

          <!-- Footer Text -->
          <div :class="['text-center text-xs space-y-2 pt-2', uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500']">
            <p>
              By signing in, you agree to our<br />
              <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Terms of Service</span> and <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>
            </p>
            <p :class="uiStore.state.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'">
              We never share your Google Calendar data with third parties
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
