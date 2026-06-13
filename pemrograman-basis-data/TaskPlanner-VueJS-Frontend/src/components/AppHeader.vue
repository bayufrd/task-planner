<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import { Brain, LayoutDashboard, LogOut, BellRing, BarChart3 } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const user = computed(() => authStore.state.user)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="topbar topbar-next-protected">
    <RouterLink class="brand brand-next" to="/dashboard">
      <div class="brand-next-logo-wrap">
        <img src="/opt-logo/logo3.png" alt="Task Planner" class="brand-next-logo" />
      </div>
    </RouterLink>

    <nav class="nav-links nav-links-next">
      <RouterLink :class="['nav-link', 'nav-link-next', { active: route.path === '/dashboard' } ]" to="/dashboard">
        <LayoutDashboard :size="16" /> Dashboard
      </RouterLink>
      <RouterLink :class="['nav-link', 'nav-link-next', { active: route.path === '/overview' } ]" to="/overview">
        <BarChart3 :size="16" /> Overview
      </RouterLink>
      <RouterLink :class="['nav-link', 'nav-link-next', { active: route.path === '/reminders' } ]" to="/reminders">
        <BellRing :size="16" /> Reminders
      </RouterLink>
      <RouterLink :class="['nav-link', 'nav-link-next', { active: route.path === '/ai-assistant' } ]" to="/ai-assistant">
        <Brain :size="16" /> AI Helper
      </RouterLink>
    </nav>

    <div class="nav-user nav-user-next">
      <div v-if="user" class="nav-user-pill">
        <span class="nav-user-label">Signed in as</span>
        <strong>{{ user.name }}</strong>
      </div>
      <button class="ghost-button ghost-button-next" @click="handleLogout">
        <LogOut :size="16" /> Logout
      </button>
    </div>
  </header>

  <nav class="mobile-tabbar" aria-label="Mobile navigation">
    <RouterLink :class="['mobile-tab', { active: route.path === '/dashboard' } ]" to="/dashboard">
      <LayoutDashboard :size="18" />
      <span>Dashboard</span>
    </RouterLink>
    <RouterLink :class="['mobile-tab', { active: route.path === '/overview' } ]" to="/overview">
      <BarChart3 :size="18" />
      <span>Overview</span>
    </RouterLink>
    <RouterLink :class="['mobile-tab', { active: route.path === '/reminders' } ]" to="/reminders">
      <BellRing :size="18" />
      <span>Reminders</span>
    </RouterLink>
    <RouterLink :class="['mobile-tab', { active: route.path === '/ai-assistant' } ]" to="/ai-assistant">
      <Brain :size="18" />
      <span>AI Helper</span>
    </RouterLink>
    <button class="mobile-tab mobile-tab-logout" @click="handleLogout">
      <LogOut :size="18" />
      <span>Logout</span>
    </button>
  </nav>
</template>
