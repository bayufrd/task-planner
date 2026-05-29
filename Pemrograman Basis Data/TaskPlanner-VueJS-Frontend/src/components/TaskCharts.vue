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
  labels: ['Pending', 'Done', 'Skipped'],
  datasets: [{
    data: [(props.stats?.todo || 0) + (props.stats?.inProgress || 0), props.stats?.done || 0, props.stats?.skipped || 0],
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

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  layout: {
    padding: 0,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
      labels: {
        boxWidth: 8,
        boxHeight: 8,
        padding: 8,
        usePointStyle: true,
        pointStyle: 'circle' as const,
        font: {
          size: 10,
        },
      },
    },
  },
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
      labels: {
        boxWidth: 8,
        boxHeight: 8,
        padding: 8,
        usePointStyle: true,
        pointStyle: 'circle' as const,
        font: {
          size: 10,
        },
      },
    },
  },
}
</script>

<template>
  <section class="charts-grid dashboard-chart-stack">
    <article class="panel chart-panel chart-panel-featured">
      <div class="chart-panel-head">
        <div>
          <span class="chart-kicker">Overview</span>
          <h2>Status distribution</h2>
          <p>Current task balance across pending, done, and skipped states.</p>
        </div>
      </div>
      <div class="chart-box chart-box-doughnut"><Doughnut :data="doughnutData" :options="doughnutOptions" /></div>
    </article>
    <article class="panel chart-panel chart-panel-activity">
      <div class="chart-panel-head">
        <div>
          <span class="chart-kicker">Progress</span>
          <h2>Daily activity</h2>
          <p>Compare created tasks with completed work in the latest period.</p>
        </div>
      </div>
      <div class="chart-box chart-box-bar"><Bar :data="barData" :options="barOptions" /></div>
    </article>
  </section>
</template>
