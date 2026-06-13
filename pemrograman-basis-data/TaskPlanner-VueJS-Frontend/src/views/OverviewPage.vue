<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AlertCircle, Calendar, CheckCircle2, Info, RefreshCw, Sparkles, Star, TrendingUp, Trophy, Zap } from '@lucide/vue'
import AppHeader from '../components/AppHeader.vue'
import { appStore } from '../stores/app'

const loading = ref(true)
const aiLoading = ref(false)
const error = ref('')

const total = computed(() => appStore.stats?.total ?? 0)
const done = computed(() => appStore.stats?.done ?? 0)
const pending = computed(() => (appStore.stats?.todo ?? 0) + (appStore.stats?.inProgress ?? 0))
const skipped = computed(() => appStore.stats?.skipped ?? 0)
const completionRate = computed(() => (total.value ? (done.value / total.value) * 100 : 0))
const skipRate = computed(() => (total.value ? (skipped.value / total.value) * 100 : 0))

function getAnimalLevel(score: number) {
  if (score <= 10) return { name: 'Batu Rebahan', imagePath: '/leveling/1.webp', description: 'Hampir tidak bergerak, task cuma dilihat doang', color: 'stone' }
  if (score <= 20) return { name: 'Siput Loading', imagePath: '/leveling/2.webp', description: 'Ada niat, tapi progress lambat banget', color: 'amber' }
  if (score <= 30) return { name: 'Kucing Mager', imagePath: '/leveling/3.webp', description: 'Mau produktif, tapi kasur lebih kuat', color: 'orange' }
  if (score <= 40) return { name: 'Panda Santuy', imagePath: '/leveling/4.webp', description: 'Ada kerjaan selesai, tapi banyak jeda ngemil', color: 'slate' }
  if (score <= 50) return { name: 'Badak Si Pemalas', imagePath: '/leveling/5.webp', description: 'Kuat sebenarnya, tapi susah mulai', color: 'slate' }
  if (score <= 60) return { name: 'Bebek Mulai Jalan', imagePath: '/leveling/6.webp', description: 'Sudah mulai konsisten, walau masih goyang', color: 'yellow' }
  if (score <= 70) return { name: 'Kelinci Si Rajin', imagePath: '/leveling/7.webp', description: 'Task mulai banyak selesai, ritme bagus', color: 'pink' }
  if (score <= 80) return { name: 'Semut Produktif', imagePath: '/leveling/8.webp', description: 'Rapi, konsisten, dan jarang skip', color: 'amber' }
  if (score <= 90) return { name: 'Elang Fokus', imagePath: '/leveling/9.webp', description: 'Fokus tinggi, prioritas jelas', color: 'violet' }
  return { name: 'Naga Deadline', imagePath: '/leveling/10.webp', description: 'Mode legenda, task tunduk semua', color: 'red' }
}

const animal = computed(() => getAnimalLevel(appStore.analysis?.score ?? 0))
const progressToNext = computed(() => (appStore.analysis?.score ?? 0) % 10)
const dailyCompletedValues = computed(() => appStore.dailyStats.map((entry) => Number(entry.completed) || 0))
const weeklyCompletedValues = computed(() => appStore.weeklyStats.map((entry) => Number(entry.completed) || 0))
const maxDailyCompleted = computed(() => Math.max(1, ...dailyCompletedValues.value))
const maxWeeklyCompleted = computed(() => Math.max(1, ...weeklyCompletedValues.value))

function formatShortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatWeekLabel(value: string) {
  return value.replace(/^M(\d{4})-W(\d+)$/, 'W$2')
}

function buildLinePoints(values: number[], width = 100, height = 100) {
  if (!values.length) return ''
  const max = Math.max(...values, 1)
  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
      const y = height - (value / max) * height
      return `${x},${y}`
    })
    .join(' ')
}

function buildAreaPath(values: number[], width = 100, height = 100) {
  const points = buildLinePoints(values, width, height)
  if (!points) return ''
  return `M 0 ${height} L ${points} L ${width} ${height} Z`
}

const dailyLinePoints = computed(() => buildLinePoints(dailyCompletedValues.value))
const dailyAreaPath = computed(() => buildAreaPath(dailyCompletedValues.value))
const weeklyLinePoints = computed(() => buildLinePoints(weeklyCompletedValues.value))
const weeklyAreaPath = computed(() => buildAreaPath(weeklyCompletedValues.value))

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
  <div>
    <AppHeader />
    <main class="overview-shell">
      <section class="overview-header">
        <div>
          <h1>Ringkasan</h1>
          <p>Insight produktivitas dan rekomendasi AI untuk Anda.</p>
        </div>
        <button class="overview-refresh" @click="loadData">
          <RefreshCw :size="18" />
          <span>Segarkan</span>
        </button>
      </section>

      <section v-if="error" class="overview-error-card">
        <AlertCircle :size="20" />
        <div>
          <strong>Gagal memuat overview</strong>
          <p>{{ error }}</p>
        </div>
      </section>

      <template v-else>
        <section class="overview-stats-grid">
          <article class="overview-stat-card">
            <div class="overview-stat-head">
              <span>Total Tugas</span>
              <Calendar :size="18" />
            </div>
            <strong>{{ total }}</strong>
          </article>

          <article class="overview-stat-card">
            <div class="overview-stat-head">
              <span>Selesai</span>
              <CheckCircle2 :size="18" />
            </div>
            <strong>{{ done }}</strong>
            <small>{{ completionRate.toFixed(1) }}% tingkat penyelesaian</small>
          </article>

          <article class="overview-stat-card">
            <div class="overview-stat-head">
              <span>Tertunda</span>
              <TrendingUp :size="18" />
            </div>
            <strong>{{ pending }}</strong>
            <small>{{ skipped }} dilewati ({{ skipRate.toFixed(1) }}%)</small>
          </article>
        </section>

        <section v-if="aiLoading" class="overview-ai-loading">
          <Sparkles :size="18" />
          <span>Memuat analisis AI...</span>
        </section>

        <template v-else-if="appStore.analysis">
          <section :class="['overview-animal-hero', `tone-${animal.color}`]">
            <div class="overview-animal-media">
              <img :src="animal.imagePath" :alt="animal.name" />
            </div>
            <div class="overview-animal-copy">
              <div class="overview-animal-kicker">
                <Trophy :size="16" />
                <span>Level Hari Ini</span>
              </div>
              <h2>{{ animal.name }}</h2>
              <p>{{ animal.description }}</p>
            </div>
          </section>

          <section class="overview-score-card panel">
            <div class="overview-score-head">
              <div>
                <h2>Skor Produktivitas AI</h2>
                <p>Berdasarkan aktivitas terbaru Anda</p>
              </div>
              <div class="overview-score-ring">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="46" class="ring-track" />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    class="ring-progress"
                    :stroke-dasharray="2 * Math.PI * 46"
                    :stroke-dashoffset="2 * Math.PI * 46 * (1 - (appStore.analysis.score / 100))"
                  />
                </svg>
                <strong>{{ appStore.analysis.score }}</strong>
              </div>
            </div>

            <div class="overview-insight-list">
              <div v-for="insight in appStore.analysis.insights" :key="insight" class="overview-insight-item">
                <span class="dot"></span>
                <span>{{ insight }}</span>
              </div>
            </div>
          </section>

          <section class="overview-hero-image panel">
            <img src="/opt-hero/3.png" alt="Overview hero" />
          </section>

          <section class="overview-chart-grid">
            <article class="panel overview-chart-card">
              <div class="overview-chart-head">
                <div>
                  <h2>Penyelesaian Tugas Harian (30 Hari Terakhir)</h2>
                  <p>Grafik garis ringkas untuk membaca tren harian dengan lebih jelas.</p>
                </div>
                <strong class="overview-chart-total">Max {{ maxDailyCompleted }}</strong>
              </div>
              <div class="overview-chart-surface">
                <svg class="overview-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="dailyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.35" />
                      <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.04" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="100" x2="100" y2="100" class="overview-chart-axis" />
                  <path :d="dailyAreaPath" fill="url(#dailyAreaGradient)" />
                  <polyline :points="dailyLinePoints" class="overview-chart-line daily" />
                </svg>
                <div class="overview-chart-points">
                  <div
                    v-for="(item, index) in appStore.dailyStats"
                    :key="item.date"
                    class="overview-chart-point"
                    :style="{
                      left: `${appStore.dailyStats.length === 1 ? 50 : (index / (appStore.dailyStats.length - 1)) * 100}%`,
                      top: `${100 - ((Number(item.completed) || 0) / maxDailyCompleted) * 100}%`
                    }"
                    :title="`${formatShortDate(item.date)} • ${item.completed} tugas`"
                  ></div>
                </div>
              </div>
              <div class="overview-chart-labels compact">
                <span
                  v-for="(item, index) in appStore.dailyStats"
                  :key="`${item.date}-label`"
                  :class="{ hidden: index % 5 !== 0 && index !== appStore.dailyStats.length - 1 }"
                >
                  {{ formatShortDate(item.date) }}
                </span>
              </div>
            </article>

            <article class="panel overview-chart-card">
              <div class="overview-chart-head">
                <div>
                  <h2>Tren Penyelesaian Mingguan (12 Minggu Terakhir)</h2>
                  <p>Versi line chart agar terbaca rapi di desktop maupun mobile.</p>
                </div>
                <strong class="overview-chart-total">Max {{ maxWeeklyCompleted }}</strong>
              </div>
              <div class="overview-chart-surface weekly">
                <svg class="overview-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="weeklyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.04" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="100" x2="100" y2="100" class="overview-chart-axis" />
                  <path :d="weeklyAreaPath" fill="url(#weeklyAreaGradient)" />
                  <polyline :points="weeklyLinePoints" class="overview-chart-line weekly" />
                </svg>
                <div class="overview-chart-points">
                  <div
                    v-for="(item, index) in appStore.weeklyStats"
                    :key="item.week"
                    class="overview-chart-point weekly"
                    :style="{
                      left: `${appStore.weeklyStats.length === 1 ? 50 : (index / (appStore.weeklyStats.length - 1)) * 100}%`,
                      top: `${100 - ((Number(item.completed) || 0) / maxWeeklyCompleted) * 100}%`
                    }"
                    :title="`${formatWeekLabel(item.week)} • ${item.completed} tugas`"
                  ></div>
                </div>
              </div>
              <div class="overview-chart-labels">
                <span
                  v-for="(item, index) in appStore.weeklyStats"
                  :key="`${item.week}-label`"
                  :class="{ hidden: index % 2 !== 0 && index !== appStore.weeklyStats.length - 1 }"
                >
                  {{ formatWeekLabel(item.week) }}
                </span>
              </div>
            </article>
          </section>

          <section v-if="appStore.analysis.advice.length" class="overview-advice-section">
            <div class="overview-section-title">
              <h2>Rekomendasi AI</h2>
            </div>
            <div class="overview-advice-grid">
              <article
                v-for="item in appStore.analysis.advice"
                :key="`${item.type}-${item.title}`"
                :class="['overview-advice-card', item.type]"
              >
                <div class="overview-advice-head">
                  <CheckCircle2 v-if="item.type === 'success'" :size="18" />
                  <AlertCircle v-else-if="item.type === 'warning'" :size="18" />
                  <Info v-else :size="18" />
                  <h3>{{ item.title }}</h3>
                </div>
                <p>{{ item.description }}</p>
              </article>
            </div>
          </section>

          <section class="panel overview-summary-card">
            <div class="overview-summary-title">
              <Star :size="18" />
              <h2>Ringkasan Level Anda</h2>
            </div>
            <div class="overview-summary-grid">
              <img :src="animal.imagePath" :alt="animal.name" class="overview-summary-image" />
              <div class="overview-summary-copy">
                <div class="overview-summary-badges">
                  <span class="badge">Level {{ Math.floor((appStore.analysis.score ?? 0) / 10) + 1 }}</span>
                  <span class="overview-score-inline">Score: {{ appStore.analysis.score }}/100</span>
                </div>
                <h3>{{ animal.name }}</h3>
                <p>{{ animal.description }}</p>
                <div class="overview-progress">
                  <div class="overview-progress-head">
                    <span>Progress ke level berikutnya</span>
                    <span>{{ progressToNext }}/10</span>
                  </div>
                  <div class="overview-progress-track">
                    <div class="overview-progress-fill" :style="{ width: `${progressToNext * 10}%` }"></div>
                  </div>
                </div>
              </div>
              <div class="overview-tip-card">
                <div class="overview-tip-head">
                  <Zap :size="16" />
                  <span>Tips Level Up</span>
                </div>
                <p>
                  {{ appStore.analysis.score <= 30
                    ? 'Coba selesaikan 1 task kecil dulu setiap hari!'
                    : appStore.analysis.score <= 60
                      ? 'Tingkatkan konsistensi dengan menyelesaikan lebih banyak task.'
                      : appStore.analysis.score <= 80
                        ? 'Pertahankan ritme dan fokus pada task prioritas!'
                        : 'Hampir sempurna! Jaga fokus dan hindari menunda.' }}
                </p>
              </div>
            </div>
          </section>
        </template>
      </template>
    </main>
  </div>
</template>
