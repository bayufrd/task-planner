<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Task, TaskPriority } from '../types'
import { toLocalInputValue } from '../utils/format'

const props = defineProps<{ modelValue?: Partial<Task>; submitLabel: string; busy?: boolean }>()
const emit = defineEmits<{ submit: [payload: Partial<Task>] }>()

const form = reactive({
  title: '',
  description: '',
  deadline: toLocalInputValue(),
  priority: 'MEDIUM' as TaskPriority,
  estimatedDuration: 60,
})

watch(
  () => props.modelValue,
  (value) => {
    form.title = value?.title || ''
    form.description = value?.description || ''
    form.deadline = toLocalInputValue(value?.deadline)
    form.priority = (value?.priority as TaskPriority) || 'MEDIUM'
    form.estimatedDuration = value?.estimatedDuration || 60
  },
  { immediate: true },
)

function toBackendDeadline(value: string) {
  return value.length === 16 ? `${value}:00` : value
}

function submit() {
  emit('submit', {
    title: form.title,
    description: form.description,
    deadline: toBackendDeadline(form.deadline),
    priority: form.priority,
    estimatedDuration: Number(form.estimatedDuration),
  })
}
</script>

<template>
  <form class="form-panel" @submit.prevent="submit">
    <div class="form-grid">
      <label>
        <span>Title</span>
        <input v-model="form.title" required placeholder="Finish weekly report" />
      </label>
      <label>
        <span>Deadline</span>
        <input v-model="form.deadline" required type="datetime-local" />
      </label>
      <label class="full-width">
        <span>Description</span>
        <textarea v-model="form.description" rows="4" placeholder="Task details"></textarea>
      </label>
      <label>
        <span>Priority</span>
        <select v-model="form.priority">
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </label>
      <label>
        <span>Estimated duration (minutes)</span>
        <input v-model="form.estimatedDuration" min="5" step="5" type="number" />
      </label>
    </div>
    <button class="primary-button" :disabled="busy">{{ busy ? 'Saving...' : submitLabel }}</button>
  </form>
</template>
