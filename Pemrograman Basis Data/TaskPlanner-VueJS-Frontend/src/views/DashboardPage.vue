<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
    <main class="page-shell">
      <section class="hero-banner panel">
        <div>
          <span class="eyebrow">Dashboard</span>
          <h1>Task execution overview</h1>
          <p>Task CRUD, today planner, and analytics backed by the Java API.</p>
        </div>
      </section>

      <p v-if="error" class="error-text">{{ error }}</p>

      <StatsCards :stats="appStore.stats" />
      <TaskCharts :daily="appStore.dailyStats" :stats="appStore.stats" />
      <PlannerPanel :items="appStore.planner" />

      <section class="panel filters-panel">
        <div class="section-header">
          <div>
            <h2>Filters</h2>
            <p>Search and filter task list.</p>
          </div>
          <button class="ghost-button" @click="refresh">Refresh</button>
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

      <TaskForm :busy="busy" :model-value="editTarget || undefined" :submit-label="editTarget ? 'Update task' : 'Create task'" @submit="submitTask" />
      <TaskTable
        :tasks="filteredTasks"
        @edit="editTarget = $event"
        @complete="appStore.completeTask($event).then(refresh)"
        @skip="appStore.skipTask($event).then(refresh)"
        @remove="appStore.deleteTask($event).then(refresh)"
      />
    </main>
  </div>
</template>
