<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import CommandPalette from '../components/CommandPalette.vue'
import { uiStore } from '../stores/ui'

function handleKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    uiStore.toggleCommandPalette()
  }

  if (event.key === 'Escape') {
    uiStore.closeCommandPalette()
    uiStore.closeProfileMenu()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="app-layout app-layout-protected app-layout-protected-shell">
    <AppHeader />
    <div class="protected-layout-content">
      <RouterView />
    </div>
    <CommandPalette />
  </div>
</template>
