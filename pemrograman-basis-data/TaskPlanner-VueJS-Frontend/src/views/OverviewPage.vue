<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AlertCircle, Calendar, CheckCircle2, Info, Loader2, RefreshCw, Star, TrendingUp, Trophy, Zap } from '@lucide/vue'
import { appStore } from '../stores/app'

const loading = ref(true)
const aiLoading = ref(false)
const error = ref('')

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

function getAnimalLevel(score: number) {
  if (score <= 10) return { name: 'Batu Rebahan', imagePath: '/leveling/1.webp', description: 'Hampir tidak bergerak, task cuma dilihat doang', color: 'from-gray-400 to-gray-600' }
  if (score <= 20) return { name: 'Siput Loading', imagePath: '/leveling/2.webp', description: 'Ada niat, tapi progress lambat banget', color: 'from-amber-400 to-amber-600' }
  if (score <= 30) return { name: 'Kucing Mager', imagePath: '/leveling/3.webp', description: 'Mau produktif, tapi kasur lebih kuat', color: 'from-orange-400 to-orange-600' }
  if (score <= 40) return { name: 'Panda Santuy', imagePath: '/leveling/4.webp', description: 'Ada kerjaan selesai, tapi banyak jeda ngemil', color: 'from-gray-500 to-gray-700' }
  if (score <= 50) return { name: 'Badak Si Pemalas', imagePath: '/leveling/5.webp', description: 'Kuat sebenarnya, tapi susah mulai', color: 'from-slate-500 to-slate-700' }
  if (score <= 60) return { name: 'Bebek Mulai Jalan', imagePath: '/leveling/6.webp', description: 'Sudah mulai konsisten, walau masih goyang', color: 'from-yellow-400 to-yellow-600' }
  if (score <= 70) return { name: 'Kelinci Si Rajin', imagePath: '/leveling/7.webp', description: 'Task mulai banyak selesai, ritme bagus', color: 'from-pink-400 to-pink-600' }
  if (score <= 80) return { name: 'Semut Produktif', imagePath: '/leveling/8.webp', description: 'Rapi, konsisten, dan jarang skip', color: 'from-amber-600 to-amber-800' }
  if (score <= 90) return { name: 'Elang Fokus', imagePath: '/leveling/9.webp', description: 'Fokus tinggi, prioritas jelas', color: 'from-purple-500 to-purple-700' }
  return { name: 'Naga Deadline', imagePath: '/leveling/10.webp', description: 'Mode legenda, task tunduk semua', color: 'from-red-500 to-red-700' }
}

const animal = computed(() => getAnimalLevel(appStore.analysis?.score ?? 0))
const levelNumber = computed(() => Math.floor((appStore.analysis?.score ?? 0) / 10) + 1)
const progressToNext = computed(() => (appStore.analysis?.score ?? 0) % 10)

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
    await refreshAi()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Gagal memuat data overview'
  } finally {
    loading.value = false
  }
}

async function refreshAi() {
  if (!appStore.stats || !appStore.dailyStats.length) return
  aiLoading.value = true
  try {
    await appStore.generateAnalysis()
  } finally {
    aiLoading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="overview-shell-next">
    <!-- Header -->
    <section class="overview-header-next">
      <div>
        <h1>Ringkasan</h1>
        <p>Insight produktivitas dan rekomendasi AI untuk Anda</p>
      </div>
      <button class="overview-refresh-button" @click="loadData" title="Segarkan">
        <RefreshCw :size="20" />
      </button>
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
        <!-- Stats Cards -->
        <div class="overview-stats-grid-next">
          <article class="overview-stat-card-next">
            <div class="stat-header">
              <span>Total Tugas</span>
              <Calendar :size="20" class="stat-icon blue" />
            </div>
            <p class="stat-value">{{ total }}</p>
          </article>

          <article class="overview-stat-card-next">
            <div class="stat-header">
              <span>Selesai</span>
              <CheckCircle2 :size="20" class="stat-icon green" />
            </div>
            <p class="stat-value">{{ done }}</p>
            <p class="stat-note">{{ completionRate.toFixed(1) }}% tingkat penyelesaian</p>
          </article>

          <article class="overview-stat-card-next">
            <div class="stat-header">
              <span>Tertunda</span>
              <TrendingUp :size="20" class="stat-icon orange" />
            </div>
            <p class="stat-value">{{ pending }}</p>
            <p class="stat-note">{{ skipped }} dilewati ({{ skipRate.toFixed(1) }}%)</p>
          </article>
        </div>

        <!-- AI Loading or Analysis -->
        <div v-if="aiLoading" class="overview-ai-loading-next">
          <Loader2 :size="24" class="spinner" />
          <span>Memuat analisis AI...</span>
        </div>

        <template v-else-if="appStore.analysis">
          <!-- Animal Hero Section -->
          <article :class="['overview-animal-hero-next', `gradient-${animal.color}`]">
            <div class="animal-image-container">
              <img :src="animal.imagePath" :alt="animal.name" class="animal-image" />
            </div>
            <div class="animal-badge">
              <Trophy :size="20" />
              <span>Level Hari Ini</span>
            </div>
            <h2 class="animal-name">{{ animal.name }}</h2>
            <p class="animal-description">{{ animal.description }}</p>
          </article>

          <!-- Score Panel -->
          <article class="panel overview-score-panel-next">
            <div class="score-header">
              <div>
                <h3>Skor Produktivitas AI</h3>
                <p>Berdasarkan aktivitas terbaru Anda</p>
              </div>
              <div class="score-ring-container">
                <svg class="score-ring" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" class="ring-track" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    class="ring-progress"
                    :stroke-dasharray="2 * Math.PI * 40"
                    :stroke-dashoffset="2 * Math.PI * 40 * (1 - (appStore.analysis.score / 100))"
                  />
                </svg>
                <span class="score-value">{{ appStore.analysis.score }}</span>
              </div>
            </div>
            <div v-if="appStore.analysis.insights.length" class="score-insights">
              <div v-for="(insight, idx) in appStore.analysis.insights" :key="idx" class="insight-item">
                <span class="insight-dot"></span>
                <span>{{ insight }}</span>
              </div>
            </div>
          </article>
        </template>

        <div v-else class="overview-ai-prompt">
          <p>Klik untuk memuat analisis AI</p>
          <button @click="refreshAi" class="load-ai-button">
            <RefreshCw :size="16" />
            Muat AI
          </button>
        </div>

        <!-- Hero Image -->
        <article class="overview-hero-image-next">
          <img src="/opt-hero/3.png" alt="Overview hero" />
        </article>

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
          <h3 class="chart-title">Tren Penyelesaian Mingguan (12 Minggu Terakhir)</h3>
          <div class="chart-placeholder">
            <div class="chart-line-grid">
              <svg class="chart-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  :points="appStore.weeklyStats.map((stat, idx) => {
                    const x = appStore.weeklyStats.length === 1 ? 50 : (idx / (appStore.weeklyStats.length - 1)) * 100
                    const max = Math.max(...appStore.weeklyStats.map(s => Number(s.completed)), 1)
                    const y = 100 - ((Number(stat.completed) / max) * 100)
                    return `${x},${y}`
                  }).join(' ')"
                  class="chart-line purple"
                />
                <circle
                  v-for="(stat, idx) in appStore.weeklyStats"
                  :key="stat.week"
                  :cx="appStore.weeklyStats.length === 1 ? 50 : (idx / (appStore.weeklyStats.length - 1)) * 100"
                  :cy="100 - ((Number(stat.completed) / Math.max(...appStore.weeklyStats.map(s => Number(s.completed)), 1)) * 100)"
                  r="2"
                  class="chart-dot purple"
                />
              </svg>
              <div class="chart-labels">
                <span
                  v-for="(stat, idx) in appStore.weeklyStats"
                  :key="`label-${stat.week}`"
                  v-show="idx % 2 === 0 || idx === appStore.weeklyStats.length - 1"
                >
                  {{ formatWeekLabel(stat.week) }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <!-- AI Advice Cards -->
        <section v-if="appStore.analysis && appStore.analysis.advice.length" class="overview-advice-section-next">
          <h3 class="section-title">Rekomendasi AI</h3>
          <div class="advice-grid">
            <article
              v-for="(card, idx) in appStore.analysis.advice"
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
        <article v-if="appStore.analysis" class="panel overview-summary-next">
          <div class="summary-header">
            <Star :size="20" />
            <h3>Ringkasan Level Anda</h3>
          </div>
          <div class="summary-grid">
            <img :src="animal.imagePath" :alt="animal.name" class="summary-avatar" />
            <div class="summary-info">
              <div class="summary-badges">
                <span class="level-badge">Level {{ levelNumber }}</span>
                <span class="score-text">Score: {{ appStore.analysis.score }}/100</span>
              </div>
              <h4 class="summary-name">{{ animal.name }}</h4>
              <p class="summary-description">{{ animal.description }}</p>
              <div v-if="appStore.analysis.score < 100" class="summary-progress">
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
                  appStore.analysis.score <= 30
                    ? 'Coba selesaikan 1 task kecil dulu setiap hari!'
                    : appStore.analysis.score <= 60
                      ? 'Tingkatkan konsistensi dengan menyelesaikan lebih banyak task.'
                      : appStore.analysis.score <= 80
                        ? 'Pertahankan ritme dan fokus pada task prioritas!'
                        : 'Hampir sempurna! Jaga fokus dan hindari menunda.'
                }}
              </p>
            </div>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>
