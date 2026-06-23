<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AlertCircle, Calendar, CheckCircle2, Info, RefreshCw, Star, TrendingUp, Trophy, Zap } from '@lucide/vue'
import { appStore } from '../stores/app'

const loading = ref(true)
const error = ref('')

// Adaptive behavior from backend API
const adaptiveBehavior = computed(() => appStore.adaptiveBehavior)

const total = computed(() => {
  const stats = appStore.stats
  if (!stats) return 0
  return (stats.todo ?? 0) + (stats.inProgress ?? 0) + (stats.done ?? 0) + (stats.skipped ?? 0)
})

const done = computed(() => appStore.stats?.done ?? 0)
const pending = computed(() => (appStore.stats?.todo ?? 0) + (appStore.stats?.inProgress ?? 0))
const skipped = computed(() => appStore.stats?.skipped ?? 0)
const completionRate = computed(() => (total.value ? (done.value / total.value) * 100 : 0))
const skipRate = computed(() => (total.value ? (skipped.value / total.value) * 100 : 0))

// Level info map - frontend handles image/color based on level number
const levelInfo: Record<number, { name: string; color: string; description: string }> = {
  1: { name: 'Batu Rebahan', color: 'gray', description: 'Hampir tidak bergerak, task cuma dilihat doang' },
  2: { name: 'Siput Loading', color: 'amber', description: 'Ada niat, tapi progress lambat banget' },
  3: { name: 'Kucing Mager', color: 'orange', description: 'Mau produktif, tapi kasur lebih kuat' },
  4: { name: 'Panda Santuy', color: 'gray', description: 'Ada kerjaan selesai, tapi banyak jeda ngemil' },
  5: { name: 'Badak Si Pemalas', color: 'slate', description: 'Kuat sebenarnya, tapi susah mulai' },
  6: { name: 'Bebek Mulai Jalan', color: 'yellow', description: 'Sudah mulai konsisten, walau masih goyang' },
  7: { name: 'Kelinci Si Rajin', color: 'pink', description: 'Task mulai banyak selesai, ritme bagus' },
  8: { name: 'Semut Produktif', color: 'amber', description: 'Rapi, konsisten, dan jarang skip' },
  9: { name: 'Elang Fokus', color: 'purple', description: 'Fokus tinggi, prioritas jelas' },
  10: { name: 'Naga Deadline', color: 'red', description: 'Mode legenda, task tunduk semua' },
}

const colorMap: Record<string, string> = {
  gray: 'from-gray-400 to-gray-600',
  amber: 'from-amber-400 to-amber-600',
  orange: 'from-orange-400 to-orange-600',
  slate: 'from-slate-500 to-slate-700',
  yellow: 'from-yellow-400 to-yellow-600',
  pink: 'from-pink-400 to-pink-600',
  purple: 'from-purple-500 to-purple-700',
  red: 'from-red-500 to-red-700',
}

const animal = computed(() => {
  const behavior = adaptiveBehavior.value
  if (!behavior) return { name: 'Loading...', imagePath: '/leveling/1.webp', description: '', color: 'from-gray-400 to-gray-600' }
  const info = levelInfo[behavior.level] || levelInfo[1]
  return {
    name: info.name,
    imagePath: `/leveling/${behavior.level}.webp`,
    description: info.description,
    color: colorMap[info.color] || 'from-amber-400 to-amber-600',
  }
})

const levelNumber = computed(() => adaptiveBehavior.value?.level ?? 1)
const progressToNext = computed(() => adaptiveBehavior.value?.progressToNext ?? 0)

function formatShortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatWeekLabel(value: string) {
  return value.replace(/^M(\d{4})-W(\d+)$/, 'Minggu $2')
}

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    await Promise.all([
      appStore.loadStats(),
      appStore.loadDailyStats(30),
      appStore.loadWeeklyStats(12),
    ])
    // Load adaptive behavior from backend API
    await appStore.loadAdaptiveBehavior()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Gagal memuat data overview'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

// Computed for weekly chart points (with safety for empty data)
const weeklyChartPoints = computed(() => {
  const stats = appStore.weeklyStats
  if (!stats || stats.length === 0) return ''
  
  const max = Math.max(...stats.map(s => Number(s.completed) || 0), 1)
  const len = stats.length
  const divisor = len === 1 ? 1 : len - 1
  
  return stats.map((stat, idx) => {
    const x = (idx / divisor) * 100
    const y = 100 - ((Number(stat.completed) || 0) / max) * 100
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
})

const weeklyChartCircles = computed(() => {
  const stats = appStore.weeklyStats
  if (!stats || stats.length === 0) return []
  
  const max = Math.max(...stats.map(s => Number(s.completed) || 0), 1)
  const len = stats.length
  const divisor = len === 1 ? 1 : len - 1
  
  return stats.map((stat, idx) => ({
    cx: (idx / divisor) * 100,
    cy: 100 - ((Number(stat.completed) || 0) / max) * 100,
    week: stat.week
  }))
})
</script>

<template>
  <div class="overview-shell-next">
    <!-- Header -->
    <section class="overview-header-next">
      <div>
        <h1>Ringkasan</h1>
        <p>Insight produktivitas dan rekomendasi behavior untuk Anda</p>
      </div>
    </section>

    <!-- Error State -->
    <section v-if="error" class="overview-error-state">
      <AlertCircle :size="48" />
      <p class="error-message">{{ error }}</p>
      <button class="retry-button" @click="loadData">Coba Lagi</button>
    </section>

    <!-- Loading State -->
    <template v-else-if="loading">
      <section class="overview-content-next">
        <div class="overview-skeleton-grid">
          <div class="overview-skeleton-card" v-for="i in 3" :key="`stat-${i}`">
            <div class="skeleton-bar small"></div>
            <div class="skeleton-bar large"></div>
          </div>
        </div>
        <div class="overview-skeleton-hero"></div>
      </section>
    </template>

    <!-- Main Content -->
    <template v-else>
      <section class="overview-content-next">
        <!-- Behavior Analysis Section -->
        <template v-if="adaptiveBehavior">
          <!-- Animal Hero Section -->
          <article :class="['overview-animal-hero-next', `gradient-${animal.color}`]">
            <div class="animal-image-container">
              <img :src="animal.imagePath" :alt="animal.name" class="animal-image" />
            </div>
            <div class="animal-badge">
              <Trophy :size="20" />
              <span>Level {{ levelNumber }}</span>
            </div>
            <h2 class="animal-name">{{ animal.name }}</h2>
            <p class="animal-description">{{ animal.description }}</p>
          </article>

          <!-- Score Panel -->
          <article class="panel overview-score-panel-next">
            <div class="score-header">
              <div>
                <h3>Skor Produktivitas</h3>
                <p>{{ adaptiveBehavior.score }}/100</p>
              </div>
            </div>
            <div v-if="adaptiveBehavior?.insights?.length" class="score-insights">
              <div v-for="(insight, idx) in adaptiveBehavior.insights" :key="idx" class="insight-item">
                <span class="insight-dot"></span>
                <span>{{ insight }}</span>
              </div>
            </div>
          </article>

          <!-- Hero Image - Below Skor Produktivitas -->
          <article class="overview-hero-image-next">
            <img src="/opt-hero/3.webp" alt="Overview hero" />
          </article>

          <!-- Stats Cards - Below Skor Produktivitas -->
          <div class="overview-stats-compact">
            <div class="stat-mini-card">
              <span class="stat-mini-label">Total</span>
              <span class="stat-mini-value">{{ total }}</span>
            </div>
            <div class="stat-mini-card">
              <span class="stat-mini-label">Selesai</span>
              <span class="stat-mini-value">{{ done }}</span>
              <span class="stat-mini-sub">{{ completionRate.toFixed(0) }}%</span>
            </div>
            <div class="stat-mini-card">
              <span class="stat-mini-label">Tertunda</span>
              <span class="stat-mini-value">{{ pending }}</span>
              <span class="stat-mini-sub">{{ skipped }} skip</span>
            </div>
          </div>
        </template>

        <!-- Daily Chart -->
        <article class="panel overview-chart-next">
          <h3 class="chart-title">Penyelesaian Tugas Harian (30 Hari Terakhir)</h3>
          <div class="chart-placeholder">
            <div class="chart-bar-grid">
              <div
                v-for="(stat, idx) in appStore.dailyStats.slice(0, 30)"
                :key="stat.date"
                class="chart-bar-wrapper"
              >
                <div
                  class="chart-bar blue"
                  :style="{ height: `${Math.max(5, (Number(stat.completed) / Math.max(...appStore.dailyStats.map(s => Number(s.completed)), 1)) * 100)}%` }"
                  :title="`${formatShortDate(stat.date)}: ${stat.completed} tugas`"
                ></div>
                <span v-if="idx % 5 === 0 || idx === appStore.dailyStats.length - 1" class="chart-label">
                  {{ formatShortDate(stat.date) }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <!-- Weekly Chart -->
        <article class="panel overview-chart-next">
          <h3 class="chart-title">Tren Mingguan</h3>
          <div class="chart-placeholder">
            <div class="chart-line-grid" v-if="weeklyChartPoints">
              <svg class="chart-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  :points="weeklyChartPoints"
                  class="chart-line purple"
                />
                <circle
                  v-for="(circle, idx) in weeklyChartCircles"
                  :key="circle.week"
                  :cx="circle.cx.toFixed(2)"
                  :cy="circle.cy.toFixed(2)"
                  r="2"
                  class="chart-dot purple"
                />
              </svg>
            </div>
            <div v-else class="chart-empty">
              <p>Belum ada data mingguan</p>
            </div>
          </div>
        </article>

        <!-- Adaptive Behavior Advice Cards -->
        <section v-if="adaptiveBehavior?.advice?.length" class="overview-advice-section-next">
          <h3 class="section-title">Rekomendasi Behavior</h3>
          <div class="advice-grid">
            <article
              v-for="(card, idx) in adaptiveBehavior.advice"
              :key="idx"
              :class="['advice-card', card.type]"
            >
              <div class="advice-header">
                <CheckCircle2 v-if="card.type === 'success'" :size="20" />
                <AlertCircle v-else-if="card.type === 'warning'" :size="20" />
                <Info v-else :size="20" />
                <h4>{{ card.title }}</h4>
              </div>
              <p>{{ card.description }}</p>
            </article>
          </div>
        </section>

        <!-- Summary Section -->
        <article v-if="adaptiveBehavior" class="panel overview-summary-next">
          <div class="summary-header">
            <Star :size="20" />
            <h3>Ringkasan Level Anda</h3>
          </div>
          <div class="summary-grid">
            <img :src="animal.imagePath" :alt="animal.name" class="summary-avatar" />
            <div class="summary-info">
              <div class="summary-badges">
                <span class="level-badge">Level {{ levelNumber }}</span>
                <span class="score-text">Score: {{ adaptiveBehavior.score }}/100</span>
              </div>
              <h4 class="summary-name">{{ animal.name }}</h4>
              <p class="summary-description">{{ animal.description }}</p>
              <div v-if="adaptiveBehavior.score < 100" class="summary-progress">
                <div class="progress-label">
                  <span>Progress ke level berikutnya</span>
                  <span>{{ progressToNext }}/10</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: `${progressToNext * 10}%` }"></div>
                </div>
              </div>
            </div>
            <div class="summary-tip">
              <div class="tip-header">
                <Zap :size="16" />
                <span>Tips Level Up</span>
              </div>
              <p>
                {{
                  adaptiveBehavior.archetype === 'snail'
                    ? 'Coba mulai dengan 1-2 tugas kecil per hari untuk membangun kebiasaan!'
                    : adaptiveBehavior.archetype === 'dragon'
                      ? '模式 Legenda! Pertahankan momentum dan standar kualitas Anda.'
                      : 'Tingkatkan konsistensi secara bertahap untuk naik level.'
                }}
              </p>
            </div>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>
