import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RemindersPage from '../views/RemindersPage.vue'
import AssistantPage from '../views/AssistantPage.vue'
import OverviewPage from '../views/OverviewPage.vue'
import ConnectWhatsappPage from '../views/ConnectWhatsappPage.vue'
import AuthCallbackPage from '../views/AuthCallbackPage.vue'
import { authStore } from '../stores/auth'
import { canonicalRouteNames, deferredRouteNames, routeMeta, routePaths } from './registry'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: routePaths.landing, name: canonicalRouteNames.landing, component: LandingPage, meta: routeMeta.public },
    { path: routePaths.authSignin, name: canonicalRouteNames.authSignin, component: LoginPage, meta: routeMeta.auth },
    { path: routePaths.loginAlias, redirect: { name: canonicalRouteNames.authSignin } },
    { path: routePaths.authSignup, name: canonicalRouteNames.authSignup, component: LoginPage, meta: routeMeta.auth },
    { path: routePaths.registerAlias, redirect: { name: canonicalRouteNames.authSignup } },
    {
      path: routePaths.authCallback,
      name: canonicalRouteNames.authCallback,
      component: AuthCallbackPage,
      meta: { ...routeMeta.auth, callbackBridge: true },
    },
    { path: routePaths.dashboard, name: canonicalRouteNames.dashboard, component: DashboardPage, meta: routeMeta.protected },
    { path: routePaths.overview, name: canonicalRouteNames.overview, component: OverviewPage, meta: routeMeta.protected },
    {
      path: routePaths.connectWhatsapp,
      name: canonicalRouteNames.connectWhatsapp,
      component: ConnectWhatsappPage,
      meta: routeMeta.protected,
    },
    {
      path: routePaths.reminders,
      name: deferredRouteNames.reminders,
      component: RemindersPage,
      meta: routeMeta.deferred,
    },
    {
      path: routePaths.assistant,
      name: deferredRouteNames.assistant,
      component: AssistantPage,
      meta: routeMeta.deferred,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  // Restore user session if token exists but user not loaded
  if (authStore.state.token && !authStore.state.user) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logoutLocal()
    }
  }

  const isAuthenticated = authStore.isAuthenticated.value

  // Debug logging
  console.log('[Router Guard]', {
    to: to.name,
    path: to.path,
    isAuthenticated,
    hasToken: Boolean(authStore.state.token),
    meta: to.meta,
  })

  // Protect authenticated routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('[Router Guard] Redirecting to signin (protected route)')
    return {
      name: canonicalRouteNames.authSignin,
      query: { callbackUrl: to.fullPath },
    }
  }

  // Redirect authenticated users from guest-only pages
  if (to.meta.guestOnly && isAuthenticated) {
    console.log('[Router Guard] Redirecting to dashboard (guest-only page)')
    return { name: canonicalRouteNames.dashboard }
  }

  // Redirect authenticated users from landing page to dashboard
  if (to.name === canonicalRouteNames.landing && isAuthenticated) {
    console.log('[Router Guard] Redirecting authenticated user from landing to dashboard')
    return { name: canonicalRouteNames.dashboard }
  }

  console.log('[Router Guard] Allowing navigation')
  return true
})

export default router
