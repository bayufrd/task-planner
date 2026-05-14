'use client'

import { Task } from '@/lib/utils/store'
import { TaskWithScore } from '@/lib/utils/priority'
import { useTaskStore } from '@/lib/utils/store'
import { format } from 'date-fns'
import { Clock, CheckCircle2, Trash2, RotateCcw, Loader2, AlertTriangle } from 'lucide-react'
import { TaskStatusIcons, PriorityIcons } from '@/lib/constants/icons'
import { getPriorityBorder, getPriorityGradient, cn } from '@/lib/utils/ui'
import { taskApi, getAuthToken } from '@/lib/api/client'
import { useState } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useNotification } from '@/lib/hooks/useNotification'
import EditTaskModal from './EditTaskModal'

interface TaskCardProps {
  task: Task
  scoreInfo: TaskWithScore
}

export default function TaskCard({ task, scoreInfo }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskStore()
  const { theme } = useTheme()
  const notify = useNotification()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Check if task is auto-skipped (overdue)
  const isSkipped = task.status === 'SKIPPED'

  const StatusIcon = TaskStatusIcons[task.status as keyof typeof TaskStatusIcons].icon
  const statusIconClass = TaskStatusIcons[task.status as keyof typeof TaskStatusIcons].className
  
  const priorityConfig = PriorityIcons[task.priority as keyof typeof PriorityIcons]
  const PriorityIcon = priorityConfig.icon

  const handleComplete = async () => {
    if (isSkipped) {
      notify.error('Skipped task cannot be marked as done')
      return
    }

    setIsUpdating(true)
    console.log('[TaskCard] Complete clicked for task:', task.id, 'backendId:', task.backendId)
    
    const token = getAuthToken()
    console.log('[TaskCard] Token exists:', !!token)
    
    // If has backendId and token, call API first
    if (task.backendId && token) {
      console.log('[TaskCard] Calling API to complete task:', task.backendId)
      try {
        const result = await taskApi.complete(task.backendId)
        console.log('[TaskCard] API result:', result)
        
        if (result.success) {
          // Update localStorage state
          updateTask(task.id, {
            status: 'DONE',
            completedAt: new Date().toISOString(),
          })
        } else {
          console.error('[TaskCard] API failed, updating local only:', result.error)
          // Still update locally even if API fails
          updateTask(task.id, {
            status: 'DONE',
            completedAt: new Date().toISOString(),
          })
        }
      } catch (err) {
        console.error('[TaskCard] API call error:', err)
        // Fallback to localStorage
        updateTask(task.id, {
          status: 'DONE',
          completedAt: new Date().toISOString(),
        })
      }
    } else {
      console.log('[TaskCard] No backendId or token, updating localStorage only')
      updateTask(task.id, {
        status: 'DONE',
        completedAt: new Date().toISOString(),
      })
    }
    
    notify.success(`Task "${task.title}" marked as done`)
    window.dispatchEvent(new CustomEvent('tasks:changed'))
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    console.log('[TaskCard] Delete clicked for task:', task.id, 'backendId:', task.backendId)
    
    const token = getAuthToken()
    
    try {
      if (task.backendId && token) {
        console.log('[TaskCard] Calling API to soft delete task:', task.backendId)
        const result = await taskApi.delete(task.backendId)
        console.log('[TaskCard] Delete API result:', result)

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete task')
        }
      }
      
      deleteTask(task.id)
      notify.success(`Task "${task.title}" berhasil didelete`)
      setShowDeleteConfirm(false)
      window.dispatchEvent(new CustomEvent('tasks:changed'))
    } catch (err) {
      console.error('[TaskCard] Delete failed:', err)
      notify.error(err instanceof Error ? err.message : 'Failed to delete task')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <div
        onClick={() => {
          if (!isSkipped) setShowEditModal(true)
        }}
        className={cn(
          'p-4 border-l-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 hover:shadow-lg dark:hover:shadow-lg/50 transition-all duration-200 backdrop-blur-sm',
          !isSkipped && 'cursor-pointer',
          getPriorityBorder(task.priority),
          isSkipped && 'opacity-60 cursor-default'
        )}
      >
      <div className="flex items-start justify-between gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <StatusIcon className={cn('w-5 h-5 flex-shrink-0', statusIconClass)} strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base line-clamp-2 ${
                task.status === 'DONE' || task.status === 'SKIPPED'
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-gray-50'
              }`}>
                {task.title}
              </h3>
              {task.backendId && (
                <p className="text-xs text-gray-400 mt-0.5">Synced #{task.backendId}</p>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
          )}

          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            {/* Priority Badge */}
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-white text-xs bg-gradient-to-r shadow-sm',
                getPriorityGradient(task.priority)
              )}
            >
              <PriorityIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              {task.priority}
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg text-gray-700 dark:text-gray-300">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              <time className="text-xs font-medium">
                {format(new Date(task.deadline), 'MMM d • HH:mm')}
              </time>
            </div>

            {/* Days Until Deadline */}
            {scoreInfo.daysUntilDeadline >= 0 && (
              <div
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  scoreInfo.daysUntilDeadline === 0
                    ? 'bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-gray-100/80 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                {scoreInfo.daysUntilDeadline === 0
                  ? 'Today'
                  : `${scoreInfo.daysUntilDeadline}d`}
              </div>
            )}

            {/* Estimated Duration */}
            {task.estimatedDuration && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg text-gray-700 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="text-xs font-medium">{task.estimatedDuration}min</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-end gap-3 ml-4 flex-shrink-0">
          {/* Priority Score */}
          <div className="text-center bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-2.5 min-w-[70px]">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {scoreInfo.score}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">Score</p>
          </div>

          {/* Hours Until Reminder */}
          {scoreInfo.hoursUntilReminder > 0 && (
            <div className="text-right text-xs px-2 py-1 bg-orange-100/80 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-md font-medium">
              {Math.round(scoreInfo.hoursUntilReminder)}h left
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/50"
        onClick={(e) => e.stopPropagation()}
      >
        {task.status === 'DONE' ? (
          <button
            onClick={() =>
              updateTask(task.id, {
                status: 'TODO',
                completedAt: undefined,
              })
            }
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 font-medium text-sm text-gray-700 dark:text-gray-300"
            title="Undo"
            disabled={isUpdating}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            Undo
          </button>
        ) : isSkipped ? null : (
          <button
            onClick={handleComplete}
            disabled={isUpdating || isSkipped}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100/80 dark:bg-green-900/20 hover:bg-green-200/80 dark:hover:bg-green-800/30 transition-all duration-200 font-medium text-sm text-green-700 dark:text-green-400 disabled:opacity-50"
            title="Complete"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            ) : (
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            )}
            Done
          </button>
        )}

        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isUpdating}
          className="px-3 py-2 rounded-lg bg-red-100/80 dark:bg-red-900/20 hover:bg-red-200/80 dark:hover:bg-red-800/30 transition-all duration-200 font-medium text-sm text-red-700 dark:text-red-400 disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {!isSkipped && (
        <EditTaskModal
          isOpen={showEditModal}
          task={task}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className={`relative w-full max-w-sm mx-4 rounded-2xl shadow-2xl p-6 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Delete Task?
            </h3>
            <p className={`text-sm text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isUpdating}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
