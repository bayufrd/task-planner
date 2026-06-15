<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Task, TaskPriority } from '../types'
import { toLocalInputValue } from '../utils/format'

const props = defineProps<{ modelValue?: Partial<Task>; submitLabel: string; busy?: boolean; mode?: 'create' | 'edit' }>()
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
  <form class="form-panel task-modal-form-next" @submit.prevent="submit">
    <div class="task-modal-progress">
      <span>{{ props.mode === 'edit' ? 'Edit Task' : 'Create Task' }}</span>
      <strong>Review details before saving</strong>
    </div>
    <div class="task-modal-review-grid">
      <article>
        <span>Task Title</span>
        <strong>{{ form.title || '-' }}</strong>
      </article>
      <article>
        <span>Priority</span>
        <strong>{{ form.priority }}</strong>
      </article>
      <article>
        <span>Deadline</span>
        <strong>{{ form.deadline || '-' }}</strong>
      </article>
      <article>
        <span>Duration</span>
        <strong>{{ form.estimatedDuration || 60 }} min</strong>
      </article>
    </div>
    <div class="form-grid task-modal-form-grid-next">
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
    <button class="primary-button task-modal-submit-next" :disabled="busy">{{ busy ? 'Saving...' : submitLabel }}</button>
  </form>
</template>
