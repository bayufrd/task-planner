<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import ProtectedLayout from './layouts/ProtectedLayout.vue'
import PublicLayout from './layouts/PublicLayout.vue'
import { uiStore } from './stores/ui'

const route = useRoute()

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case 'auth':
      return AuthLayout
    case 'protected':
      return ProtectedLayout
    default:
      return PublicLayout
  }
})
</script>

<template>
  <div
    :class="['app-shell', `theme-${uiStore.state.theme}`, `lang-${uiStore.state.language}`]"
    :data-theme="uiStore.state.theme"
    :data-language="uiStore.state.language"
  >
    <component :is="layoutComponent" />
  </div>
</template>
