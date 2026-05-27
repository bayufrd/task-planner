<script setup lang="ts">
import type { PlannerItem } from '../types'
import { formatDateTime } from '../utils/format'

defineProps<{ items: PlannerItem[] }>()
</script>

<template>
  <section class="panel">
    <div class="section-header">
      <div>
        <h2>Today planner</h2>
        <p>Generated from [`GET /api/planner/today`](../Pemrograman%20Basis%20Data/TaskPlanner-Java-Backend/docs/API_ENDPOINTS.md).</p>
      </div>
    </div>
    <div class="planner-list">
      <article v-for="item in items" :key="item.task.id" class="planner-card">
        <div>
          <h3>{{ item.task.title }}</h3>
          <p>{{ item.task.description || 'No description' }}</p>
        </div>
        <div class="planner-meta">
          <span class="badge">Score {{ item.priorityScore }}</span>
          <span class="badge">{{ item.priority }}</span>
          <span>{{ formatDateTime(item.deadline) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
