'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { taskApi, aiApi, type DailyStat, type WeeklyStat, type OverviewAnalysis, type TaskStats } from '@/lib/api/client'
import { TrendingUp, Calendar, CheckCircle2, AlertCircle, Info, Loader2, RefreshCw } from 'lucide-react'

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
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Skor Produktivitas AI</h2>
                <p className="text-blue-100 text-sm mt-1">Berdasarkan aktivitas terbaru Anda</p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.score / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{analysis.score}</span>
                </div>
              </div>
            </div>

            {/* Insights */}
            {analysis.insights.length > 0 && (
              <div className="space-y-2">
                {analysis.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-blue-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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
      </div>
    </div>
  )
}
