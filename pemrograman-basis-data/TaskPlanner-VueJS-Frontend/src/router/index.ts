import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import RemindersPage from '../views/RemindersPage.vue'
import AiAssistantPage from '../views/AiAssistantPage.vue'
import OverviewPage from '../views/OverviewPage.vue'
import { authStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingPage },
    { path: '/login', name: 'login', component: LoginPage, meta: { layout: 'auth', guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { layout: 'auth', guestOnly: true } },
    { path: '/dashboard', name: 'dashboard', component: DashboardPage, meta: { requiresAuth: true } },
    { path: '/overview', name: 'overview', component: OverviewPage, meta: { requiresAuth: true } },
    { path: '/reminders', name: 'reminders', component: RemindersPage, meta: { requiresAuth: true } },
    { path: '/ai-assistant', name: 'ai-assistant', component: AiAssistantPage, meta: { requiresAuth: true } },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  if (authStore.state.token && !authStore.state.user) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logoutLocal()
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated.value) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated.value) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
