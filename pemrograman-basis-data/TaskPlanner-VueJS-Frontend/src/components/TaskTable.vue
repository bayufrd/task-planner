<script setup lang="ts">
import type { PlannerItem, Task } from '../types'
import { formatDateTime } from '../utils/format'
import { Clock, Timer, CheckCircle2, Trash2, RotateCcw, Play, ArrowUp, ArrowRight, ArrowDown, Circle, CheckCircle, XCircle } from '@lucide/vue'

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

function getPlannerItem(taskId: string) {
  return props.plannerItems?.find((item) => item.task.id === taskId)
}

function getPriorityBorder(priority: string) {
  const map: Record<string, string> = {
    HIGH: 'border-l-red-500',
    MEDIUM: 'border-l-yellow-500',
    LOW: 'border-l-green-500',
  }
  return map[priority] || 'border-l-gray-500'
}

function getPriorityGradient(priority: string) {
  const map: Record<string, string> = {
    HIGH: 'from-red-600 to-orange-600',
    MEDIUM: 'from-yellow-600 to-orange-600',
    LOW: 'from-green-600 to-emerald-600',
  }
  return `bg-gradient-to-r ${map[priority] || 'from-gray-600 to-gray-500'}`
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'DONE': return CheckCircle
    case 'SKIPPED': return XCircle
    case 'IN_PROGRESS': return Play
    default: return Circle
  }
}

function getStatusIconClass(status: string) {
  switch (status) {
    case 'DONE': return 'text-green-500'
    case 'SKIPPED': return 'text-gray-400'
    case 'IN_PROGRESS': return 'text-blue-500'
    default: return 'text-gray-400'
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'HIGH': return ArrowUp
    case 'MEDIUM': return ArrowRight
    case 'LOW': return ArrowDown
    default: return ArrowRight
  }
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
        @click="task.status !== 'SKIPPED' && emit('edit', task)"
        :class="[
          'p-4 border-l-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-lg/50 transition-all duration-200 backdrop-blur-sm',
          task.status !== 'SKIPPED' ? 'cursor-pointer' : 'opacity-60 cursor-default',
          getPriorityBorder(task.priority)
        ]"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- Left Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start gap-3 mb-3">
              <component :is="getStatusIcon(task.status)" :class="['w-5 h-5 flex-shrink-0', getStatusIconClass(task.status)]" :stroke-width="2" />
              <div class="flex-1 min-w-0">
                <h3 :class="[
                  'font-semibold text-base line-clamp-2',
                  task.status === 'DONE' || task.status === 'SKIPPED'
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-gray-50'
                ]">
                  {{ task.title }}
                </h3>
              </div>
            </div>

            <p v-if="task.description" class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {{ task.description }}
            </p>

            <!-- Task Meta -->
            <div class="flex flex-wrap items-center gap-2 text-sm mb-3">
              <!-- Priority Badge -->
              <div
                :class="[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-white text-xs shadow-sm',
                  getPriorityGradient(task.priority)
                ]"
              >
                <component :is="getPriorityIcon(task.priority)" class="w-3.5 h-3.5" :stroke-width="2.5" />
                {{ task.priority }}
              </div>

              <!-- Deadline -->
              <div class="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg text-gray-700 dark:text-gray-300">
                <Clock class="w-3.5 h-3.5" :stroke-width="2" />
                <time class="text-xs font-medium">
                  {{ formatDateTime(task.deadline) }}
                </time>
              </div>

              <!-- Estimated Duration -->
              <div v-if="task.estimatedDuration" class="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg text-gray-700 dark:text-gray-300">
                <Timer class="w-3.5 h-3.5" :stroke-width="2" />
                <span class="text-xs font-medium">{{ task.estimatedDuration }}min</span>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="flex flex-col items-end gap-3 ml-4 flex-shrink-0">
            <!-- Priority Score -->
            <div v-if="task.priorityScore !== undefined || getPlannerItem(task.id)?.priorityScore !== undefined" class="text-center bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-2.5 min-w-[70px]">
              <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {{ task.priorityScore ?? getPlannerItem(task.id)?.priorityScore }}
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Score</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/50"
          @click.stop
        >
          <button
            v-if="task.status === 'DONE'"
            @click="emit('edit', { ...task, status: 'TODO' })"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 font-medium text-sm text-gray-700 dark:text-gray-300"
            title="Undo"
          >
            <RotateCcw class="w-4 h-4" :stroke-width="2" />
            Undo
          </button>
          <button
            v-else-if="task.status !== 'SKIPPED'"
            @click="emit('complete', task.id)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100/80 dark:bg-green-900/20 hover:bg-green-200/80 dark:hover:bg-green-800/30 transition-all duration-200 font-medium text-sm text-green-700 dark:text-green-400"
            title="Complete"
          >
            <CheckCircle2 class="w-4 h-4" :stroke-width="2" />
            Done
          </button>

          <button
            @click="emit('remove', task.id)"
            class="px-3 py-2 rounded-lg bg-red-100/80 dark:bg-red-900/20 hover:bg-red-200/80 dark:hover:bg-red-800/30 transition-all duration-200 font-medium text-sm text-red-700 dark:text-red-400"
            title="Delete"
          >
            <Trash2 class="w-4 h-4" :stroke-width="2" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
