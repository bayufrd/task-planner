<script setup lang="ts">
import type { Task } from '../types'
import { formatDateTime } from '../utils/format'

defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{
  edit: [task: Task]
  complete: [id: string]
  skip: [id: string]
  remove: [id: string]
}>()

function formatStatus(status: Task['status']) {
  return status === 'DONE' ? 'Done' : status === 'SKIPPED' ? 'Skipped' : 'Pending'
}
</script>

<template>
  <section class="panel task-list-panel">
    <div class="section-header dashboard-section-header-simple">
      <div>
        <span class="chart-kicker">Tasks</span>
        <h2>Task list</h2>
        <p>Manage active work in a simpler, app-style list.</p>
      </div>
    </div>
    <div class="task-list-stack">
      <article v-for="task in tasks" :key="task.id" class="task-item-card">
        <div class="task-item-main">
          <div class="task-item-copy">
            <h3 class="table-title">{{ task.title }}</h3>
            <p>{{ task.description || 'No description' }}</p>
          </div>
          <div class="task-item-meta">
            <span class="badge">{{ formatStatus(task.status) }}</span>
            <span :class="['badge', task.priority.toLowerCase()]">{{ task.priority }}</span>
            <span class="task-item-time">{{ formatDateTime(task.deadline) }}</span>
            <span class="task-item-time">{{ task.estimatedDuration || 0 }} min</span>
          </div>
        </div>
        <div class="action-row task-item-actions">
          <button class="ghost-button" @click="emit('edit', task)">Edit</button>
          <button class="ghost-button" @click="emit('complete', task.id)">Done</button>
          <button class="ghost-button" @click="emit('skip', task.id)">Skip</button>
          <button class="danger-button" @click="emit('remove', task.id)">Delete</button>
        </div>
      </article>
    </div>
  </section>
</template>
