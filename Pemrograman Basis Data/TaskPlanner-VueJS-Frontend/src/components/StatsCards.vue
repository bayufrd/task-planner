<script setup lang="ts">
import type { TaskStats } from '../types'

defineProps<{ stats: TaskStats | null }>()
</script>

<template>
  <section class="stats-grid">
    <article class="stat-card">
      <span class="stat-label">To do</span>
      <strong class="stat-value">{{ stats?.todo ?? 0 }}</strong>
    </article>
    <article class="stat-card">
      <span class="stat-label">In progress</span>
      <strong class="stat-value">{{ stats?.inProgress ?? 0 }}</strong>
    </article>
    <article class="stat-card">
      <span class="stat-label">Done</span>
      <strong class="stat-value">{{ stats?.done ?? 0 }}</strong>
    </article>
    <article class="stat-card">
      <span class="stat-label">Skipped</span>
      <strong class="stat-value">{{ stats?.skipped ?? 0 }}</strong>
    </article>
  </section>
</template>
