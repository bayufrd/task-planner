'use client'

import { Task } from '@/lib/store'
import { TaskWithScore } from '@/lib/priorityScheduling'
import { useTaskStore } from '@/lib/store'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  scoreInfo: TaskWithScore
}

export default function TaskCard({ task, scoreInfo }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskStore()

  const priorityColor = {
    HIGH: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    MEDIUM: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    LOW: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
  }

  const priorityBorder = {
    HIGH: 'border-l-red-500',
    MEDIUM: 'border-l-yellow-500',
    LOW: 'border-l-green-500',
  }

  const statusIcon = {
    TODO: '📝',
    IN_PROGRESS: '⏳',
    DONE: '✅',
  }

  return (
    <div
      className={`p-4 border-l-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md dark:hover:shadow-lg transition-shadow ${priorityBorder[task.priority as keyof typeof priorityBorder]}`}
    >
      <div className="flex items-start justify-between">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{statusIcon[task.status as keyof typeof statusIcon]}</span>
            <h3 className="text-lg font-semibold">{task.title}</h3>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{task.description}</p>
          )}

          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
            {/* Priority Badge */}
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                priorityColor[task.priority as keyof typeof priorityColor]
              }`}
            >
              {task.priority}
            </span>

            {/* Deadline */}
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">📅</span>
              <time className="text-gray-700 dark:text-gray-300">
                {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
              </time>
            </div>

            {/* Days Until Deadline */}
            {scoreInfo.daysUntilDeadline >= 0 && (
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  scoreInfo.daysUntilDeadline === 0
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {scoreInfo.daysUntilDeadline === 0
                  ? 'Today'
                  : `${scoreInfo.daysUntilDeadline} day${scoreInfo.daysUntilDeadline > 1 ? 's' : ''}`}
              </div>
            )}

            {/* Estimated Duration */}
            {task.estimatedDuration && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <span>⏱️</span>
                <span>{task.estimatedDuration} min</span>
              </div>
            )}

            {/* Reminder Time */}
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span>🔔</span>
              <span>{task.reminderTime} min before</span>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-end gap-2 ml-4">
          {/* Priority Score */}
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {scoreInfo.score}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Priority Score</p>
          </div>

          {/* Hours Until Reminder */}
          <div className="text-right text-xs">
            <p className="text-gray-600 dark:text-gray-400">
              {scoreInfo.hoursUntilReminder > 0
                ? `Reminder in ${Math.round(scoreInfo.hoursUntilReminder)}h`
                : 'Reminder sent'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() =>
            updateTask(task.id, {
              status: task.status === 'DONE' ? 'TODO' : 'DONE',
              completedAt: task.status === 'DONE' ? undefined : new Date().toISOString(),
            })
          }
          className="flex-1 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 transition-colors font-medium text-sm"
        >
          {task.status === 'DONE' ? 'Undo' : 'Complete'}
        </button>

        <button
          onClick={() =>
            updateTask(task.id, {
              status: task.status === 'IN_PROGRESS' ? 'TODO' : 'IN_PROGRESS',
            })
          }
          className="flex-1 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-medium text-sm"
        >
          {task.status === 'IN_PROGRESS' ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={() => deleteTask(task.id)}
          className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
