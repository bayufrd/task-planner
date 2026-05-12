'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { useTaskStore } from '@/lib/utils/store'
import { useNotification } from '@/lib/hooks/useNotification'
import { useTheme } from '@/components/providers/ThemeProvider'
import { API_ROUTES } from '@/lib/constants/api'

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export default function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const { theme } = useTheme()
  const notify = useNotification()
  const { addTask } = useTaskStore()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [deadline, setDeadline] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState('60')

  // Reset form when closing
  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setDescription('')
      setPriority('MEDIUM')
      setDeadline('')
      setDeadlineTime('')
      setEstimatedDuration('60')
    }
  }, [isOpen])

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      notify.error('Please enter a task title')
      return
    }

    try {
      setIsLoading(true)

      // Create task via Express backend
      const response = await fetch(API_ROUTES.TASKS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          deadline: deadline && deadlineTime ? `${deadline}T${deadlineTime}:00` : (deadline || null),
          estimatedDuration: parseInt(estimatedDuration) || 60,
          status: 'PENDING', // Backend uses PENDING
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const data = await response.json()

      // Add to local store (without id and createdAt as they're auto-generated)
      addTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        deadline: data.deadline,
        estimatedDuration: data.estimatedDuration,
        status: data.status,
        tags: [],
        reminderTime: data.reminderTime || 0,
      })

      notify.success(`Task "${title}" created successfully`)
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
      notify.error('Failed to create task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-black/60 backdrop-blur-sm'
            : 'bg-black/40 backdrop-blur-sm'
        }`}
        onClick={onClose}
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
            Create New Task
          </h2>
          <button
            onClick={onClose}
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
              htmlFor="title"
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
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
              htmlFor="description"
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Description
            </label>
            <textarea
              id="description"
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
              htmlFor="deadline"
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Deadline
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                id="deadline"
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
                id="deadlineTime"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isLoading || !deadline}
              />
            </div>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Time is optional
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Priority
              </label>
              <select
                id="priority"
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
                htmlFor="estimatedDuration"
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Duration (min)
              </label>
              <input
                id="estimatedDuration"
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
              onClick={onClose}
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
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
