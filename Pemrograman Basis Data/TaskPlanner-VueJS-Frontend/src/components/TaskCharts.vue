<script setup lang="ts">
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import type { DailyStatsItem, TaskStats } from '../types'

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

const props = defineProps<{ stats: TaskStats | null; daily: DailyStatsItem[] }>()

const doughnutData = computed(() => ({
  labels: ['To do', 'In progress', 'Done', 'Skipped'],
  datasets: [{
    data: [props.stats?.todo || 0, props.stats?.inProgress || 0, props.stats?.done || 0, props.stats?.skipped || 0],
    backgroundColor: ['#2563eb', '#7c3aed', '#10b981', '#94a3b8'],
    borderWidth: 0,
  }],
}))

const barData = computed(() => ({
  labels: props.daily.map((item) => item.date),
  datasets: [
    { label: 'Created', data: props.daily.map((item) => item.created), backgroundColor: '#2563eb' },
    { label: 'Completed', data: props.daily.map((item) => item.completed), backgroundColor: '#10b981' },
  ],
}))

const options = { responsive: true, maintainAspectRatio: false }
</script>

<template>
  <section class="charts-grid">
    <article class="panel chart-panel">
      <h2>Status distribution</h2>
      <div class="chart-box"><Doughnut :data="doughnutData" :options="options" /></div>
    </article>
    <article class="panel chart-panel">
      <h2>Daily activity</h2>
      <div class="chart-box"><Bar :data="barData" :options="options" /></div>
    </article>
  </section>
</template>
