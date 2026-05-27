<script setup lang="ts">
import type { Task } from '../types'
import { formatDateTime } from '../utils/format'

defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{
  edit: [task: Task]
  complete: [id: string]
  skip: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <section class="panel">
    <div class="section-header">
      <div>
        <h2>Task list</h2>
        <p>Manage current tasks using the Java backend API.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Deadline</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>
              <div class="table-title">{{ task.title }}</div>
              <small>{{ task.description || 'No description' }}</small>
            </td>
            <td><span class="badge">{{ task.status }}</span></td>
            <td><span :class="['badge', task.priority.toLowerCase()]">{{ task.priority }}</span></td>
            <td>{{ formatDateTime(task.deadline) }}</td>
            <td>{{ task.estimatedDuration || 0 }} min</td>
            <td>
              <div class="action-row">
                <button class="ghost-button" @click="emit('edit', task)">Edit</button>
                <button class="ghost-button" @click="emit('complete', task.id)">Done</button>
                <button class="ghost-button" @click="emit('skip', task.id)">Skip</button>
                <button class="danger-button" @click="emit('remove', task.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
