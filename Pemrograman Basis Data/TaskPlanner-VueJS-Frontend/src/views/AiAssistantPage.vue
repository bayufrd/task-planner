<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import TaskForm from '../components/TaskForm.vue'
import { aiApi } from '../services/api'
import { appStore } from '../stores/app'
import type { Task } from '../types'

const parseInput = ref('Tomorrow 9 AM finish sprint report for 120 minutes urgent')
const parsedTask = ref<Partial<Task> | null>(null)
const error = ref('')
const analysisError = ref('')
const creating = ref(false)
const parsing = ref(false)

async function parseTask() {
  parsing.value = true
  error.value = ''
  try {
    parsedTask.value = await aiApi.parseTask(parseInput.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to parse task text'
  } finally {
    parsing.value = false
  }
}

async function createFromParsed(payload: Partial<Task>) {
  creating.value = true
  try {
    await appStore.createTask(payload)
  } finally {
    creating.value = false
  }
}

async function loadAnalysis() {
  analysisError.value = ''
  try {
    await appStore.generateAnalysis()
  } catch (err) {
    analysisError.value = err instanceof Error ? err.message : 'Failed to generate overview analysis'
  }
}

onMounted(loadAnalysis)
</script>

<template>
  <div>
    <AppHeader />
    <main class="page-shell two-column">
      <section class="panel">
        <h1>AI helper</h1>
        <p>Uses the implemented parse-task and overview-analysis endpoints from the Java backend.</p>
        <label>
          <span>Natural language input</span>
          <textarea v-model="parseInput" rows="5" placeholder="Describe a task in plain English"></textarea>
        </label>
        <div class="action-row">
          <button class="primary-button" :disabled="parsing" @click="parseTask">{{ parsing ? 'Parsing...' : 'Parse task' }}</button>
          <button class="ghost-button" @click="loadAnalysis">Refresh analysis</button>
        </div>
        <p v-if="error" class="error-text">{{ error }}</p>
        <TaskForm
          v-if="parsedTask"
          :busy="creating"
          :model-value="parsedTask"
          submit-label="Create parsed task"
          @submit="createFromParsed"
        />
      </section>

      <section class="panel">
        <div class="section-header">
          <div>
            <h2>Overview analysis</h2>
            <p>Generated summary from the backend AI helper.</p>
          </div>
        </div>
        <p v-if="analysisError" class="error-text">{{ analysisError }}</p>
        <template v-if="appStore.analysis">
          <div class="analysis-card">
            <span class="badge">User {{ appStore.analysis.userId }}</span>
            <h3>{{ appStore.analysis.summary }}</h3>
            <ul class="metrics-list">
              <li>To do: {{ appStore.analysis.metrics.todo }}</li>
              <li>Done: {{ appStore.analysis.metrics.done }}</li>
              <li>Skipped: {{ appStore.analysis.metrics.skipped }}</li>
            </ul>
            <p>{{ appStore.analysis.recommendation }}</p>
          </div>
        </template>
      </section>
    </main>
  </div>
</template>
