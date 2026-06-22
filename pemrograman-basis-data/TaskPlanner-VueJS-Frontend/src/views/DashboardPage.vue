<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CalendarDays, CheckCircle2, CheckSquare2, CircleDashed, Command, Plus, X, XCircle, ChevronLeft, ChevronRight } from '@lucide/vue'

import TaskForm from '../components/TaskForm.vue'
import TaskTable from '../components/TaskTable.vue'
import { appStore } from '../stores/app'
import type { Task } from '../types'

// Add filter state
const filter = ref<'today' | 'upcoming' | 'all'>('today')

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const editTarget = ref<Task | null>(null)
const busy = ref(false)
const showTaskForm = ref(false)
const currentMonth = ref(new Date())
const search = ref('')
const status = ref('')
const priority = ref('')
const error = ref('')

const activeTasks = computed(() => appStore.tasks.filter(task => task.status !== 'DONE'))
const hasActiveTasks = computed(() => activeTasks.value.length > 0)

const filteredTasks = computed(() => {
  let tasks = activeTasks.value

  const today = new Date()
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  switch (filter.value) {
    case 'today':
      return tasks.filter(task => {
        const taskDate = new Date(task.deadline)
        return (
          taskDate.getFullYear() === today.getFullYear() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getDate() === today.getDate()
        )
      })
    case 'upcoming':
      return tasks.filter(task => {
        const taskDate = new Date(task.deadline)
        return taskDate >= today && taskDate <= weekFromNow
      })
    case 'all':
    default:
      return tasks
  }
})

const isTaskModalOpen = computed(() => showTaskForm.value || !!editTarget.value)

function getTasksForDay(day: Date) {
  return appStore.tasks.filter((task) => {
    const taskDate = new Date(task.deadline)
    return (
      taskDate.getFullYear() === day.getFullYear() &&
      taskDate.getMonth() === day.getMonth() &&
      taskDate.getDate() === day.getDate() &&
      task.status !== 'DONE'
    )
  })
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

function isSameMonth(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function eachDayOfInterval(start: Date, end: Date) {
  const days: Date[] = []
  const current = new Date(start)
  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

function addMonths(date: Date, months: number) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function subMonths(date: Date, months: number) {
  return addMonths(date, -months)
}

const monthStart = computed(() => startOfMonth(currentMonth.value))
const monthEnd = computed(() => endOfMonth(currentMonth.value))
const daysInMonth = computed(() => eachDayOfInterval(monthStart.value, monthEnd.value))

const todayTaskCount = computed(() => getTasksForDay(new Date()).length)

function closeTaskModal() {
  showTaskForm.value = false
  editTarget.value = null
}

function formatMonthYear() {
  const month = currentMonth.value.toLocaleDateString('en-US', { month: 'long' })
  const year = currentMonth.value.getFullYear()
  return { month, year }
}

function goToPreviousMonth() {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

function goToToday() {
  currentMonth.value = new Date()
}

function goToNextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1)
}


async function refresh() {
  error.value = ''
  try {
    await Promise.all([
      appStore.loadTasks({ search: search.value, status: status.value as any, priority: priority.value as any }),
      appStore.loadStats(),
      appStore.loadDailyStats(),
    ])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard'
  }
}

async function submitTask(payload: Partial<Task>) {
  busy.value = true
  try {
    if (editTarget.value) {
      await appStore.updateTask(editTarget.value.id, payload)
    } else {
      await appStore.createTask(payload)
    }
    closeTaskModal()
    await refresh()
  } finally {
    busy.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <main class="flex flex-col min-h-screen bg-white">
      <!-- Header with Title and New Task Button -->
      <section class="flex-shrink-0 sticky top-0 z-20 bg-white/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200/50">
        <div class="max-w-6xl mx-auto flex flex-row items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
          <button class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105" @click="showTaskForm = true; editTarget = null">
            <Plus :size="16" /> New Task
          </button>
        </div>
      </section>

      <!-- Calendar Timeline Section -->
      <section class="flex-shrink-0 border-b border-gray-200/50 bg-gradient-to-b from-white/80 to-gray-50/80 px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-6xl mx-auto space-y-6">
          <!-- Today Quick View -->
          <div class="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100/50 rounded-2xl p-5">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1">
                <p class="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">
                  <CalendarDays class="w-3.5 h-3.5 inline mr-1.5" :stroke-width="2" />
                  Today
                </p>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                  {{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }}
                </h3>
                <p class="text-xs text-blue-600 mt-1">Click to view tasks for today</p>
              </div>
              <div class="text-right bg-white/60 rounded-xl p-3">
                <p class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {{ todayTaskCount }}
                </p>
                <p class="text-xs text-gray-600 font-medium mt-1">{{ todayTaskCount === 1 ? 'task' : 'tasks' }}</p>
              </div>
            </div>
          </div>

          <!-- Month Selector & Calendar -->
          <div>
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="flex-1">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
                  {{ formatMonthYear().month }}
                  <span class="text-gray-500 font-normal ml-2">{{ formatMonthYear().year }}</span>
                </h2>
              </div>
              <div class="flex items-center gap-1.5 bg-gray-100/80 rounded-lg p-1">
                <button
                  @click="goToPreviousMonth"
                  class="p-2 hover:bg-white/80 rounded-md transition-all duration-200 text-gray-700 hover:text-gray-900"
                  aria-label="Previous month"
                >
                  <ChevronLeft class="w-5 h-5" :stroke-width="2" />
                </button>
                <button
                  @click="goToToday"
                  class="px-3 py-1.5 hover:bg-blue-600/20 rounded-md transition-all duration-200 text-xs font-semibold text-gray-700 hover:text-blue-600"
                >
                  Today
                </button>
                <button
                  @click="goToNextMonth"
                  class="p-2 hover:bg-white/80 rounded-md transition-all duration-200 text-gray-700 hover:text-gray-900"
                  aria-label="Next month"
                >
                  <ChevronRight class="w-5 h-5" :stroke-width="2" />
                </button>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <div class="space-y-3 min-w-full">
                <div class="grid grid-cols-7 gap-2">
                  <div
                    v-for="day in weekDays"
                    :key="day"
                    class="text-center text-xs font-semibold text-gray-600 py-2 uppercase tracking-wider"
                  >
                    {{ day }}
                  </div>
                </div>

                <div class="grid grid-cols-7 gap-2">
                  <button
                    v-for="day in daysInMonth"
                    :key="day.toISOString()"
                    :disabled="!isSameMonth(day, currentMonth)"
                    :class="[
                      'relative p-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-200',
                      !isSameMonth(day, currentMonth)
                        ? 'text-gray-400 cursor-default'
                        : isSameDay(day, new Date())
                          ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-md'
                          : 'hover:bg-gray-100/80 text-gray-700'
                    ]"
                  >
                    <div class="flex flex-col items-center gap-1">
                      <span>{{ day.getDate() }}</span>
                      <div v-if="getTasksForDay(day).length > 0" :class="[
                        'inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full',
                        isSameDay(day, new Date())
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-orange-100/80 text-orange-600'
                      ]">
                        {{ getTasksForDay(day).length }}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Cards Section -->
      <section class="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4">
        <div class="max-w-6xl mx-auto grid grid-cols-3 gap-3">
          <article class="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100/50 rounded-2xl">
            <CircleDashed class="w-5 h-5 text-blue-600" />
            <div class="text-center">
              <p class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{{ (appStore.stats?.todo ?? 0) + (appStore.stats?.inProgress ?? 0) }}</p>
              <p class="text-xs text-gray-600 font-medium">Pending</p>
            </div>
          </article>
          <article class="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-100/50 rounded-2xl">
            <CheckCircle2 class="w-5 h-5 text-emerald-600" />
            <div class="text-center">
              <p class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{{ appStore.stats?.done ?? 0 }}</p>
              <p class="text-xs text-gray-600 font-medium">Done</p>
            </div>
          </article>
          <article class="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50 border border-gray-200/50 rounded-2xl">
            <XCircle class="w-5 h-5 text-gray-500" />
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-600">{{ appStore.stats?.skipped ?? 0 }}</p>
              <p class="text-xs text-gray-600 font-medium">Skipped</p>
            </div>
          </article>
        </div>
      </section>

      <!-- Hero Image Section -->
      <section class="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4">
        <div class="max-w-6xl mx-auto">
          <div class="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden shadow-lg border border-gray-200/50">
            <img src="/opt-hero/2.webp" alt="Dashboard Hero" class="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <!-- Tasks Display Section -->
      <section class="flex-1">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <section v-if="!hasActiveTasks" class="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div class="mb-6">
              <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 mx-auto">
                <CheckSquare2 :size="40" class="text-blue-600" />
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">No tasks yet</h2>
              <p class="text-gray-600 mb-8 max-w-sm mx-auto">Create your first task to start building momentum.</p>
            </div>
            <button class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105" @click="showTaskForm = true; editTarget = null">
              <Plus :size="20" /> Add Task
            </button>
            <p class="text-xs text-gray-500 mt-6">
              <Command :size="14" class="inline mr-1" /> Or press Ctrl+K
            </p>
          </section>

          <section v-else class="space-y-6">
            <!-- Task Statistics -->
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <div class="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100/50 rounded-2xl p-4">
                <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Total Tasks</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{{ activeTasks.length }}</p>
              </div>
              <div class="bg-gradient-to-br from-orange-50/50 to-red-50/50 border border-orange-100/50 rounded-2xl p-4">
                <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">High Priority</p>
                <p class="text-3xl font-bold text-orange-600">{{ activeTasks.filter(t => t.priority === 'HIGH').length }}</p>
              </div>
              <div class="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-100/50 rounded-2xl p-4">
                <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Medium</p>
                <p class="text-3xl font-bold text-green-600">{{ activeTasks.filter(t => t.priority === 'MEDIUM').length }}</p>
              </div>
            </div>

            <!-- Task List -->
            <div class="bg-white rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6">
              <TaskTable
                :tasks="filteredTasks"
                :planner-items="appStore.planner"
                :filter="filter"
                @update:filter="filter = $event"
                @edit="editTarget = $event; showTaskForm = true"
                @complete="appStore.completeTask($event).then(refresh)"
                @skip="appStore.skipTask($event).then(refresh)"
                @remove="appStore.deleteTask($event).then(refresh)"
              />
            </div>
          </section>
        </div>
      </section>

    <p v-if="error" class="text-red-600 font-semibold px-4 sm:px-6 lg:px-8">{{ error }}</p>

    <div v-if="isTaskModalOpen" class="dashboard-modal-backdrop" @click.self="closeTaskModal">
      <section class="panel dashboard-task-modal">
        <div class="section-header dashboard-task-form-head dashboard-task-form-head-next">
          <div>
            <span class="chart-kicker">Step 1 of 1</span>
            <h2>{{ editTarget ? 'Edit Task' : 'Create Task' }}</h2>
            <p>{{ editTarget ? 'Review the current task details, update the fields, then save changes.' : 'Fill in the task details, review the summary, then create the task.' }}</p>
          </div>
          <button class="dashboard-modal-close-button" aria-label="Close task modal" @click="closeTaskModal">
            <X :size="18" />
          </button>
        </div>
        <TaskForm
          :busy="busy"
          :mode="editTarget ? 'edit' : 'create'"
          :model-value="editTarget || undefined"
          :submit-label="editTarget ? 'Save Changes' : 'Create Task'"
          @submit="submitTask"
        />
      </section>
    </div>
  </main>
</template>
