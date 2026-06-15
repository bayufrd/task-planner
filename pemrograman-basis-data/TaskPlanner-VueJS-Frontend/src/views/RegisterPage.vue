<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRight, Mail, Lock, User, Sun, Moon } from '@lucide/vue'
import { authStore } from '../stores/auth'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const router = useRouter()
const form = reactive({ name: '', email: '', password: '' })
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await authStore.register(form)
    await router.push({ name: 'auth-signin', query: { registered: 'true' } })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
  }
}
</script>

<template>
  <div :class="['min-h-screen w-full flex flex-col transition-colors', uiStore.state.theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50']">
    <nav :class="['border-b transition-colors', uiStore.state.theme === 'dark' ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50' : 'border-gray-200/50 backdrop-blur-sm bg-white/50']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <RouterLink :to="routePaths.landing" class="flex items-center">
          <div class="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
            <img src="/opt-logo/logo3.webp" alt="TaskPlanner Logo" class="h-10 w-auto rounded-xl" />
          </div>
        </RouterLink>
        <button @click="uiStore.toggleTheme()" class="p-2 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <Sun v-if="uiStore.state.theme === 'dark'" class="w-5 h-5 text-yellow-500" :stroke-width="2" />
          <Moon v-else class="w-5 h-5 text-indigo-500" :stroke-width="2" />
        </button>
      </div>
    </nav>

    <div class="flex-1 flex items-center justify-center px-4 py-12 relative">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div :class="['absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl', uiStore.state.theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-300/20']"></div>
        <div :class="['absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl', uiStore.state.theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-300/20']"></div>
      </div>

      <div class="w-full max-w-md relative z-10">
        <div :class="['rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/30 border transition-colors p-8 space-y-8', uiStore.state.theme === 'dark' ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50']">
          <div class="space-y-5 text-center">
            <div class="flex justify-center">
              <div class="rounded-xl p-1 shadow-md shadow-black/10 dark:shadow-black/30 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                <img src="/opt-logo/logo1.webp" alt="TaskPlanner Logo" class="w-28 h-auto rounded-lg" />
              </div>
            </div>
            <div class="space-y-2">
              <h1 :class="['text-3xl font-bold', uiStore.state.theme === 'dark' ? 'text-white' : 'text-gray-900']">Join TaskPlanner</h1>
              <p :class="['text-sm', uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Create your account to start planning smarter</p>
            </div>
          </div>

          <form @submit.prevent="submit" class="space-y-4">
            <div class="space-y-2">
              <label :class="['text-sm font-medium', uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">Full Name</label>
              <div class="relative rounded-lg border border-gray-300 dark:border-gray-700">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User class="w-5 h-5 text-gray-400" />
                </div>
                <input v-model="form.name" type="text" required class="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your full name" />
              </div>
            </div>

            <div class="space-y-2">
              <label :class="['text-sm font-medium', uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">Email Address</label>
              <div class="relative rounded-lg border border-gray-300 dark:border-gray-700">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail class="w-5 h-5 text-gray-400" />
                </div>
                <input v-model="form.email" type="email" required class="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
              </div>
            </div>

            <div class="space-y-2">
              <label :class="['text-sm font-medium', uiStore.state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">Password</label>
              <div class="relative rounded-lg border border-gray-300 dark:border-gray-700">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock class="w-5 h-5 text-gray-400" />
                </div>
                <input v-model="form.password" type="password" required class="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Minimum 6 characters" />
              </div>
            </div>

            <button type="submit" :disabled="authStore.state.loading" class="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20">
              {{ authStore.state.loading ? 'Creating account...' : 'Create Account' }}
              <ArrowRight v-if="!authStore.state.loading" class="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
