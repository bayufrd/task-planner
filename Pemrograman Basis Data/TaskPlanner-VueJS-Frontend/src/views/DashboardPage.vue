<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, RefreshCw } from '@lucide/vue'
import AppHeader from '../components/AppHeader.vue'
import PlannerPanel from '../components/PlannerPanel.vue'
import StatsCards from '../components/StatsCards.vue'
import TaskCharts from '../components/TaskCharts.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskTable from '../components/TaskTable.vue'
import { appStore } from '../stores/app'
import type { Task } from '../types'

const editTarget = ref<Task | null>(null)
const busy = ref(false)
const search = ref('')
const status = ref('')
const priority = ref('')
const error = ref('')

const filteredTasks = computed(() => appStore.tasks)

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
      editTarget.value = null
    } else {
      await appStore.createTask(payload)
    }
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
        <button class="primary-button dashboard-top-action" @click="editTarget = null">
          <Plus :size="18" /> New task
        </button>
      </section>

      <section class="dashboard-hero panel">
        <div class="dashboard-hero-copy">
          <span class="eyebrow">Task execution overview</span>
          <h2>Track priorities, activity, and today’s schedule in one place.</h2>
          <p>Structured to resemble the Next.js dashboard flow while staying connected to the current Java backend endpoints.</p>
        </div>
        <div class="dashboard-hero-art">
          <div class="hero-art-card">
            <span class="badge">Live stats</span>
            <strong>{{ (appStore.stats?.todo ?? 0) + (appStore.stats?.inProgress ?? 0) }}</strong>
            <small>active tasks in progress</small>
          </div>
        </div>
      </section>

      <p v-if="error" class="error-text">{{ error }}</p>

      <StatsCards :stats="appStore.stats" />

      <section class="dashboard-main-grid">
        <div class="dashboard-left-column">
          <TaskCharts :daily="appStore.dailyStats" :stats="appStore.stats" />
          <section class="panel filters-panel dashboard-filters">
            <div class="section-header">
              <div>
                <h2>Filter tasks</h2>
                <p>Search and narrow the Java backend task list.</p>
              </div>
              <button class="ghost-button" @click="refresh"><RefreshCw :size="16" /> Refresh</button>
            </div>
            <div class="filters-grid">
              <input v-model="search" placeholder="Search tasks" />
              <select v-model="status">
                <option value="">All statuses</option>
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
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
            @edit="editTarget = $event"
            @complete="appStore.completeTask($event).then(refresh)"
            @skip="appStore.skipTask($event).then(refresh)"
            @remove="appStore.deleteTask($event).then(refresh)"
          />
        </div>

        <aside class="dashboard-right-column">
          <PlannerPanel :items="appStore.planner" />
          <TaskForm
            :busy="busy"
            :model-value="editTarget || undefined"
            :submit-label="editTarget ? 'Update task' : 'Create task'"
            @submit="submitTask"
          />
        </aside>
      </section>
    </main>
  </div>
</template>
