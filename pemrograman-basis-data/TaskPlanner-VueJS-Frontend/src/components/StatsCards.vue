<script setup lang="ts">
import { computed } from 'vue'
import type { TaskStats } from '../types'

const props = defineProps<{ stats: TaskStats | null }>()

const summaryCards = computed(() => [
  {
    label: 'Pending',
    value: (props.stats?.todo ?? 0) + (props.stats?.inProgress ?? 0),
  },
  {
    label: 'Done',
    value: props.stats?.done ?? 0,
  },
  {
    label: 'Skipped',
    value: props.stats?.skipped ?? 0,
  },
])
</script>

<template>
  <section class="stats-grid">
    <article v-for="card in summaryCards" :key="card.label" class="stat-card">
      <span class="stat-label">{{ card.label }}</span>
      <strong class="stat-value">{{ card.value }}</strong>
    </article>
  </section>
</template>
