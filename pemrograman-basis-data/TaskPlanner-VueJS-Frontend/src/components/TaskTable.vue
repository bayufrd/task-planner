<script setup lang="ts">
import type { PlannerItem, Task } from '../types'
import { formatDateTime } from '../utils/format'
import { Clock, CalendarDays, Timer } from '@lucide/vue' // Import Clock, CalendarDays, Timer

const props = defineProps<{
  tasks: Task[]
  plannerItems?: PlannerItem[]
  filter?: 'today' | 'upcoming' | 'all'
}>()
const emit = defineEmits<{
  edit: [task: Task]
  complete: [id: string]
  skip: [id: string]
  remove: [id: string]
  'update:filter': [filter: 'today' | 'upcoming' | 'all']
}>()

function formatStatus(status: Task['status']) {
  // Map to more descriptive statuses if needed, or keep as is
  return status === 'DONE' ? 'Done' : status === 'SKIPPED' ? 'Skipped' : 'Pending'
}

function getPlannerItem(taskId: string) {
  return props.plannerItems?.find((item) => item.task.id === taskId)
}
</script>

<template>
  <section class="panel task-list-panel">
    <div class="section-header dashboard-section-header-simple flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <span class="chart-kicker">Priority queue</span>
        <h2>Active tasks</h2>
        <p>Review the highest-value work first and update it inline.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="f in ['today', 'upcoming', 'all']"
          :key="f"
          @click="emit('update:filter', f as any)"
          :class="[
            'px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200',
            filter === f
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105'
              : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 border border-gray-200',
          ]"
        >
          {{ f.charAt(0).toUpperCase() + f.slice(1) }}
        </button>
      </div>
    </div>
    <div class="task-list-stack">
      <div v-if="tasks.length === 0" class="text-center py-12 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <p class="text-sm font-medium">No tasks found for this filter.</p>
      </div>
      <article
        v-else
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50"
      >
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ task.title }}
            </h3>
            <span
              v-if="getPlannerItem(task.id)?.priorityScore !== undefined"
              class="text-xs font-bold text-blue-500 dark:text-blue-400/70 ml-2"
            >
              Score {{ getPlannerItem(task.id)?.priorityScore }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ task.description || 'No description' }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="badge-status badge-pending">{{ formatStatus(task.status) }}</span>
          <span :class="['badge-priority', task.priority.toLowerCase()]">{{ task.priority }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400/70 flex items-center gap-1">
            <Clock class="w-3 h-3" /> {{ formatDateTime(task.deadline) }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400/70 flex items-center gap-1">
            <Timer class="w-3 h-3" /> {{ task.estimatedDuration || 0 }} min
          </span>
          <span
            v-if="getPlannerItem(task.id)?.deadline"
            class="text-xs text-gray-500 dark:text-gray-400/70 flex items-center gap-1"
          >
            <CalendarDays class="w-3 h-3" /> {{ formatDateTime(getPlannerItem(task.id)!.deadline) }}
          </span>
        </div>
        <div class="flex flex-col gap-1.5">
          <button class="ghost-button-sm" @click="emit('edit', task)">Edit</button>
          <button
            v-if="task.status !== 'DONE'"
            class="ghost-button-sm task-action-done"
            @click="emit('complete', task.id)"
          >
            Done
          </button>
          <button
            v-if="task.status !== 'SKIPPED' && task.status !== 'DONE'"
            class="ghost-button-sm"
            @click="emit('skip', task.id)"
          >
            Skip
          </button>
          <button class="danger-button-sm" @click="emit('remove', task.id)">Delete</button>
        </div>
      </article>
    </div>
  </section>
</template>
