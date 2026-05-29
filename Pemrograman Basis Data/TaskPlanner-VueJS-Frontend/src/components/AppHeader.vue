<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import { Brain, LayoutDashboard, LogOut, BellRing } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const user = computed(() => authStore.state.user)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" to="/dashboard">Task Planner</RouterLink>
    <nav class="nav-links">
      <RouterLink :class="['nav-link', { active: route.path === '/dashboard' }]" to="/dashboard">
        <LayoutDashboard :size="16" /> Dashboard
      </RouterLink>
      <RouterLink :class="['nav-link', { active: route.path === '/reminders' }]" to="/reminders">
        <BellRing :size="16" /> Reminders
      </RouterLink>
      <RouterLink :class="['nav-link', { active: route.path === '/ai-assistant' }]" to="/ai-assistant">
        <Brain :size="16" /> AI Helper
      </RouterLink>
    </nav>
    <div class="nav-user">
      <span v-if="user">{{ user.name }}</span>
      <button class="ghost-button" @click="handleLogout">
        <LogOut :size="16" /> Logout
      </button>
    </div>
  </header>

  <nav class="mobile-tabbar" aria-label="Mobile navigation">
    <RouterLink :class="['mobile-tab', { active: route.path === '/dashboard' }]" to="/dashboard">
      <LayoutDashboard :size="18" />
      <span>Dashboard</span>
    </RouterLink>
    <RouterLink :class="['mobile-tab', { active: route.path === '/reminders' }]" to="/reminders">
      <BellRing :size="18" />
      <span>Reminders</span>
    </RouterLink>
    <RouterLink :class="['mobile-tab', { active: route.path === '/ai-assistant' }]" to="/ai-assistant">
      <Brain :size="18" />
      <span>AI Helper</span>
    </RouterLink>
    <button class="mobile-tab mobile-tab-logout" @click="handleLogout">
      <LogOut :size="18" />
      <span>Logout</span>
    </button>
  </nav>
</template>
