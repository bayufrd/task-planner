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

const registered = computed(() => route.query.registered === 'true')

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
      'border-b transition-colors',
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
      <!-- Decorative Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div :class="[
          'absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20',
          uiStore.state.theme === 'dark' ? 'bg-blue-900' : 'bg-blue-300'
        ]"></div>
        <div :class="[
          'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20',
          uiStore.state.theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-300'
        ]"></div>
      </div>

      <!-- Login Card -->
      <div class="w-full max-w-md relative z-10">
        <div :class="[
          'rounded-3xl shadow-xl transition-all duration-200 p-8 space-y-6',
          'backdrop-blur-sm border',
          uiStore.state.theme === 'dark'
            ? 'bg-gray-800/80 border-gray-700/50 shadow-black/30'
            : 'bg-white/80 border-gray-200/50 shadow-black/10'
        ]">
          <!-- Logo Section -->
          <div class="space-y-4 text-center">
            <div class="flex justify-center">
              <div :class="[
                'rounded-lg p-1 shadow-md',
                'shadow-black/10 dark:shadow-black/30',
                'bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm'
              ]">
                <img src="/opt-logo/logo1.webp" alt="TaskPlanner" class="w-28 h-28 rounded-lg" />
              </div>
            </div>

            <div class="space-y-2">
              <h1 :class="[
                'text-3xl font-bold tracking-tight',
                uiStore.state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              ]">Welcome Back</h1>
              <p :class="[
                'text-sm',
                uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              ]">Sign in to continue managing your tasks</p>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="registered" :class="[
            'p-3 rounded-lg text-sm',
            uiStore.state.theme === 'dark'
              ? 'bg-green-900/20 border border-green-800/50 text-green-300'
              : 'bg-green-50 border border-green-200 text-green-700'
          ]">
            <p>Account created successfully! Please sign in.</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" :class="[
            'p-3 rounded-lg text-sm',
            uiStore.state.theme === 'dark'
              ? 'bg-red-900/20 border border-red-800/50 text-red-300'
              : 'bg-red-50 border border-red-200 text-red-700'
          ]">
            {{ error }}
          </div>

          <!-- Login Form -->
          <form @submit.prevent="submit" class="space-y-4">
            <!-- Email Field -->
            <div class="space-y-2">
              <label :class="[
                'text-sm font-medium',
                uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              ]">Email Address</label>
              <div :class="[
                'relative rounded-lg border transition-colors',
                uiStore.state.theme === 'dark'
                  ? 'border-gray-700 focus-within:border-blue-500'
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
                'relative rounded-lg border transition-colors',
                uiStore.state.theme === 'dark'
                  ? 'border-gray-700 focus-within:border-blue-500'
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
                'disabled:from-blue-500 disabled:to-indigo-500',
                'disabled:cursor-not-allowed',
                'shadow-lg shadow-blue-500/20',
                'flex items-center justify-center gap-2',
                'transition-all duration-200'
              ]"
            >
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
              <ArrowRight v-if="!isLoading" class="w-4 h-4" :stroke-width="2" />
            </button>
          </form>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div :class="[
                'w-full border-t',
                uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              ]"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span :class="[
                'px-2',
                uiStore.state.theme === 'dark'
                  ? 'bg-gray-800/80 text-gray-400'
                  : 'bg-white/80 text-gray-600'
              ]">
                Or continue with
              </span>
            </div>
          </div>

          <!-- Google Sign In Button -->
          <button
            type="button"
            :disabled="isLoading"
            :class="[
              'w-full h-12 rounded-lg border transition-all duration-200',
              'font-semibold flex items-center justify-center gap-3',
              'disabled:cursor-not-allowed',
              uiStore.state.theme === 'dark'
                ? 'border-gray-700 hover:border-gray-600 disabled:border-gray-700'
                : 'border-gray-300 hover:border-gray-400 disabled:border-gray-300',
              uiStore.state.theme === 'dark'
                ? 'text-white'
                : 'text-gray-700'
            ]"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Sign Up Link -->
          <div class="text-center pt-2">
            <p :class="[
              'text-sm',
              uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            ]">
              Don't have an account?
              <RouterLink
                :to="routePaths.authSignup"
                :class="[
                  'font-semibold hover:underline',
                  uiStore.state.theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                ]"
              >
                Sign up here
              </RouterLink>
            </p>
          </div>

          <!-- Features Section -->
          <div :class="[
            'space-y-3 pt-6 border-t',
            uiStore.state.theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
          ]">
            <h3 :class="[
              'text-xs font-semibold uppercase tracking-wider',
              uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
            ]">
              What You Get
            </h3>
            <ul :class="[
              'space-y-2 text-sm',
              uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            ]">
              <li class="flex items-start gap-3">
                <span :class="[
                  'mt-0.5 flex-shrink-0 font-bold',
                  uiStore.state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                ]">✓</span>
                <span>AI-powered task creation & prioritization</span>
              </li>
              <li class="flex items-start gap-3">
                <span :class="[
                  'mt-0.5 flex-shrink-0 font-bold',
                  uiStore.state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                ]">✓</span>
                <span>Real-time sync with Google Calendar</span>
              </li>
              <li class="flex items-start gap-3">
                <span :class="[
                  'mt-0.5 flex-shrink-0 font-bold',
                  uiStore.state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                ]">✓</span>
                <span>Smart command palette (Ctrl+K)</span>
              </li>
            </ul>
          </div>

          <!-- Footer Links -->
          <div :class="[
            'text-center text-xs space-y-2 pt-2',
            uiStore.state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          ]">
            <p>
              By signing in, you agree to our<br />
              <span :class="[
                'hover:underline cursor-pointer',
                uiStore.state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              ]">Terms of Service</span> and <span :class="[
                'hover:underline cursor-pointer',
                uiStore.state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              ]">Privacy Policy</span>
            </p>
            <p :class="[
              uiStore.state.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            ]">
              We never share your Google Calendar data with third parties
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
