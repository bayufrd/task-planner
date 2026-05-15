'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { taskApi, aiApi, type DailyStat, type WeeklyStat, type OverviewAnalysis, type TaskStats } from '@/lib/api/client'
import { TrendingUp, Calendar, CheckCircle2, AlertCircle, Info, Loader2, RefreshCw, Trophy, Star, Zap } from 'lucide-react'

// Animal Level System based on AI score
interface AnimalLevel {
  name: string
  imagePath: string
  description: string
  color: string
}

const getAnimalLevel = (score: number): AnimalLevel => {
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

// Skeleton component
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`} />
  )
}

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([])
  const [analysis, setAnalysis] = useState<OverviewAnalysis | null>(null)

  useEffect(() => {
    loadTaskData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTaskData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch task data only
      const [statsRes, dailyRes, weeklyRes] = await Promise.all([
        taskApi.getStats(),
        taskApi.getDailyStats(30),
        taskApi.getWeeklyStats(12)
      ])

      if (!statsRes.success || !dailyRes.success || !weeklyRes.success) {
        throw new Error('Gagal memuat data tugas')
      }

      setStats(statsRes.data!)
      setDailyStats(dailyRes.data!)
      setWeeklyStats(weeklyRes.data!)

      // Fetch AI analysis separately after task data loads
      loadAiAnalysis(statsRes.data!, dailyRes.data!)
    } catch (err) {
      console.error('Error loading overview:', err)
      setError(err instanceof Error ? err.message : 'Gagal memuat data overview')
    } finally {
      setLoading(false)
    }
  }

  const loadAiAnalysis = async (taskStats: TaskStats, daily: DailyStat[]) => {
    try {
      setAiLoading(true)
      const analysisRes = await aiApi.analyzeOverview(taskStats, daily)
      if (analysisRes.success && analysisRes.data) {
        setAnalysis(analysisRes.data)
      }
    } catch (err) {
      console.error('Error loading AI analysis:', err)
    } finally {
      setAiLoading(false)
    }
  }

  const refreshAi = async () => {
    if (stats && dailyStats.length > 0) {
      await loadAiAnalysis(stats, dailyStats)
    }
  }

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-16" />
              </div>
            ))}
          </div>

          {/* AI Score Skeleton */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          {/* Charts Skeleton */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-72 w-full" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadTaskData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const total = stats ? stats.pending + stats.done + stats.skipped : 0
  const completionRate = total > 0 ? (stats!.done / total) * 100 : 0
  const skipRate = total > 0 ? (stats!.skipped / total) * 100 : 0

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Ringkasan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Insight produktivitas dan rekomendasi AI untuk Anda
            </p>
          </div>
          <button
            onClick={loadTaskData}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Segarkan"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Total Tugas</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{total}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Selesai</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.done || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {completionRate.toFixed(1)}% tingkat penyelesaian
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Tertunda</span>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.pending || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats?.skipped || 0} dilewati ({skipRate.toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* AI Productivity Score */}
        {aiLoading ? (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">Memuat analisis AI...</span>
            </div>
          </div>
        ) : analysis ? (
          (() => {
            const animal = getAnimalLevel(analysis.score)
            return (
              <div className="space-y-4">
                {/* Animal Hero Section - Separate Panel */}
                <div className={`bg-gradient-to-br ${animal.color} rounded-xl p-8 text-white`}>
                  <div className="flex flex-col items-center text-center">
                    {/* Large Centered Animal Image */}
                    <div className="mb-4">
                      <img
                        src={animal.imagePath}
                        alt={animal.name}
                        className="w-64 h-64 object-contain rounded-2xl border-4 border-white/30 shadow-2xl"
                      />
                    </div>
                    
                    {/* Level Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm font-medium text-blue-100">Level Hari Ini</span>
                    </div>
                    
                    {/* Animal Name */}
                    <h2 className="text-3xl font-bold mb-2">{animal.name}</h2>
                    <p className="text-blue-50 text-sm max-w-md">{animal.description}</p>
                  </div>
                </div>

                {/* Score Panel - Separate */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skor Produktivitas AI</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Berdasarkan aktivitas terbaru Anda</p>
                    </div>
                    <div className="relative w-24 h-24">
                      <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(59, 130, 246, 0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.score / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.score}</span>
                      </div>
                    </div>
                  </div>

                  {/* Insights */}
                  {analysis.insights.length > 0 && (
                    <div className="space-y-2">
                      {analysis.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })()
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">Klik untuk memuat analisis AI</p>
              <button
                onClick={refreshAi}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Muat AI
              </button>
            </div>
          </div>
        )}

        {/* Daily Completion Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Penyelesaian Tugas Harian (30 Hari Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Completion Trend */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Tren Penyelesaian Mingguan (12 Minggu Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis
                dataKey="week"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value) => `Minggu ${value}`}
              />
              <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                labelFormatter={(value) => `Minggu ${value}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Advice Cards */}
        {analysis && analysis.advice.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Rekomendasi AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.advice.map((card, idx) => {
                const Icon = card.type === 'success' ? CheckCircle2 : card.type === 'warning' ? AlertCircle : Info
                const colorClasses = {
                  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                  warning: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
                  info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                }
                const iconColorClasses = {
                  success: 'text-green-600 dark:text-green-400',
                  warning: 'text-orange-600 dark:text-orange-400',
                  info: 'text-blue-600 dark:text-blue-400'
                }

                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-5 border ${colorClasses[card.type as keyof typeof colorClasses]}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColorClasses[card.type as keyof typeof iconColorClasses]}`} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary - Animal Level Summary */}
        {analysis && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Ringkasan Level Anda
              </h2>
            </div>
            
            {(() => {
              const animal = getAnimalLevel(analysis.score)
              const levelNumber = Math.floor(analysis.score / 10) + 1
              
              return (
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Animal Avatar */}
                  <img
                    src={animal.imagePath}
                    alt={animal.name}
                    className="w-48 h-48 object-contain rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-lg"
                  />
                  
                  {/* Level Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                        Level {levelNumber}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Score: {analysis.score}/100
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {animal.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {animal.description}
                    </p>
                    
                    {/* Progress to next level */}
                    {analysis.score < 100 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Progress ke level berikutnya</span>
                          <span>{analysis.score % 10}/10</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${animal.color} rounded-full transition-all duration-500`}
                            style={{ width: `${(analysis.score % 10) * 10}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Tips for next level */}
                  <div className="w-full md:w-48 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                        Tips Level Up
                      </span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-300">
                      {analysis.score <= 30
                        ? 'Coba selesaikan 1 task kecil dulu setiap hari!'
                        : analysis.score <= 60
                        ? 'Tingkatkan konsistensi dengan menyelesaikan lebih banyak task.'
                        : analysis.score <= 80
                        ? 'Pertahankan ritme dan fokus pada task prioritas!'
                        : 'Hampir sempurna! Jaga fokus dan hindari menunda.'}
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
