'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save } from 'lucide-react'
import { Task } from '@/lib/utils/store'
import { useTaskStore } from '@/lib/utils/store'
import { useNotification } from '@/lib/hooks/useNotification'
import { useTheme } from '@/components/providers/ThemeProvider'
import { API_ROUTES } from '@/lib/constants/api'
import { getAuthCookie } from '@/lib/auth/cookies'

interface EditTaskModalProps {
  isOpen: boolean
  task: Task | null
  onClose: () => void
  onSaved?: () => void | Promise<void>
}

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export default function EditTaskModal({ isOpen, task, onClose, onSaved }: EditTaskModalProps) {
  const { theme } = useTheme()
  const notify = useNotification()
  const { updateTask } = useTaskStore()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [deadline, setDeadline] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState('60')

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      const deadlineDate = new Date(task.deadline)
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority as Priority)
      setDeadline(deadlineDate.toISOString().slice(0, 10))
      setDeadlineTime(deadlineDate.toISOString().slice(11, 16))
      setEstimatedDuration(String(task.estimatedDuration || 60))
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      notify.error('Please enter a task title')
      return
    }

    if (!task) return

    try {
      setIsLoading(true)

      const token = getAuthCookie()
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        deadline: new Date(`${deadline}T${deadlineTime}:00`).toISOString(),
        estimatedDuration: parseInt(estimatedDuration, 10) || 60,
      }

      console.debug('[task:update] request', payload, 'taskId:', task.id)

      // Update via API if has backendId
      if (task.backendId && token) {
        const response = await fetch(API_ROUTES.TASKS.UPDATE(task.backendId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        })

        const result = await response.json().catch(() => null)

        if (!response.ok) {
          const message = result?.error?.message || result?.message || 'Failed to update task'
          throw new Error(message)
        }
      }

      // Update local store
      updateTask(task.id, {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        deadline: payload.deadline,
        estimatedDuration: payload.estimatedDuration,
      })

      notify.success(`Task "${title}" berhasil diupdate`)
      window.dispatchEvent(new CustomEvent('tasks:changed'))
      if (onSaved) onSaved()
      onClose()
    } catch (error) {
      console.error('[task:update] failed', error)
      notify.error(error instanceof Error ? error.message : 'Failed to update task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !task) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-black/60 backdrop-blur-sm'
            : 'bg-black/40 backdrop-blur-sm'
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-gray-900 border border-gray-800'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === 'dark'
              ? 'border-gray-800 bg-gray-950/50'
              : 'border-gray-200 bg-gray-50/50'
          }`}
        >
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Edit Task
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className={`p-1 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="edit-title"
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finish project report"
              className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              disabled={isLoading}
            />
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="edit-deadline"
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Deadline
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                id="edit-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isLoading}
              />
              <input
                id="edit-deadlineTime"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label
                htmlFor="edit-priority"
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Priority
              </label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isLoading}
              >
                <option value="HIGH">🔴 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label
                htmlFor="edit-estimatedDuration"
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Duration (min)
              </label>
              <input
                id="edit-estimatedDuration"
                type="number"
                min="5"
                step="5"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t" style={{
            borderColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
          }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" strokeWidth={2.5} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}