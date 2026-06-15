import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import RemindersPage from '../views/RemindersPage.vue'
import AiAssistantPage from '../views/AiAssistantPage.vue'
import OverviewPage from '../views/OverviewPage.vue'
import { authStore } from '../stores/auth'
import { canonicalRouteNames, deferredRouteNames, routeMeta, routePaths } from './registry'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: routePaths.landing, name: canonicalRouteNames.landing, component: LandingPage, meta: routeMeta.public },
    { path: routePaths.authSignin, name: canonicalRouteNames.authSignin, component: LoginPage, meta: routeMeta.auth },
    { path: routePaths.loginAlias, redirect: { name: canonicalRouteNames.authSignin } },
    { path: routePaths.authSignup, name: canonicalRouteNames.authSignup, component: RegisterPage, meta: routeMeta.auth },
    { path: routePaths.registerAlias, redirect: { name: canonicalRouteNames.authSignup } },
    {
      path: routePaths.authCallback,
      name: canonicalRouteNames.authCallback,
      component: LoginPage,
      meta: { ...routeMeta.auth, callbackBridge: true },
    },
    { path: routePaths.dashboard, name: canonicalRouteNames.dashboard, component: DashboardPage, meta: routeMeta.protected },
    { path: routePaths.overview, name: canonicalRouteNames.overview, component: OverviewPage, meta: routeMeta.protected },
    {
      path: routePaths.reminders,
      name: deferredRouteNames.reminders,
      component: RemindersPage,
      meta: routeMeta.deferred,
    },
    {
      path: routePaths.aiAssistant,
      name: deferredRouteNames.aiAssistant,
      component: AiAssistantPage,
      meta: routeMeta.deferred,
    },
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
    return {
      name: canonicalRouteNames.authSignin,
      query: { callbackUrl: to.fullPath },
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated.value) {
    return { name: canonicalRouteNames.dashboard }
  }

  return true
})

export default router
