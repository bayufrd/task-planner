<script setup lang="ts">
import type { PlannerItem } from '../types'
import { formatDateTime } from '../utils/format'

defineProps<{ items: PlannerItem[] }>()
</script>

<template>
  <section class="panel planner-panel-simple">
    <div class="section-header dashboard-section-header-simple">
      <div>
        <span class="chart-kicker">Today</span>
        <h2>Today planner</h2>
        <p>Priority suggestions for what to pick up next.</p>
      </div>
    </div>
    <div class="planner-list planner-list-simple">
      <article v-for="item in items" :key="item.task.id" class="planner-card planner-card-simple">
        <div class="planner-card-copy">
          <h3>{{ item.task.title }}</h3>
          <p>{{ item.task.description || 'No description' }}</p>
        </div>
        <div class="planner-meta planner-meta-simple">
          <span class="badge">Score {{ item.priorityScore }}</span>
          <span class="badge">{{ item.priority }}</span>
          <span class="task-item-time">{{ formatDateTime(item.deadline) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
