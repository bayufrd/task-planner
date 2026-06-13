<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import { appStore } from '../stores/app'

const editingId = ref('')
const error = ref('')
const form = reactive({ taskId: '', message: '', remindAt: '', status: 'PENDING' })
const taskOptions = computed(() => appStore.tasks)

async function load() {
  error.value = ''
  try {
    await Promise.all([appStore.loadTasks(), appStore.loadReminders()])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load reminders'
  }
}

async function submit() {
  const payload = { ...form, remindAt: new Date(form.remindAt).toISOString() }
  if (editingId.value) {
    await appStore.updateReminder(editingId.value, payload)
  } else {
    await appStore.createReminder(payload)
  }
  editingId.value = ''
  form.taskId = ''
  form.message = ''
  form.remindAt = ''
  form.status = 'PENDING'
}

function startEdit(reminder: any) {
  editingId.value = reminder.id
  form.taskId = reminder.taskId
  form.message = reminder.message
  form.remindAt = reminder.remindAt.slice(0, 16)
  form.status = reminder.status
}

onMounted(load)
</script>

<template>
  <div>
    <AppHeader />
    <main class="page-shell two-column">
      <section class="panel">
        <h1>Reminders</h1>
        <p>Create and manage reminder data through the implemented reminder endpoints.</p>
        <p v-if="error" class="error-text">{{ error }}</p>
        <form class="form-grid" @submit.prevent="submit">
          <label class="full-width">
            <span>Task</span>
            <select v-model="form.taskId" required>
              <option value="" disabled>Select a task</option>
              <option v-for="task in taskOptions" :key="task.id" :value="task.id">{{ task.title }}</option>
            </select>
          </label>
          <label class="full-width">
            <span>Message</span>
            <textarea v-model="form.message" rows="3" required placeholder="Reminder message"></textarea>
          </label>
          <label>
            <span>Remind at</span>
            <input v-model="form.remindAt" required type="datetime-local" />
          </label>
          <label>
            <span>Status</span>
            <select v-model="form.status">
              <option value="PENDING">PENDING</option>
              <option value="SENT">SENT</option>
            </select>
          </label>
          <button class="primary-button">{{ editingId ? 'Update reminder' : 'Create reminder' }}</button>
        </form>
      </section>

      <section class="panel">
        <div class="section-header">
          <div>
            <h2>Reminder list</h2>
            <p>Current reminder records.</p>
          </div>
          <button class="ghost-button" @click="load">Refresh</button>
        </div>
        <div class="stack-list">
          <article v-for="reminder in appStore.reminders" :key="reminder.id" class="planner-card">
            <div>
              <h3>{{ reminder.message }}</h3>
              <p>Task ID: {{ reminder.taskId }}</p>
              <small>{{ reminder.remindAt }}</small>
            </div>
            <div class="action-row vertical">
              <span class="badge">{{ reminder.status }}</span>
              <button class="ghost-button" @click="startEdit(reminder)">Edit</button>
              <button class="danger-button" @click="appStore.deleteReminder(reminder.id)">Delete</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
