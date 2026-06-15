<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Search, X } from '@lucide/vue'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const router = useRouter()

const quickActions = [
  { label: 'Go to Dashboard', path: routePaths.dashboard },
  { label: 'Go to Overview', path: routePaths.overview },
  { label: 'Connect WhatsApp', path: routePaths.connectWhatsapp },
]

async function go(path: string) {
  uiStore.closeCommandPalette()
  await router.push(path)
}
</script>

<template>
  <div v-if="uiStore.state.isCommandPaletteOpen" class="command-palette-backdrop" @click.self="uiStore.closeCommandPalette()">
    <section class="command-palette-panel">
      <div class="command-palette-header">
        <div class="command-palette-search">
          <Search :size="18" />
          <input type="text" placeholder="Command palette parity placeholder" readonly />
        </div>
        <button class="ghost-button command-palette-close" type="button" @click="uiStore.closeCommandPalette()">
          <X :size="16" /> Close
        </button>
      </div>
      <div class="command-palette-list">
        <button v-for="action in quickActions" :key="action.path" class="command-palette-item" type="button" @click="go(action.path)">
          <span>{{ action.label }}</span>
          <code>{{ action.path }}</code>
        </button>
      </div>
    </section>
  </div>
</template>
