<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { BellRing, Brain, ChevronDown, Globe, LayoutDashboard, LogOut, MessageCircle, Moon, PieChart, Search, Sun, User } from '@lucide/vue'
import { authStore } from '../stores/auth'
import { canonicalRouteNames, deferredRouteNames, protectedNavigationRoutes, routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const user = computed(() => authStore.state.user)

const primaryLinks = [
  { name: canonicalRouteNames.dashboard, path: routePaths.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { name: canonicalRouteNames.overview, path: routePaths.overview, label: 'Overview', icon: PieChart },
]

const deferredLinks = [
  { name: deferredRouteNames.reminders, path: routePaths.reminders, label: 'Reminders', icon: BellRing },
  { name: deferredRouteNames.aiAssistant, path: routePaths.aiAssistant, label: 'AI Helper', icon: Brain },
]

const isPrimaryRoute = computed(() => protectedNavigationRoutes.includes(route.name as (typeof protectedNavigationRoutes)[number]))

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
  <header class="topbar topbar-next-protected topbar-shell-parity">
    <RouterLink class="brand brand-next" :to="routePaths.dashboard">
      <div class="brand-next-logo-wrap">
        <img src="/opt-logo/logo3.png" alt="Task Planner" class="brand-next-logo" />
      </div>
    </RouterLink>

    <nav class="nav-links nav-links-next nav-links-shell-parity">
      <RouterLink
        v-for="link in primaryLinks"
        :key="link.path"
        :class="['nav-link', 'nav-link-next', { active: route.path === link.path } ]"
        :to="link.path"
      >
        <component :is="link.icon" :size="16" /> {{ link.label }}
      </RouterLink>
      <span v-if="!isPrimaryRoute" class="deferred-route-badge">Deferred route active</span>
    </nav>

    <div class="nav-user nav-user-next nav-user-shell-parity">
      <button class="command-trigger" type="button" @click="uiStore.openCommandPalette()">
        <Search :size="16" />
        <span>Command</span>
        <kbd>⌘K</kbd>
      </button>
      <div class="language-toggle-shell">
        <button :class="['language-toggle-chip', { active: uiStore.state.language === 'id' } ]" type="button" @click="uiStore.setLanguage('id')">ID</button>
        <button :class="['language-toggle-chip', { active: uiStore.state.language === 'en' } ]" type="button" @click="uiStore.setLanguage('en')">EN</button>
      </div>
      <button class="icon-shell-button" type="button" @click="uiStore.toggleTheme()">
        <Moon v-if="uiStore.state.theme === 'light'" :size="18" />
        <Sun v-else :size="18" />
      </button>
      <button class="profile-trigger" type="button" @click="uiStore.toggleProfileMenu()">
        <span class="profile-trigger-avatar">
          <User :size="16" />
        </span>
        <span class="profile-trigger-copy">
          <small>Signed in as</small>
          <strong>{{ user?.name || 'Task Planner User' }}</strong>
        </span>
        <ChevronDown :size="16" :class="{ open: uiStore.state.isProfileMenuOpen }" />
      </button>
    </div>
  </header>

  <div v-if="uiStore.state.isProfileMenuOpen" class="profile-menu-backdrop" @click.self="uiStore.closeProfileMenu()">
    <section class="profile-menu-panel">
      <div class="profile-menu-user">
        <div class="profile-trigger-avatar large">
          <User :size="18" />
        </div>
        <div>
          <strong>{{ user?.name || 'Task Planner User' }}</strong>
          <small>{{ user?.email || 'No email available' }}</small>
        </div>
      </div>

      <div class="profile-menu-group">
        <button class="profile-menu-item" type="button" @click="navigate(routePaths.dashboard)">
          <LayoutDashboard :size="16" /> Dashboard
        </button>
        <button class="profile-menu-item" type="button" @click="navigate(routePaths.overview)">
          <PieChart :size="16" /> Overview
        </button>
        <button class="profile-menu-item profile-menu-item-whatsapp" type="button" @click="navigate(routePaths.connectWhatsapp)">
          <MessageCircle :size="16" /> Connect WhatsApp
        </button>
      </div>

      <div class="profile-menu-group muted">
        <button class="profile-menu-item" type="button" @click="uiStore.toggleLanguage()">
          <Globe :size="16" /> Language ({{ uiStore.state.language.toUpperCase() }})
        </button>
        <button class="profile-menu-item" type="button" @click="uiStore.toggleTheme()">
          <Moon v-if="uiStore.state.theme === 'light'" :size="16" />
          <Sun v-else :size="16" />
          {{ uiStore.state.theme === 'light' ? 'Dark mode' : 'Light mode' }}
        </button>
      </div>

      <div class="profile-menu-group deferred">
        <button v-for="link in deferredLinks" :key="link.path" class="profile-menu-item" type="button" @click="navigate(link.path)">
          <component :is="link.icon" :size="16" /> {{ link.label }}
        </button>
      </div>

      <button class="profile-menu-item logout" type="button" @click="handleLogout">
        <LogOut :size="16" /> Logout
      </button>
    </section>
  </div>

  <nav class="mobile-tabbar mobile-tabbar-protected" aria-label="Mobile navigation">
    <RouterLink :class="['mobile-tab', { active: route.path === routePaths.dashboard } ]" :to="routePaths.dashboard">
      <LayoutDashboard :size="18" />
      <span>Dashboard</span>
    </RouterLink>
    <button class="mobile-tab" type="button" @click="uiStore.openCommandPalette()">
      <Search :size="18" />
      <span>Command</span>
    </button>
    <RouterLink :class="['mobile-tab', { active: route.path === routePaths.overview } ]" :to="routePaths.overview">
      <PieChart :size="18" />
      <span>Overview</span>
    </RouterLink>
    <button class="mobile-tab" type="button" @click="uiStore.toggleProfileMenu()">
      <User :size="18" />
      <span>Profile</span>
    </button>
  </nav>
</template>
