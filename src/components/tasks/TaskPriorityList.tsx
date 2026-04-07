'use client'

import { useState } from 'react'
import { useTaskStore } from '@/lib/store'
import { prioritizeTasks } from '@/lib/priorityScheduling'
import TaskCard from './TaskCard'

export default function TaskPriorityList() {
  const { tasks, selectedDate } = useTaskStore()
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

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex gap-2 mb-6">
        {(['today', 'upcoming', 'all'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No tasks in this view</p>
        </div>
      ) : (
        <div className="grid gap-4">
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

      {/* Task Statistics */}
      {filteredTasks.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-3">Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{filteredTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {filteredTasks.filter(t => t.priority === 'HIGH').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((filteredTasks.reduce((sum, t) => sum + t.score, 0) / filteredTasks.length) || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Priority Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
