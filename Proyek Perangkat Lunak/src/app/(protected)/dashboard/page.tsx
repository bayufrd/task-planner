'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTaskStore } from '@/lib/utils/store'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useCommandPalette } from '@/components/providers/CommandPaletteProvider'
import { useNotification } from '@/lib/hooks/useNotification'
import { API_ROUTES } from '@/lib/constants/api'
import CalendarTimeline from '@/components/calendar/CalendarTimeline'
import TaskPriorityList from '@/components/tasks/TaskPriorityList'
import CommandPalette from '@/components/command/CommandPalette'
import NewTaskModal from '@/components/tasks/NewTaskModal'
import { Plus, Command, CheckSquare2, Clock, CheckCircle2, XCircle } from 'lucide-react'

// Stats type definition
interface TaskStats {
  pending: number
  done: number
  skipped: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const { tasks, setTasks } = useTaskStore()
  const { t } = useLanguage()
  const { isOpen, open, close } = useCommandPalette()
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(true)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [stats, setStats] = useState<TaskStats>({ pending: 0, done: 0, skipped: 0 })

  // Load task stats from backend
  const loadStats = async () => {
    const token = localStorage.getItem('token')
    const hasNextAuthSession = !!session?.user?.id
    if (!hasNextAuthSession && !token) return

    try {
      const response = await fetch(API_ROUTES.TASKS.STATS, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats({
            pending: data.data.pending || 0,
            done: data.data.done || 0,
            skipped: data.data.skipped || 0,
          })
        }
      }
    } catch (error) {
      console.error('[Dashboard] Error loading stats:', error)
    }
  }

  const loadTasks = async () => {
    // Support both NextAuth (Google OAuth) and Express token login
    const token = localStorage.getItem('token')
    const hasNextAuthSession = !!session?.user?.id

    // Skip if neither session nor token available
    if (!hasNextAuthSession && !token) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      console.debug('[Dashboard] Loading tasks from backend...', {
        hasNextAuthSession,
        hasToken: !!token,
      })

      const response = await fetch(`${API_ROUTES.TASKS.LIST}?limit=100&page=1`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        console.error('[Dashboard] Failed to fetch tasks:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('[Dashboard] Error response:', errorText)
        return
      }

      const data = await response.json()

      // Transform database tasks to store format
      // Normalize status from backend (PENDING/DONE/SKIPPED) to frontend (TODO/IN_PROGRESS/DONE)
      if (data.data && Array.isArray(data.data)) {
        const formattedTasks = data.data.map((task: any) => {
          // Map backend status to frontend expected values
          let normalizedStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED' = 'TODO'
          if (task.status === 'DONE') {
            normalizedStatus = 'DONE'
          } else if (task.status === 'SKIPPED') {
            normalizedStatus = 'SKIPPED'
          } else if (task.status === 'IN_PROGRESS') {
            normalizedStatus = 'IN_PROGRESS'
          } else {
            // PENDING defaults to TODO for frontend active task display
            normalizedStatus = 'TODO'
          }


          return {
            id: task.id,
            backendId: task.id,
            title: task.title,
            description: task.description || '',
            deadline: task.deadline,
            priority: task.priority as 'HIGH' | 'MEDIUM' | 'LOW',
            status: normalizedStatus,
            estimatedDuration: task.estimatedDuration,
            tags: [],
            reminderTime: task.reminderTime,
          }
        })

        setTasks(formattedTasks)
      } else if (data.tasks && Array.isArray(data.tasks)) {
        // Handle alternative response format
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('[Dashboard] Error loading tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load tasks on mount — works for both NextAuth and Express token login
  useEffect(() => {
    loadTasks()
    loadStats()
  }, [session?.user?.id])

  // Reload tasks when token changes (e.g., after Express login)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadTasks()
      loadStats()
    }
  }, [])

  // Listen for cross-component task change events (create/update/delete/skip)
  useEffect(() => {
    const handleTasksChanged = () => {
      loadTasks()
      loadStats()
    }

    window.addEventListener('tasks:changed', handleTasksChanged)
    return () => window.removeEventListener('tasks:changed', handleTasksChanged)
  }, [])

  // Global keyboard listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        open()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div 
      className="flex flex-col h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
    >
      {/* Header with Title and New Task Button - Sticky */}
      <div className="flex-shrink-0 sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Task
          </button>
        </div>
      </div>

        {/* Calendar Timeline - Top Section */}
        <div className="flex-shrink-0 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-b from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-950/80 backdrop-blur-sm">
          <CalendarTimeline />
        </div>

        {/* Stats Counter Bar */}
        <div className="flex-shrink-0 border-b border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3">
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400/70">Pending</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.done}</p>
                <p className="text-xs text-emerald-500 dark:text-emerald-400/70">Done</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
              <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.skipped}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400/70">Skipped</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Display - Middle Section */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40 flex items-center justify-center mb-4 mx-auto">
                    <CheckSquare2 className="w-10 h-10 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {t('emptyState.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    {t('emptyState.description')}
                  </p>
                </div>
                <button
                  onClick={open}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                >
                  <Plus className="w-5 h-5" strokeWidth={2} />
                  {t('emptyState.addTask')}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                  <Command className="w-3.5 h-3.5 inline mr-1" strokeWidth={2} />
                  Or press Ctrl+K
                </p>
              </div>
            ) : (
              <TaskPriorityList />
            )}
          </div>
        </div>

      {/* Command Palette - Bottom Section */}
      <CommandPalette 
        isOpen={isOpen}
        onClose={close}
        onOpen={open}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreated={() => {
          loadTasks()
          loadStats()
        }}
      />
    </div>
  )
}
