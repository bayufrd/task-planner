<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isAuthPage = computed(() => route.meta.layout === 'auth')
</script>

<template>
  <div :class="['app-shell', { 'auth-shell': isAuthPage }]">
    <RouterView />
  </div>
</template>
