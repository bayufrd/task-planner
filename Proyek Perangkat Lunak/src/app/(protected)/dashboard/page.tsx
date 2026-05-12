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
import { Plus, Command, CheckSquare2 } from 'lucide-react'

export default function Dashboard() {
  const { data: session } = useSession()
  const { tasks, setTasks } = useTaskStore()
  const { t } = useLanguage()
  const { isOpen, open, close } = useCommandPalette()
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(true)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)

  // Load tasks from database on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`${API_ROUTES.TASKS.LIST}?limit=100&page=1`)
        
        if (!response.ok) {
          console.error('Failed to fetch tasks:', response.statusText)
          return
        }

        const data = await response.json()
        
        // Transform database tasks to store format
        if (data.data && Array.isArray(data.data)) {
          const formattedTasks = data.data.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            deadline: task.deadline,
            priority: task.priority as 'HIGH' | 'MEDIUM' | 'LOW',
            status: task.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
            estimatedDuration: task.estimatedDuration,
            tags: [],
            reminderTime: task.reminderTime,
          }))
          
          setTasks(formattedTasks)
          console.log(`📥 Loaded ${formattedTasks.length} tasks from database`)
        }
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [session?.user?.id])

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
      {/* Header with New Task Button - Sticky */}
      <div className="flex-shrink-0 sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
      />
    </div>
  )
}
