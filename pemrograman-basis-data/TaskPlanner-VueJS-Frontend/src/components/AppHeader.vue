<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Sun, User, LogOut, Home, BarChart3, MessageCircle } from '@lucide/vue'
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
</script>

<template>
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink :to="routePaths.dashboard" class="flex items-center" aria-label="Go to dashboard">
          <div class="rounded-xl shadow-sm shadow-black/5 bg-white/20 backdrop-blur-sm p-0.5">
            <img src="/opt-logo/logo3.webp" alt="Smart Task Planner" class="h-11 w-auto rounded-xl" />
          </div>
        </RouterLink>

        <!-- Right Controls - Desktop Only (xl and above) -->
        <div class="hidden xl:flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            class="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <Sun class="w-5 h-5" :stroke-width="2" />
          </button>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button
              @click="uiStore.toggleProfileMenu()"
              class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-700"
              aria-label="Profile menu"
              title="Profile"
            >
              <User class="w-5 h-5" :stroke-width="2" />
              <span class="text-sm font-medium">{{ user?.name || 'User' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Profile Dropdown Menu -->
            <div
              v-if="uiStore.state.isProfileMenuOpen"
              class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User class="w-5 h-5 text-gray-600" :stroke-width="2" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm truncate text-gray-900">
                      {{ user?.name || 'Task Planner User' }}
                    </p>
                    <p class="text-xs truncate text-gray-600">
                      {{ user?.email || 'No email' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Navigation Links -->
              <div class="py-2 border-b border-gray-100">
                <button
                  @click="navigate(routePaths.dashboard)"
                  :class="[
                    'w-full px-4 py-2.5 text-left text-sm flex items-center gap-3',
                    route.path === routePaths.dashboard
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <Home class="w-4 h-4" :stroke-width="2" />
                  Dashboard
                </button>
                <button
                  @click="navigate(routePaths.overview)"
                  :class="[
                    'w-full px-4 py-2.5 text-left text-sm flex items-center gap-3',
                    route.path === routePaths.overview
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <BarChart3 class="w-4 h-4" :stroke-width="2" />
                  Overview
                </button>
                <button
                  @click="navigate(routePaths.connectWhatsapp)"
                  :class="[
                    'w-full px-4 py-2.5 text-left text-sm flex items-center gap-3',
                    route.path === routePaths.connectWhatsapp
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <MessageCircle class="w-4 h-4" :stroke-width="2" />
                  Connect WhatsApp
                </button>
              </div>

              <!-- Logout -->
              <div class="py-2">
                <button
                  @click="handleLogout"
                  class="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut class="w-4 h-4" :stroke-width="2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Bottom Tab Bar -->
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden" aria-label="Mobile navigation">
    <div class="flex items-center justify-around h-16">
      <!-- Dashboard -->
      <RouterLink
        :to="routePaths.dashboard"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          route.path === routePaths.dashboard
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600'
        ]"
      >
        <Home class="w-5 h-5" :stroke-width="2" />
        <span class="text-xs font-medium">Dashboard</span>
      </RouterLink>

      <!-- Overview -->
      <RouterLink
        :to="routePaths.overview"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          route.path === routePaths.overview
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600'
        ]"
      >
        <BarChart3 class="w-5 h-5" :stroke-width="2" />
        <span class="text-xs font-medium">Overview</span>
      </RouterLink>

      <!-- Profile -->
      <button
        @click="uiStore.toggleProfileMenu()"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
          uiStore.state.isProfileMenuOpen
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600'
        ]"
      >
        <User class="w-5 h-5" :stroke-width="2" />
        <span class="text-xs font-medium">Profile</span>
      </button>
    </div>
  </nav>

  <!-- Mobile Profile Modal -->
  <div
    v-if="uiStore.state.isProfileMenuOpen"
    class="fixed inset-0 z-40 lg:hidden"
    @click.self="uiStore.closeProfileMenu()"
  >
    <div class="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-auto">
      <!-- User Info -->
      <div class="px-4 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User class="w-6 h-6 text-gray-600" :stroke-width="2" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900">
              {{ user?.name || 'Task Planner User' }}
            </p>
            <p class="text-sm text-gray-600">
              {{ user?.email || 'No email' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="py-2">
        <button
          @click="navigate(routePaths.dashboard)"
          :class="[
            'w-full px-4 py-3 text-left text-sm flex items-center gap-3',
            route.path === routePaths.dashboard
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700'
          ]"
        >
          <Home class="w-5 h-5" :stroke-width="2" />
          Dashboard
        </button>
        <button
          @click="navigate(routePaths.overview)"
          :class="[
            'w-full px-4 py-3 text-left text-sm flex items-center gap-3',
            route.path === routePaths.overview
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700'
          ]"
        >
          <BarChart3 class="w-5 h-5" :stroke-width="2" />
          Overview
        </button>
        <button
          @click="navigate(routePaths.connectWhatsapp)"
          :class="[
            'w-full px-4 py-3 text-left text-sm flex items-center gap-3',
            route.path === routePaths.connectWhatsapp
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700'
          ]"
        >
          <MessageCircle class="w-5 h-5" :stroke-width="2" />
          Connect WhatsApp
        </button>
      </div>

      <!-- Logout -->
      <div class="py-2 border-t border-gray-100">
        <button
          @click="handleLogout"
          class="w-full px-4 py-3 text-left text-sm flex items-center gap-3 text-red-600"
        >
          <LogOut class="w-5 h-5" :stroke-width="2" />
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
