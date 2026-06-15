<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Search, Moon, Sun, User, ChevronDown, LogOut } from '@lucide/vue'
import { authStore } from '../stores/auth'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const user = computed(() => authStore.state.user)

async function handleLogout() {
  await authStore.logout()
  uiStore.closeProfileMenu()
  uiStore.closeCommandPalette()
  await router.push(routePaths.authSignin)
}

async function navigate(path: string) {
  uiStore.closeProfileMenu()
  await router.push(path)
}

function toggleLanguage() {
  const next = uiStore.state.language === 'id' ? 'en' : 'id'
  uiStore.setLanguage(next as 'id' | 'en')
}
</script>

<template>
  <!-- Header -->
  <header :class="[
    'sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b',
    uiStore.state.theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink :to="routePaths.dashboard" class="flex items-center" aria-label="Go to dashboard">
          <div :class="[
            'rounded-xl shadow-sm p-0.5',
            'shadow-black/5 dark:shadow-black/10',
            'bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm'
          ]">
            <img src="/opt-logo/logo3.webp" alt="Smart Task Planner" class="h-11 w-auto rounded-xl" />
          </div>
        </RouterLink>

        <!-- Right Controls -->
        <div class="flex items-center gap-1">
          <!-- Command Palette Button (hidden on mobile) -->
          <button
            @click="uiStore.openCommandPalette()"
            :class="[
              'hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl',
              'transition-all duration-200 group',
              'text-sm font-medium',
              uiStore.state.theme === 'dark'
                ? 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300'
                : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
            ]"
            aria-label="Open command palette"
            title="Open command palette (Ctrl+K)"
          >
            <Search class="w-4 h-4 group-hover:scale-110 transition-transform" :stroke-width="2" />
            <span class="hidden md:inline">Command</span>
            <kbd :class="[
              'hidden lg:inline px-2 py-0.5 rounded text-xs font-semibold ml-1',
              uiStore.state.theme === 'dark'
                ? 'bg-gray-700/60 text-gray-400'
                : 'bg-gray-200/60 text-gray-600'
            ]">⌘K</kbd>
          </button>

          <!-- Language Toggle (hidden on mobile) -->
          <div :class="[
            'hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg border',
            uiStore.state.theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-gray-100/80 border-gray-200/50'
          ]">
            <button
              @click="toggleLanguage"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5',
                uiStore.state.language === 'id'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : uiStore.state.theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-700'
              ]"
              aria-label="Indonesia"
              title="Bahasa Indonesia"
            >
              <span>ID</span>
            </button>
            <button
              @click="toggleLanguage"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5',
                uiStore.state.language === 'en'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : uiStore.state.theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-700'
              ]"
              aria-label="English"
              title="English"
            >
              <span>EN</span>
            </button>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="uiStore.toggleTheme()"
            :class="[
              'p-2 rounded-lg transition-all duration-200',
              uiStore.state.theme === 'dark'
                ? 'hover:bg-gray-800/80 text-gray-300'
                : 'hover:bg-gray-100/80 text-gray-700'
            ]"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <Moon v-if="uiStore.state.theme === 'light'" class="w-5 h-5" :stroke-width="2" />
            <Sun v-else class="w-5 h-5" :stroke-width="2" />
          </button>

          <!-- Profile Button (desktop only) -->
          <button
            v-if="uiStore.state.isProfileMenuOpen"
            @click="uiStore.toggleProfileMenu()"
            :class="[
              'hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200',
              'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            ]"
            aria-label="Profile menu"
            title="Profile"
          >
            <User class="w-5 h-5" :stroke-width="2" />
            <ChevronDown class="w-4 h-4 rotate-180 transition-transform duration-200" :stroke-width="2" />
          </button>
          <button
            v-else
            @click="uiStore.toggleProfileMenu()"
            :class="[
              'hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200',
              uiStore.state.theme === 'dark'
                ? 'hover:bg-gray-800/80 text-gray-300'
                : 'hover:bg-gray-100/80 text-gray-700'
            ]"
            aria-label="Profile menu"
            title="Profile"
          >
            <User class="w-5 h-5" :stroke-width="2" />
            <ChevronDown class="w-4 h-4 transition-transform duration-200" :stroke-width="2" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Profile Menu Dropdown -->
  <div
    v-if="uiStore.state.isProfileMenuOpen"
    @click.self="uiStore.closeProfileMenu()"
    :class="[
      'fixed inset-0 z-40 backdrop-blur-sm',
      uiStore.state.theme === 'dark' ? 'bg-black/10' : 'bg-white/10'
    ]"
  >
    <div
      :class="[
        'absolute top-20 right-4 w-64 rounded-2xl shadow-2xl overflow-hidden',
        'border transition-colors',
        uiStore.state.theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200/50'
      ]"
    >
      <!-- User Info Section -->
      <div :class="[
        'px-4 py-3 border-b',
        uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      ]">
        <div class="flex items-center gap-3">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            uiStore.state.theme === 'dark'
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          ]">
            <User class="w-5 h-5" :stroke-width="2" />
          </div>
          <div class="flex-1 min-w-0">
            <p :class="['font-semibold text-sm truncate', uiStore.state.theme === 'dark' ? 'text-white' : 'text-gray-900']">
              {{ user?.name || 'Task Planner User' }}
            </p>
            <p :class="['text-xs truncate', uiStore.state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
              {{ user?.email || 'No email' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div :class="[
        'py-2 border-b',
        uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      ]">
        <button
          @click="navigate(routePaths.dashboard)"
          :class="[
            'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3',
            route.path === routePaths.dashboard
              ? uiStore.state.theme === 'dark'
                ? 'bg-gray-700/50 text-blue-400'
                : 'bg-blue-50 text-blue-700'
              : uiStore.state.theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
          </svg>
          Dashboard
        </button>
        <button
          @click="navigate(routePaths.overview)"
          :class="[
            'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3',
            route.path === routePaths.overview
              ? uiStore.state.theme === 'dark'
                ? 'bg-gray-700/50 text-blue-400'
                : 'bg-blue-50 text-blue-700'
              : uiStore.state.theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Overview
        </button>
        <button
          @click="navigate(routePaths.connectWhatsapp)"
          :class="[
            'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3',
            route.path === routePaths.connectWhatsapp
              ? uiStore.state.theme === 'dark'
                ? 'bg-gray-700/50 text-blue-400'
                : 'bg-blue-50 text-blue-700'
              : uiStore.state.theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Connect WhatsApp
        </button>
      </div>

      <!-- Settings -->
      <div :class="[
        'py-2 border-b',
        uiStore.state.theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      ]">
        <button
          @click="toggleLanguage"
          :class="[
            'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3',
            uiStore.state.theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400'
              : 'hover:bg-gray-50 text-gray-600'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H4a2 2 0 01-2-2v-5a2 2 0 012-2h6.486a2 2 0 012 2v5a2 2 0 01-2 2z" />
          </svg>
          Language ({{ uiStore.state.language.toUpperCase() }})
        </button>
        <button
          @click="uiStore.toggleTheme()"
          :class="[
            'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3',
            uiStore.state.theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400'
              : 'hover:bg-gray-50 text-gray-600'
          ]"
        >
          <Moon v-if="uiStore.state.theme === 'light'" class="w-4 h-4" :stroke-width="2" />
          <Sun v-else class="w-4 h-4" :stroke-width="2" />
          {{ uiStore.state.theme === 'light' ? 'Dark mode' : 'Light mode' }}
        </button>
      </div>

      <!-- Logout -->
      <div class="py-2">
        <button
          @click="handleLogout"
          :class="[
            'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3',
            uiStore.state.theme === 'dark'
              ? 'hover:bg-red-900/20 text-red-400'
              : 'hover:bg-red-50 text-red-600'
          ]"
        >
          <LogOut class="w-4 h-4" :stroke-width="2" />
          Logout
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Tab Bar -->
  <nav :class="[
    'fixed bottom-0 left-0 right-0 z-40 border-t md:hidden',
    uiStore.state.theme === 'dark'
      ? 'bg-gray-900/95 border-gray-800'
      : 'bg-white/95 border-gray-200/50'
  ]" aria-label="Mobile navigation">
    <div class="flex items-center justify-around h-16 max-w-md mx-auto w-full">
      <!-- Dashboard -->
      <RouterLink
        :to="routePaths.dashboard"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          route.path === routePaths.dashboard
            ? uiStore.state.theme === 'dark'
              ? 'bg-gray-800 text-blue-400'
              : 'bg-blue-50 text-blue-700'
            : uiStore.state.theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
        </svg>
        <span class="text-xs font-medium">Dashboard</span>
      </RouterLink>

      <!-- Command -->
      <button
        @click="uiStore.openCommandPalette()"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          uiStore.state.theme === 'dark'
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <Search class="w-5 h-5" :stroke-width="2" />
        <span class="text-xs font-medium">Command</span>
      </button>

      <!-- Overview -->
      <RouterLink
        :to="routePaths.overview"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          route.path === routePaths.overview
            ? uiStore.state.theme === 'dark'
              ? 'bg-gray-800 text-blue-400'
              : 'bg-blue-50 text-blue-700'
            : uiStore.state.theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="text-xs font-medium">Overview</span>
      </RouterLink>

      <!-- Profile -->
      <button
        @click="uiStore.toggleProfileMenu()"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          uiStore.state.isProfileMenuOpen
            ? uiStore.state.theme === 'dark'
              ? 'bg-gray-800 text-blue-400'
              : 'bg-blue-50 text-blue-700'
            : uiStore.state.theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <User class="w-5 h-5" :stroke-width="2" />
        <span class="text-xs font-medium">Profile</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Add safe area padding for mobile notch support */
@supports (padding: max(0px)) {
  nav[aria-label="Mobile navigation"] {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}
</style>
