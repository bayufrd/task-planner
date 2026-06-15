<script setup lang="ts">
import type { PlannerItem, Task } from '../types'
import { formatDateTime } from '../utils/format'

const props = defineProps<{
  tasks: Task[]
  plannerItems?: PlannerItem[]
}>()
const emit = defineEmits<{
  edit: [task: Task]
  complete: [id: string]
  skip: [id: string]
  remove: [id: string]
}>()

function formatStatus(status: Task['status']) {
  return status === 'DONE' ? 'Done' : status === 'SKIPPED' ? 'Skipped' : 'Pending'
}

function getPlannerItem(taskId: string) {
  return props.plannerItems?.find((item) => item.task.id === taskId)
}
</script>

<template>
  <section class="panel task-list-panel">
    <div class="section-header dashboard-section-header-simple">
      <div>
        <span class="chart-kicker">Priority queue</span>
        <h2>Active tasks</h2>
        <p>Review the highest-value work first and update it inline.</p>
      </div>
    </div>
    <div class="task-list-stack">
      <article v-for="task in tasks" :key="task.id" class="task-item-card task-item-card-next">
        <div class="task-item-main task-item-main-next">
          <div class="task-item-copy">
            <div class="task-item-title-row">
              <h3 class="table-title">{{ task.title }}</h3>
              <span v-if="getPlannerItem(task.id)?.priorityScore !== undefined" class="task-score-pill">
                Score {{ getPlannerItem(task.id)?.priorityScore }}
              </span>
            </div>
            <p>{{ task.description || 'No description' }}</p>
          </div>
          <div class="task-item-meta">
            <span class="badge">{{ formatStatus(task.status) }}</span>
            <span :class="['badge', task.priority.toLowerCase()]">{{ task.priority }}</span>
            <span class="task-item-time">{{ formatDateTime(task.deadline) }}</span>
            <span class="task-item-time">{{ task.estimatedDuration || 0 }} min</span>
            <span v-if="getPlannerItem(task.id)?.deadline" class="task-item-time">
              Due {{ formatDateTime(getPlannerItem(task.id)!.deadline) }}
            </span>
          </div>
        </div>
        <div class="action-row task-item-actions">
          <button class="ghost-button" @click="emit('edit', task)">Edit</button>
          <button v-if="task.status !== 'DONE'" class="ghost-button task-action-done" @click="emit('complete', task.id)">Done</button>
          <button v-if="task.status !== 'SKIPPED' && task.status !== 'DONE'" class="ghost-button" @click="emit('skip', task.id)">Skip</button>
          <button class="danger-button" @click="emit('remove', task.id)">Delete</button>
        </div>
      </article>
    </div>
  </section>
</template>
