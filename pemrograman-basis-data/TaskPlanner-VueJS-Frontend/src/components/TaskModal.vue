<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { X, Check, ArrowLeft, ArrowRight, Plus, Save } from '@lucide/vue'
import { appStore } from '../stores/app'
import { uiStore } from '../stores/ui'
import type { Task } from '../types'

const props = defineProps<{
  isOpen: boolean
  mode: 'create' | 'edit'
  task?: Task | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
  created: []
}>()

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type TaskStep = 'title' | 'description' | 'date' | 'time' | 'priority' | 'duration' | 'review'

interface StepConfig {
  key: TaskStep
  label: string
  helper: string
}

const TASK_STEPS: StepConfig[] = [
  { key: 'title', label: 'Task Title', helper: 'Start from the main task name first.' },
  { key: 'description', label: 'Description', helper: 'Add optional context if you need it.' },
  { key: 'date', label: 'Date', helper: 'Pick the day for this task.' },
  { key: 'time', label: 'Time', helper: 'Choose the most suitable time slot.' },
  { key: 'priority', label: 'Priority', helper: 'Set how urgent this task is.' },
  { key: 'duration', label: 'Duration', helper: 'Estimate how long this task should take.' },
  { key: 'review', label: 'Review', helper: 'Check the details before saving.' },
]

const priorityOptions = [
  { value: 'HIGH' as Priority, label: 'High', hint: 'Urgent and needs attention soon.' },
  { value: 'MEDIUM' as Priority, label: 'Medium', hint: 'Important but balanced.' },
  { value: 'LOW' as Priority, label: 'Low', hint: 'Can wait until higher priorities are done.' },
]

const isLoading = ref(false)
const currentStep = ref(0)

const title = ref('')
const description = ref('')
const priority = ref<Priority>('MEDIUM')
const deadline = ref('')
const deadlineTime = ref('')
const estimatedDuration = ref('60')

const isCreate = computed(() => props.mode === 'create')
const idPrefix = computed(() => isCreate.value ? 'create' : 'edit')
const currentConfig = computed(() => TASK_STEPS[currentStep.value])
const isLastStep = computed(() => currentStep.value === TASK_STEPS.length - 1)
const progress = computed(() => ((currentStep.value + 1) / TASK_STEPS.length) * 100)

const theme = computed(() => uiStore.state.theme || 'light')
const isDark = computed(() => theme.value === 'dark')

function getCurrentDateTime() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localNow = new Date(now.getTime() - offset * 60 * 1000)
  return {
    date: localNow.toISOString().slice(0, 10),
    time: localNow.toISOString().slice(11, 16),
  }
}

function initForm() {
  if (props.mode === 'edit' && props.task) {
    const deadlineDate = new Date(props.task.deadline)
    const year = deadlineDate.getFullYear()
    const month = String(deadlineDate.getMonth() + 1).padStart(2, '0')
    const day = String(deadlineDate.getDate()).padStart(2, '0')
    const hours = String(deadlineDate.getHours()).padStart(2, '0')
    const minutes = String(deadlineDate.getMinutes()).padStart(2, '0')

    title.value = props.task.title
    description.value = props.task.description || ''
    priority.value = props.task.priority as Priority
    deadline.value = `${year}-${month}-${day}`
    deadlineTime.value = `${hours}:${minutes}`
    estimatedDuration.value = String(props.task.estimatedDuration || 60)
  } else {
    const dt = getCurrentDateTime()
    title.value = ''
    description.value = ''
    priority.value = 'MEDIUM'
    deadline.value = dt.date
    deadlineTime.value = dt.time
    estimatedDuration.value = '60'
  }
  currentStep.value = 0
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initForm()
  }
}, { immediate: true })

const canContinue = computed(() => {
  switch (currentConfig.value.key) {
    case 'title':
      return title.value.trim().length > 0
    case 'duration':
      return (parseInt(estimatedDuration.value, 10) || 0) >= 5
    default:
      return true
  }
})

function goNext() {
  if (!canContinue.value) {
    if (currentConfig.value.key === 'title') {
      alert('Please enter a task title')
    } else if (currentConfig.value.key === 'duration') {
      alert('Duration must be at least 5 minutes')
    }
    return
  }
  currentStep.value = Math.min(currentStep.value + 1, TASK_STEPS.length - 1)
}

function goBack() {
  currentStep.value = Math.max(currentStep.value - 1, 0)
}

async function handleSubmit() {
  if (!isLastStep.value) {
    goNext()
    return
  }

  if (!title.value.trim()) {
    alert('Please enter a task title')
    return
  }

  if ((parseInt(estimatedDuration.value, 10) || 0) < 5) {
    alert('Duration must be at least 5 minutes')
    return
  }

  const payload = {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    priority: priority.value,
    deadline: new Date(`${deadline.value}T${deadlineTime.value}:00`).toISOString(),
    estimatedDuration: parseInt(estimatedDuration.value, 10) || 60,
  }

  try {
    isLoading.value = true

    if (isCreate.value) {
      await appStore.createTask(payload)
      emit('created')
    } else {
      if (props.task) {
        await appStore.updateTask(props.task.id, payload)
        emit('saved')
      }
    }
    emit('close')
  } catch (error) {
    console.error(`[task:${props.mode}] failed`, error)
    alert(`Failed to ${isCreate.value ? 'create' : 'update'} task. Please try again.`)
  } finally {
    isLoading.value = false
  }
}

// Calendar generation
const calendarDays = computed(() => {
  const date = new Date(deadline.value || new Date().toISOString().slice(0, 10))
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: { date: number; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean; isPast: boolean; disabled: boolean }[] = []
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const selectedDate = deadline.value
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    const prevDate = new Date(year, month, -firstDay.getDay() + i + 1)
    days.push({
      date: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isPast: true,
      disabled: true,
    })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    d.setHours(0, 0, 0, 0)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isPast = isCreate.value && d.getTime() < today.getTime()
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: d.getTime() === today.getTime(),
      isSelected: dateStr === selectedDate,
      isPast,
      disabled: isPast,
    })
  }
  
  return days
})

const calendarMonthYear = computed(() => {
  const date = new Date(deadline.value || new Date().toISOString().slice(0, 10))
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

function prevMonth() {
  const date = new Date(deadline.value)
  date.setMonth(date.getMonth() - 1)
  deadline.value = date.toISOString().slice(0, 10)
}

function nextMonth() {
  const date = new Date(deadline.value)
  date.setMonth(date.getMonth() + 1)
  deadline.value = date.toISOString().slice(0, 10)
}

function selectDate(day: typeof calendarDays.value[0]) {
  if (!day.isCurrentMonth || day.disabled) return
  const date = new Date(deadline.value)
  date.setDate(day.date)
  deadline.value = date.toISOString().slice(0, 10)
}

// Time slots
const timeSlots = computed(() => {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
})

function formatTimeDisplay(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="task-modal-portal-overlay"
      @click.self="emit('close')"
    >
      <div
        :class="[
          'task-modal-portal-content',
          isDark ? 'task-modal-dark' : 'task-modal-light'
        ]"
      >
        <!-- Header -->
        <div class="task-modal-header">
          <div class="task-modal-header-top">
            <div>
              <p class="task-modal-step-label">
                Step {{ currentStep + 1 }} of {{ TASK_STEPS.length }}
              </p>
              <h2 :class="['task-modal-title', isDark ? 'text-white' : 'text-gray-900']">
                {{ isCreate ? 'Create Task' : 'Edit Task' }}
              </h2>
            </div>
            <button
              class="task-modal-close-btn"
              :class="isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'"
              aria-label="Close modal"
              @click="emit('close')"
            >
              <X :size="20" />
            </button>
          </div>
          <div :class="['task-modal-progress-bar', isDark ? 'bg-gray-800' : 'bg-gray-200']">
            <div
              class="task-modal-progress-fill"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>

        <!-- Content -->
        <form @submit.prevent="handleSubmit" class="task-modal-form">
          <div class="task-modal-body">
            <div class="mb-5">
              <h3 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900']">
                {{ currentConfig.label }}
              </h3>
              <p :class="['mt-2 text-sm leading-6', isDark ? 'text-gray-400' : 'text-gray-600']">
                {{ currentConfig.helper }}
              </p>
            </div>

            <!-- Step: Title -->
            <div v-if="currentConfig.key === 'title'" class="space-y-4">
              <label
                :for="`${idPrefix}-title`"
                :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']"
              >
                Task Title <span class="text-red-500">*</span>
              </label>
              <input
                :id="`${idPrefix}-title`"
                v-model="title"
                type="text"
                placeholder="e.g., Finish project report"
                :class="[
                  'task-modal-input',
                  isDark ? 'task-modal-input-dark' : 'task-modal-input-light'
                ]"
                :disabled="isLoading"
                autofocus
              />
            </div>

            <!-- Step: Description -->
            <div v-else-if="currentConfig.key === 'description'" class="space-y-4">
              <label
                :for="`${idPrefix}-description`"
                :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']"
              >
                Description <span class="text-xs font-normal opacity-70">Optional</span>
              </label>
              <textarea
                :id="`${idPrefix}-description`"
                v-model="description"
                placeholder="Optional: add notes, context, or a quick reminder..."
                rows="5"
                :class="[
                  'task-modal-input task-modal-textarea',
                  isDark ? 'task-modal-input-dark' : 'task-modal-input-light'
                ]"
                :disabled="isLoading"
              />
            </div>

            <!-- Step: Date -->
            <div v-else-if="currentConfig.key === 'date'" class="space-y-4">
              <p :class="['text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']">
                Choose a date
              </p>
              <div class="task-modal-calendar">
                <div class="task-modal-calendar-header">
                  <button type="button" @click="prevMonth" class="task-modal-calendar-nav">
                    <ArrowLeft :size="16" />
                  </button>
                  <span :class="['font-semibold', isDark ? 'text-white' : 'text-gray-900']">
                    {{ calendarMonthYear }}
                  </span>
                  <button type="button" @click="nextMonth" class="task-modal-calendar-nav">
                    <ArrowRight :size="16" />
                  </button>
                </div>
                <div class="task-modal-calendar-grid">
                  <span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="task-modal-calendar-weekday">
                    {{ day }}
                  </span>
                  <button
                    v-for="(day, idx) in calendarDays"
                    :key="idx"
                    type="button"
                    @click="selectDate(day)"
                    :class="[
                      'task-modal-calendar-day',
                      !day.isCurrentMonth && 'task-modal-calendar-day-other',
                      day.isToday && 'task-modal-calendar-day-today',
                      day.isSelected && 'task-modal-calendar-day-selected',
                    ]"
                    :disabled="!day.isCurrentMonth"
                  >
                    {{ day.date }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Step: Time -->
            <div v-else-if="currentConfig.key === 'time'" class="space-y-4">
              <label
                :for="`${idPrefix}-time-input`"
                :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']"
              >
                Pick a time or enter manually (HH:MM)
              </label>
              <input
                :id="`${idPrefix}-time-input`"
                v-model="deadlineTime"
                type="time"
                :class="[
                  'task-modal-input mb-4',
                  isDark ? 'task-modal-input-dark' : 'task-modal-input-light'
                ]"
                :disabled="isLoading"
              />
              <p :class="['text-xs font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">
                Quick select:
              </p>
              <div class="task-modal-time-slots">
                <button
                  v-for="time in timeSlots"
                  :key="time"
                  type="button"
                  @click="deadlineTime = time"
                  :class="[
                    'task-modal-time-slot',
                    deadlineTime === time
                      ? 'task-modal-time-slot-selected'
                      : isDark
                        ? 'task-modal-time-slot-dark'
                        : 'task-modal-time-slot-light'
                  ]"
                  :disabled="isLoading"
                >
                  {{ formatTimeDisplay(time) }}
                </button>
              </div>
            </div>

            <!-- Step: Priority -->
            <div v-else-if="currentConfig.key === 'priority'" class="space-y-3">
              <button
                v-for="option in priorityOptions"
                :key="option.value"
                type="button"
                @click="priority = option.value"
                :class="[
                  'task-modal-priority-btn',
                  priority === option.value
                    ? 'task-modal-priority-btn-active'
                    : isDark
                      ? 'task-modal-priority-btn-dark'
                      : 'task-modal-priority-btn-light'
                ]"
                :disabled="isLoading"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold">{{ option.label }}</p>
                    <p
                      :class="[
                        'mt-1 text-sm',
                        priority === option.value ? 'text-white/80' : isDark ? 'text-gray-400' : 'text-gray-500'
                      ]"
                    >
                      {{ option.hint }}
                    </p>
                  </div>
                  <Check
                    v-if="priority === option.value"
                    :size="20"
                    class="mt-0.5 flex-shrink-0"
                    :stroke-width="2.5"
                  />
                </div>
              </button>
            </div>

            <!-- Step: Duration -->
            <div v-else-if="currentConfig.key === 'duration'" class="space-y-4">
              <label
                :for="`${idPrefix}-estimatedDuration`"
                :class="['block text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700']"
              >
                Duration (minutes)
              </label>
              <input
                :id="`${idPrefix}-estimatedDuration`"
                v-model="estimatedDuration"
                type="number"
                min="5"
                step="5"
                :class="[
                  'task-modal-input',
                  isDark ? 'task-modal-input-dark' : 'task-modal-input-light'
                ]"
                :disabled="isLoading"
              />
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="minutes in ['30', '60', '90']"
                  :key="minutes"
                  type="button"
                  @click="estimatedDuration = minutes"
                  :class="[
                    'task-modal-duration-quick',
                    estimatedDuration === minutes
                      ? 'task-modal-duration-quick-active'
                      : isDark
                        ? 'task-modal-duration-quick-dark'
                        : 'task-modal-duration-quick-light'
                  ]"
                >
                  {{ minutes }} min
                </button>
              </div>
            </div>

            <!-- Step: Review -->
            <div v-else-if="currentConfig.key === 'review'" class="space-y-3">
              <div
                v-for="item in [
                  { label: 'Task Title', value: title || '-' },
                  { label: 'Description', value: description || 'No description' },
                  { label: 'Date', value: deadline },
                  { label: 'Time', value: formatTimeDisplay(deadlineTime) },
                  { label: 'Priority', value: priority },
                  { label: 'Duration', value: `${estimatedDuration || '60'} min` },
                ]"
                :key="item.label"
                :class="[
                  'task-modal-review-item',
                  isDark ? 'task-modal-review-item-dark' : 'task-modal-review-item-light'
                ]"
              >
                <p :class="['text-xs font-semibold uppercase tracking-wide', isDark ? 'text-gray-400' : 'text-gray-500']">
                  {{ item.label }}
                </p>
                <p :class="['mt-1 text-sm', isDark ? 'text-white' : 'text-gray-900']">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div :class="['task-modal-footer', isDark ? 'task-modal-footer-dark' : 'task-modal-footer-light']">
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="currentStep === 0 ? emit('close') : goBack()"
                :disabled="isLoading"
                :class="[
                  'task-modal-btn-secondary',
                  isDark ? 'task-modal-btn-secondary-dark' : 'task-modal-btn-secondary-light',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                ]"
              >
                <ArrowLeft :size="16" :stroke-width="2.5" />
                {{ currentStep === 0 ? 'Cancel' : 'Back' }}
              </button>
              <button
                type="submit"
                :disabled="isLoading || !canContinue"
                class="task-modal-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <template v-if="isLoading">
                  <div class="task-modal-spinner" />
                  {{ isCreate ? 'Creating...' : 'Saving...' }}
                </template>
                <template v-else-if="isLastStep">
                  <Plus v-if="isCreate" :size="16" :stroke-width="2.5" />
                  <Save v-else :size="16" :stroke-width="2.5" />
                  {{ isCreate ? 'Create Task' : 'Save Changes' }}
                </template>
                <template v-else>
                  Continue
                  <ArrowRight :size="16" :stroke-width="2.5" />
                </template>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.task-modal-portal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

@media (min-width: 640px) {
  .task-modal-portal-overlay {
    align-items: center;
    padding: 1.5rem;
  }
}

.task-modal-portal-content {
  position: relative;
  width: 100%;
  max-width: 32rem;
  overflow: hidden;
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  transition: all 0.2s;
}

@media (min-width: 640px) {
  .task-modal-portal-content {
    border-radius: 1.5rem;
  }
}

.task-modal-dark {
  background: #111827;
  border: 1px solid #1f2937;
}

.task-modal-light {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.task-modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid;
}

.task-modal-dark .task-modal-header {
  border-color: #1f2937;
  background: rgba(3, 7, 17, 0.5);
}

.task-modal-light .task-modal-header {
  border-color: #e5e7eb;
  background: rgba(249, 250, 251, 0.8);
}

.task-modal-header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.task-modal-step-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.22em;
}

.task-modal-dark .task-modal-step-label {
  color: #9ca3af;
}

.task-modal-light .task-modal-step-label {
  color: #6b7280;
}

.task-modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.task-modal-close-btn {
  border-radius: 0.75rem;
  padding: 0.5rem;
  transition: background-color 0.2s;
}

.task-modal-progress-bar {
  height: 0.5rem;
  overflow: hidden;
  border-radius: 9999px;
}

.task-modal-progress-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  transition: width 0.3s;
}

.task-modal-form {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.task-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
}

.task-modal-input {
  width: 100%;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  border: 1px solid;
  outline: none;
}

.task-modal-input:focus {
  ring: 2px;
  ring-color: #3b82f6;
}

.task-modal-input-dark {
  background: #1f2937;
  border-color: #374151;
  color: #fff;
}

.task-modal-input-dark::placeholder {
  color: #9ca3af;
}

.task-modal-input-light {
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
}

.task-modal-input-light::placeholder {
  color: #9ca3af;
}

.task-modal-textarea {
  resize: none;
}

/* Calendar */
.task-modal-calendar {
  border-radius: 1rem;
  overflow: hidden;
}

.task-modal-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
}

.task-modal-calendar-nav {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.task-modal-dark .task-modal-calendar-nav {
  color: #9ca3af;
}

.task-modal-dark .task-modal-calendar-nav:hover {
  background: #374151;
}

.task-modal-light .task-modal-calendar-nav {
  color: #6b7280;
}

.task-modal-light .task-modal-calendar-nav:hover {
  background: #f3f4f6;
}

.task-modal-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  padding: 0 0.75rem 0.75rem;
}

.task-modal-calendar-weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem;
}

.task-modal-dark .task-modal-calendar-weekday {
  color: #9ca3af;
}

.task-modal-light .task-modal-calendar-weekday {
  color: #6b7280;
}

.task-modal-calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.task-modal-calendar-day:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.task-modal-calendar-day-other {
  opacity: 0.3;
}

.task-modal-calendar-day-today {
  font-weight: 700;
}

.task-modal-dark .task-modal-calendar-day {
  color: #e5e7eb;
}

.task-modal-dark .task-modal-calendar-day:hover:not(:disabled) {
  background: #374151;
}

.task-modal-dark .task-modal-calendar-day:disabled {
  color: #4b5563;
  text-decoration: line-through;
}

.task-modal-dark .task-modal-calendar-day-today {
  color: #60a5fa;
}

.task-modal-light .task-modal-calendar-day {
  color: #111827;
}

.task-modal-light .task-modal-calendar-day:hover:not(:disabled) {
  background: #f3f4f6;
}

.task-modal-light .task-modal-calendar-day:disabled {
  color: #d1d5db;
  text-decoration: line-through;
}

.task-modal-light .task-modal-calendar-day-today {
  color: #2563eb;
}

.task-modal-calendar-day-selected {
  background: #2563eb !important;
  color: white !important;
}

/* Time Slots */
.task-modal-time-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.25rem;
}

.task-modal-time-slot {
  padding: 0.75rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s;
  text-align: center;
}

.task-modal-time-slot-selected {
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  border-color: transparent;
}

.task-modal-time-slot-dark {
  background: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
}

.task-modal-time-slot-dark:hover:not(:disabled) {
  border-color: #4b5563;
}

.task-modal-time-slot-light {
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
}

.task-modal-time-slot-light:hover:not(:disabled) {
  border-color: #9ca3af;
}

/* Priority */
.task-modal-priority-btn {
  width: 100%;
  border-radius: 1rem;
  padding: 1rem;
  text-align: left;
  border: 1px solid;
  transition: all 0.2s;
}

.task-modal-priority-btn-active {
  border-color: #2563eb;
  background: #2563eb;
  color: white;
  box-shadow: 0 10px 15px -3px rgb(37 99 235 / 0.2);
}

.task-modal-priority-btn-dark {
  border-color: #374151;
  background: #1f2937;
  color: #e5e7eb;
}

.task-modal-priority-btn-dark:hover:not(:disabled) {
  border-color: #4b5563;
}

.task-modal-priority-btn-light {
  border-color: #d1d5db;
  background: #fff;
  color: #111827;
}

.task-modal-priority-btn-light:hover:not(:disabled) {
  border-color: #9ca3af;
}

/* Duration Quick Select */
.task-modal-duration-quick {
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s;
}

.task-modal-duration-quick-active {
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  border-color: transparent;
}

.task-modal-duration-quick-dark {
  border-color: #374151;
  background: #1f2937;
  color: #e5e7eb;
}

.task-modal-duration-quick-light {
  border-color: #d1d5db;
  background: #fff;
  color: #111827;
}

/* Review Card */
.task-modal-review-card {
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid;
}

.task-modal-review-card-dark {
  border-color: #1f2937;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8));
}

.task-modal-review-card-light {
  border-color: #e5e7eb;
  background: linear-gradient(135deg, #ffffff, #f9fafb);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.task-modal-review-header {
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid;
}

.task-modal-dark .task-modal-review-header {
  border-color: #374151;
}

.task-modal-light .task-modal-review-header {
  border-color: #e5e7eb;
}

.task-modal-review-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-modal-review-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-modal-review-row-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.task-modal-review-inline-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-modal-review-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.task-modal-review-value {
  font-size: 0.875rem;
  font-weight: 500;
  word-break: break-word;
}

.task-modal-review-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.task-modal-badge-high {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.task-modal-badge-medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.task-modal-badge-low {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

/* Footer */
.task-modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid;
}

.task-modal-footer-dark {
  border-color: #1f2937;
  background: rgba(3, 7, 17, 0.4);
}

.task-modal-footer-light {
  border-color: #e5e7eb;
  background: #fff;
}

.task-modal-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 3rem;
  flex: 1;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.task-modal-btn-secondary-dark {
  background: #1f2937;
  color: #e5e7eb;
}

.task-modal-btn-secondary-dark:hover:not(:disabled) {
  background: #374151;
}

.task-modal-btn-secondary-light {
  background: #f3f4f6;
  color: #111827;
}

.task-modal-btn-secondary-light:hover:not(:disabled) {
  background: #e5e7eb;
}

.task-modal-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 3rem;
  flex: 1;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  transition: all 0.2s;
}

.task-modal-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.task-modal-spinner {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid white;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.mb-5 {
  margin-bottom: 1.25rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
