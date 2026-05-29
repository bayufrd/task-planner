<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import TaskForm from '../components/TaskForm.vue'
import { aiApi } from '../services/api'
import { appStore } from '../stores/app'
import type { Task } from '../types'

const parseInput = ref('Tomorrow 9 AM finish sprint report for 120 minutes urgent')
const parsedTask = ref<Partial<Task> | null>(null)
const error = ref('')
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

</script>

<template>
  <div>
    <AppHeader />
    <main class="page-shell two-column">
      <section class="panel">
        <h1>AI helper</h1>
        <p>Uses the implemented parse-task endpoint from the Java backend.</p>
        <label>
          <span>Natural language input</span>
          <textarea v-model="parseInput" rows="5" placeholder="Describe a task in plain English"></textarea>
        </label>
        <div class="action-row">
          <button class="primary-button" :disabled="parsing" @click="parseTask">{{ parsing ? 'Parsing...' : 'Parse task' }}</button>
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

    </main>
  </div>
</template>
