<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="app-layout app-layout-protected app-layout-protected-shell">
    <AppHeader />
    <div class="protected-layout-content">
      <RouterView />
    </div>
  </div>
</template>
