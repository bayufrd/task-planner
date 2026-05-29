<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CalendarDays, CheckCircle2, CircleDashed, Clock3, Plus, RefreshCw, X } from '@lucide/vue'

const calendarViews = ['This week', 'This month', 'Next month'] as const
type CalendarView = (typeof calendarViews)[number]
import AppHeader from '../components/AppHeader.vue'
import StatsCards from '../components/StatsCards.vue'
import TaskCharts from '../components/TaskCharts.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskTable from '../components/TaskTable.vue'
import PlannerPanel from '../components/PlannerPanel.vue'
import { appStore } from '../stores/app'
import type { Task } from '../types'

type CalendarEntry = {
  key: string
  label: string
  note?: string
  notes?: string[]
  muted?: boolean
  active?: boolean
  empty?: boolean
}

const calendarDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const editTarget = ref<Task | null>(null)
const busy = ref(false)
const showTaskForm = ref(false)
const selectedCalendarView = ref<CalendarView>('This week')
const search = ref('')
const status = ref('')
const priority = ref('')
const error = ref('')

const filteredTasks = computed(() => appStore.tasks)
const todayReference = computed(() => new Date())
const isTaskModalOpen = computed(() => showTaskForm.value || !!editTarget.value)

function toMondayIndex(day: number) {
  return (day + 6) % 7
}

function getMonthDays(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseTaskDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const tasksByDate = computed(() => {
  const grouped = new Map<string, Task[]>()

  for (const task of filteredTasks.value) {
    const date = parseTaskDate(task.deadline)
    if (!date) continue
    const key = toDateKey(date)
    const existing = grouped.get(key) ?? []
    existing.push(task)
    grouped.set(key, existing)
  }

  return grouped
})

function buildEntry(current: Date, keyPrefix: string, today: Date, muted = false): CalendarEntry {
  const dateKey = toDateKey(current)
  const tasks = tasksByDate.value.get(dateKey) ?? []

  return {
    key: `${keyPrefix}-${dateKey}`,
    label: String(current.getDate()).padStart(2, '0'),
    note: tasks[0]?.title,
    notes: tasks.slice(0, 3).map((task) => task.title),
    muted,
    active: current.toDateString() === today.toDateString(),
  }
}

function buildWeekEntries(today: Date): CalendarEntry[] {
  const base = new Date(today)
  const mondayOffset = toMondayIndex(base.getDay())
  base.setDate(base.getDate() - mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(base)
    current.setDate(base.getDate() + index)
    return buildEntry(current, 'week', today, current.getMonth() !== today.getMonth())
  })
}

function buildMonthEntries(date: Date, today: Date): CalendarEntry[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const totalDays = getMonthDays(date)
  const firstDayOffset = toMondayIndex(new Date(year, month, 1).getDay())
  const entries: CalendarEntry[] = []

  for (let index = 0; index < firstDayOffset; index += 1) {
    entries.push({
      key: `empty-${year}-${month}-${index}`,
      label: '',
      empty: true,
    })
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const current = new Date(year, month, day)
    entries.push(buildEntry(current, 'month', today))
  }

  return entries
}

function closeTaskModal() {
  showTaskForm.value = false
  editTarget.value = null
}

const calendarHeading = computed(() => {
  if (selectedCalendarView.value === 'This week') {
    return 'See your weekly planning flow at a glance.'
  }

  if (selectedCalendarView.value === 'This month') {
    return 'See the full month and plan around every date.'
  }

  return 'Preview the next month and spread tasks earlier.'
})

const calendarEntries = computed(() => {
  const today = todayReference.value

  if (selectedCalendarView.value === 'This week') {
    return buildWeekEntries(today)
  }

  const target = new Date(today.getFullYear(), today.getMonth() + (selectedCalendarView.value === 'Next month' ? 1 : 0), 1)
  return buildMonthEntries(target, today)
})

const focusStats = computed(() => {
  const stats = appStore.stats

  return [
    {
      key: 'pending',
      label: 'Pending',
      value: (stats?.todo ?? 0) + (stats?.inProgress ?? 0),
      tone: 'pending',
      icon: CircleDashed,
    },
    {
      key: 'done',
      label: 'Done',
      value: stats?.done ?? 0,
      tone: 'done',
      icon: CheckCircle2,
    },
    {
      key: 'hours',
      label: 'Planned mins',
      value: filteredTasks.value.reduce((total, task) => total + (task.estimatedDuration ?? 0), 0),
      tone: 'time',
      icon: Clock3,
    },
  ]
})

async function refresh() {
  error.value = ''
  try {
    await Promise.all([
      appStore.loadTasks({ search: search.value, status: status.value as any, priority: priority.value as any }),
      appStore.loadStats(),
      appStore.loadDailyStats(),
      appStore.loadPlanner(),
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
  <div>
    <AppHeader />
    <main class="dashboard-shell">
      <section class="dashboard-topbar">
        <div>
          <p class="dashboard-kicker">Workspace</p>
          <h1>Tasks</h1>
        </div>
        <button class="primary-button dashboard-top-action" @click="showTaskForm = true; editTarget = null">
          <Plus :size="18" /> New task
        </button>
      </section>

      <section class="dashboard-timeline panel">
        <div class="dashboard-timeline-head">
          <div>
            <span class="eyebrow">Calendar overview</span>
            <h2>{{ calendarHeading }}</h2>
          </div>
          <div class="dashboard-calendar-controls">
            <button
              v-for="view in calendarViews"
              :key="view"
              type="button"
              :class="['dashboard-calendar-control', { active: view === selectedCalendarView }]"
              @click="selectedCalendarView = view"
            >
              <CalendarDays :size="15" v-if="view === selectedCalendarView" />
              {{ view }}
            </button>
          </div>
        </div>
        <div class="dashboard-calendar-shell">
          <div class="dashboard-calendar-grid dashboard-calendar-days">
            <span v-for="day in calendarDayLabels" :key="day">{{ day }}</span>
          </div>
          <div class="dashboard-calendar-grid dashboard-calendar-dates">
            <div
              v-for="entry in calendarEntries"
              :key="entry.key"
              :class="['calendar-date-card', { active: entry.active, muted: entry.muted, empty: entry.empty }]"
            >
              <template v-if="!entry.empty">
                <strong>{{ entry.label }}</strong>
                <div v-if="entry.notes?.length" class="calendar-date-notes">
                  <small v-for="note in entry.notes" :key="note">{{ note }}</small>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-hero panel">
        <div class="dashboard-hero-copy">
          <span class="eyebrow">Task planner overview</span>
          <h2>Plan faster, track what matters, and keep today’s work visible on every screen.</h2>
          <p>A denser dashboard flow keeps stats, calendar context, and task execution close together without feeling cramped on mobile.</p>
        </div>
        <div class="dashboard-hero-art">
          <div class="dashboard-hero-image-frame">
            <img src="/opt-hero/2.png" alt="Task planner dashboard preview" class="dashboard-hero-image" />
            <div class="dashboard-hero-image-badge">
              <span class="badge">Live stats</span>
              <strong>{{ (appStore.stats?.todo ?? 0) + (appStore.stats?.inProgress ?? 0) }}</strong>
              <small>pending tasks right now</small>
            </div>
          </div>
        </div>
        <div class="dashboard-focus-grid">
          <article
            v-for="item in focusStats"
            :key="item.key"
            :class="['dashboard-focus-card', item.tone]"
          >
            <div class="dashboard-focus-icon">
              <component :is="item.icon" :size="18" />
            </div>
            <div>
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </article>
        </div>
      </section>

      <p v-if="error" class="error-text">{{ error }}</p>

      <StatsCards :stats="appStore.stats" />

      <section class="dashboard-main-grid">
        <div class="dashboard-left-column">
          <TaskCharts :daily="appStore.dailyStats" :stats="appStore.stats" />
          <section class="panel filters-panel dashboard-filters">
            <div class="section-header dashboard-section-header-simple">
              <div>
                <span class="chart-kicker">Filter</span>
                <h2>Filter tasks</h2>
                <p>Search and narrow your task list quickly.</p>
              </div>
              <button class="ghost-button dashboard-refresh-button" @click="refresh"><RefreshCw :size="16" /> Refresh</button>
            </div>
            <div class="filters-grid">
              <input v-model="search" placeholder="Search tasks" />
              <select v-model="status">
                <option value="">All statuses</option>
                <option value="TODO">Pending</option>
                <option value="DONE">Done</option>
                <option value="SKIPPED">Skipped</option>
              </select>
              <select v-model="priority">
                <option value="">All priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <button class="primary-button" @click="refresh">Apply filters</button>
            </div>
          </section>
          <TaskTable
            :tasks="filteredTasks"
            @edit="editTarget = $event; showTaskForm = true"
            @complete="appStore.completeTask($event).then(refresh)"
            @skip="appStore.skipTask($event).then(refresh)"
            @remove="appStore.deleteTask($event).then(refresh)"
          />
        </div>

        <aside class="dashboard-right-column">
          <PlannerPanel :items="appStore.planner" />
        </aside>
      </section>
    </main>

    <div v-if="isTaskModalOpen" class="dashboard-modal-backdrop" @click.self="closeTaskModal">
      <section class="panel dashboard-task-modal">
        <div class="section-header dashboard-task-form-head">
          <div>
            <h2>{{ editTarget ? 'Update task' : 'Create a new task' }}</h2>
            <p>{{ editTarget ? 'Adjust task details and keep your plan up to date.' : 'Add a task to your planner and organize the rest of your day.' }}</p>
          </div>
          <button class="ghost-button" @click="closeTaskModal">
            <X :size="16" /> Close
          </button>
        </div>
        <TaskForm
          :busy="busy"
          :model-value="editTarget || undefined"
          :submit-label="editTarget ? 'Update task' : 'Create task'"
          @submit="submitTask"
        />
      </section>
    </div>
  </div>
</template>
