'use client'

import { useState } from 'react'
import { useTaskStore } from '@/lib/utils/store'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { prioritizeTasks } from '@/lib/utils/priority'
import TaskCard from './TaskCard'
import { Calendar, Zap, ListTodo } from 'lucide-react'

export default function TaskPriorityList() {
  const { tasks, selectedDate } = useTaskStore()
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<'today' | 'upcoming' | 'all'>('today')

  // Filter tasks based on view mode
  const getFilteredTasks = () => {
    const tasksToFilter = tasks.filter(task => task.status !== 'DONE')
    
    const taskForScheduling = tasksToFilter.map(task => ({
      id: task.id,
      title: task.title,
      deadline: new Date(task.deadline),
      priority: task.priority,
      estimatedDuration: task.estimatedDuration,
      reminderTime: task.reminderTime,
      status: task.status,
    }))

    const prioritized = prioritizeTasks(taskForScheduling)

    switch (viewMode) {
      case 'today':
        return prioritized.filter(t => {
          const taskDate = new Date(tasks.find(tk => tk.id === t.id)?.deadline || new Date())
          const today = new Date()
          return (
            taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getDate() === today.getDate()
          )
        })
      case 'upcoming':
        return prioritized.filter(t => {
          const taskDate = new Date(tasks.find(tk => tk.id === t.id)?.deadline || new Date())
          const today = new Date()
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          return taskDate >= today && taskDate <= weekFromNow
        })
      default:
        return prioritized
    }
  }

  const filteredTasks = getFilteredTasks()

  // Count high priority from ALL non-done tasks (not just filtered/view mode)
  const allNonDoneTasks = tasks.filter(task => task.status !== 'DONE')
  const highPriorityCount = allNonDoneTasks.filter(t => t.priority === 'HIGH').length

  const viewModeConfig = {
    today: { label: t('taskList.today'), icon: Calendar },
    upcoming: { label: t('taskList.upcoming'), icon: Zap },
    all: { label: t('taskList.all'), icon: ListTodo }
  }

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex gap-2 flex-wrap">
        {(['today', 'upcoming', 'all'] as const).map((mode) => {
          const Icon = viewModeConfig[mode].icon
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {viewModeConfig[mode].label}
            </button>
          )
        })}
      </div>

      {/* Task Statistics */}
      {filteredTasks.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100/50 dark:border-blue-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:tracking-widest mb-1 sm:mb-2 leading-tight">Total Tasks</p>
            <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {filteredTasks.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-100/50 dark:border-orange-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:tracking-widest mb-1 sm:mb-2 leading-tight">High Priority</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
              {highPriorityCount}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100/50 dark:border-green-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide sm:tracking-widest mb-1 sm:mb-2 leading-tight">Avg Score</p>
            <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {Math.round((filteredTasks.reduce((sum, t) => sum + t.score, 0) / filteredTasks.length) || 0)}
            </p>
          </div>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <ListTodo className="w-8 h-8 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('taskList.noTasks')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a task to get started</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.map((scheduledTask) => {
            const originalTask = tasks.find(t => t.id === scheduledTask.id)
            return originalTask ? (
              <TaskCard
                key={originalTask.id}
                task={originalTask}
                scoreInfo={scheduledTask}
              />
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
