<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ArrowRight, Mail, Lock, Sun, Moon } from '@lucide/vue'
import { authStore } from '../stores/auth'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const error = ref('')
const isLoading = ref(false)

const callbackUrl = computed(() => {
  const value = route.query.callbackUrl
  return typeof value === 'string' && value.startsWith('/') ? value : routePaths.dashboard
})

async function submit() {
  error.value = ''
  isLoading.value = true
  try {
    await authStore.login(form)
    await router.push(callbackUrl.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
    isLoading.value = false
  }
}
</script>

<template>
  <div :class="[
    'min-h-screen w-full flex flex-col transition-colors',
    uiStore.state.theme === 'dark'
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950'
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
  ]">
    <!-- Header Navigation -->
    <nav :class="[
      'sticky top-0 z-40 border-b transition-colors',
      uiStore.state.theme === 'dark'
        ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50'
        : 'border-white/20 backdrop-blur-sm bg-white/50'
    ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <!-- Logo -->
        <RouterLink :to="routePaths.landing" class="flex items-center" aria-label="Go to home">
          <div :class="[
            'rounded-xl shadow-sm p-0.5',
            'shadow-black/5 dark:shadow-black/10',
            'bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm'
          ]">
            <img src="/opt-logo/logo3.webp" alt="TaskPlanner Logo" class="h-10 w-auto rounded-xl" />
          </div>
        </RouterLink>

        <!-- Theme Toggle Button -->
        <button
          @click="uiStore.toggleTheme()"
          :class="[
            'p-2 rounded-lg border transition-all duration-200',
            uiStore.state.theme === 'dark'
              ? 'border-gray-700/50 bg-gray-900/50 hover:bg-gray-800/50'
              : 'border-gray-200/50 bg-gray-100/50 hover:bg-gray-200'
          ]"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <Sun v-if="uiStore.state.theme === 'dark'" class="w-5 h-5 text-yellow-500" :stroke-width="2" />
          <Moon v-else class="w-5 h-5 text-gray-600" :stroke-width="2" />
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 relative">
      <!-- Background Gradient Blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div :class="[
          'absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-40',
          uiStore.state.theme === 'dark' ? 'bg-blue-900' : 'bg-blue-300'
        ]"></div>
        <div :class="[
          'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40',
          uiStore.state.theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-300'
        ]"></div>
      </div>

      <!-- Login Card -->
      <div class="w-full max-w-md relative z-10">
        <div :class="[
          'rounded-3xl shadow-2xl shadow-black/20 border transition-all duration-200 p-8 space-y-8',
          'backdrop-blur-xl',
          uiStore.state.theme === 'dark'
            ? 'bg-gray-800/80 border-gray-700/50 dark:shadow-black/30'
            : 'bg-white/90 border-white/30 shadow-white/20'
        ]">
          <!-- Logo Section -->
          <div class="space-y-5 text-center">
            <div class="flex justify-center">
              <div :class="[
                'rounded-xl p-1 shadow-md',
                'shadow-black/10 dark:shadow-black/30',
                'bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm'
              ]">
                <img src="/opt-logo/logo1.webp" alt="TaskPlanner Logo" class="w-28 h-auto rounded-lg" />
              </div>
            </div>
            <div class="space-y-2">
              <h1 :class="[
                'text-3xl font-bold tracking-tight',
                uiStore.state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              ]">Welcome Back</h1>
              <p :class="[
                'text-sm leading-relaxed',
                uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              ]">Sign in to continue managing your tasks</p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" :class="[
            'rounded-lg px-4 py-3 text-sm',
            'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
          ]">
            {{ error }}
          </div>

          <!-- Form -->
          <form @submit.prevent="submit" class="space-y-5">
            <!-- Email Field -->
            <div class="space-y-2">
              <label :class="[
                'text-sm font-medium',
                uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              ]">Email Address</label>
              <div :class="[
                'relative rounded-lg border transition-all duration-200',
                uiStore.state.theme === 'dark'
                  ? 'border-gray-700/50 focus-within:border-blue-500'
                  : 'border-gray-300 focus-within:border-blue-500'
              ]">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Mail :class="[
                    'w-5 h-5 transition-colors',
                    uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  ]" :stroke-width="2" />
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  :class="[
                    'w-full pl-10 pr-4 py-3 rounded-lg bg-transparent',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                    'placeholder-gray-400 dark:placeholder-gray-500',
                    uiStore.state.theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-900'
                  ]"
                  placeholder="you@example.com"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label :class="[
                'text-sm font-medium',
                uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              ]">Password</label>
              <div :class="[
                'relative rounded-lg border transition-all duration-200',
                uiStore.state.theme === 'dark'
                  ? 'border-gray-700/50 focus-within:border-blue-500'
                  : 'border-gray-300 focus-within:border-blue-500'
              ]">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Lock :class="[
                    'w-5 h-5 transition-colors',
                    uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  ]" :stroke-width="2" />
                </div>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  :class="[
                    'w-full pl-10 pr-4 py-3 rounded-lg bg-transparent',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                    'placeholder-gray-400 dark:placeholder-gray-500',
                    uiStore.state.theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-900'
                  ]"
                  placeholder="Enter your password"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              :class="[
                'w-full h-12 rounded-lg font-semibold text-white',
                'bg-gradient-to-r from-blue-600 to-indigo-600',
                'hover:from-blue-700 hover:to-indigo-700',
                'active:from-blue-800 active:to-indigo-800',
                'shadow-lg shadow-blue-500/20',
                'flex items-center justify-center gap-3',
                'transition-all duration-200',
                'disabled:opacity-70 disabled:cursor-not-allowed'
              ]"
            >
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
              <ArrowRight v-if="!isLoading" class="w-4 h-4" :stroke-width="2" />
            </button>
          </form>

          <!-- Sign Up Link -->
          <p :class="[
            'text-sm text-center',
            uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          ]">
            Don't have an account?
            <RouterLink
              :to="routePaths.authSignup"
              :class="[
                'font-semibold transition-colors',
                uiStore.state.theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              ]"
            >
              Sign up
            </RouterLink>
          </p>
        </div>

        <!-- Footer Text -->
        <p :class="[
          'text-center text-xs mt-6 px-4',
          uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        ]">
          Protected by Turnstile verification. Your security is our priority.
        </p>
      </div>
    </div>
  </div>
</template>
