'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Check, Save, X } from 'lucide-react'
import { Task } from '@/lib/utils/store'
import { useTaskStore } from '@/lib/utils/store'
import { useNotification } from '@/lib/hooks/useNotification'
import { useTheme } from '@/components/providers/ThemeProvider'
import { API_ROUTES } from '@/lib/constants/api'
import { getAuthCookie } from '@/lib/auth/cookies'
import CalendarPicker from '@/components/ui/CalendarPicker'
import TimeSlotPicker from '@/components/ui/TimeSlotPicker'

interface EditTaskModalProps {
  isOpen: boolean
  task: Task | null
  onClose: () => void
  onSaved?: () => void | Promise<void>
}

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type TaskStep = 'title' | 'description' | 'date' | 'time' | 'priority' | 'duration' | 'review'

const TASK_STEPS: Array<{ key: TaskStep; label: string; helper: string }> = [
  { key: 'title', label: 'Task Title', helper: 'Update the main task name first.' },
  { key: 'description', label: 'Description', helper: 'Optional details for extra context.' },
  { key: 'date', label: 'Date', helper: 'Pick the updated task date.' },
  { key: 'time', label: 'Time', helper: 'Choose the most suitable time slot.' },
  { key: 'priority', label: 'Priority', helper: 'Adjust the task urgency if needed.' },
  { key: 'duration', label: 'Duration', helper: 'Update the estimated time to finish.' },
  { key: 'review', label: 'Review', helper: 'Confirm the updated details before saving.' },
]

const priorityOptions: Array<{ value: Priority; label: string; hint: string }> = [
  { value: 'HIGH', label: 'High', hint: 'Urgent and needs attention soon.' },
  { value: 'MEDIUM', label: 'Medium', hint: 'Important but not the most urgent.' },
  { value: 'LOW', label: 'Low', hint: 'Can wait until higher priorities are done.' },
]

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
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!task || !isOpen) return

    const deadlineDate = new Date(task.deadline)
    setTitle(task.title)
    setDescription(task.description || '')
    setPriority(task.priority as Priority)
    setDeadline(deadlineDate.toISOString().slice(0, 10))
    setDeadlineTime(deadlineDate.toISOString().slice(11, 16))
    setEstimatedDuration(String(task.estimatedDuration || 60))
    setCurrentStep(0)
  }, [task, isOpen])

  const currentConfig = TASK_STEPS[currentStep]
  const isLastStep = currentStep === TASK_STEPS.length - 1

  const canContinue = useMemo(() => {
    switch (TASK_STEPS[currentStep].key) {
      case 'title':
        return title.trim().length > 0
      case 'duration':
        return (parseInt(estimatedDuration, 10) || 0) >= 5
      default:
        return true
    }
  }, [currentStep, estimatedDuration, title])

  const goNext = () => {
    if (!canContinue) {
      if (TASK_STEPS[currentStep].key === 'title') {
        notify.error('Please enter a task title')
      } else if (TASK_STEPS[currentStep].key === 'duration') {
        notify.error('Duration must be at least 5 minutes')
      }
      return
    }

    setCurrentStep((step) => Math.min(step + 1, TASK_STEPS.length - 1))
  }

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLastStep) {
      goNext()
      return
    }

    if (!title.trim()) {
      notify.error('Please enter a task title')
      return
    }

    if ((parseInt(estimatedDuration, 10) || 0) < 5) {
      notify.error('Duration must be at least 5 minutes')
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

      if (task.backendId && token) {
        const response = await fetch(API_ROUTES.TASKS.UPDATE(task.backendId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        })

        const result = await response.json().catch(() => null)

        if (!response.ok) {
          const message = result?.error?.message || result?.message || 'Failed to update task'
          throw new Error(message)
        }
      }

      updateTask(task.id, {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        deadline: payload.deadline,
        estimatedDuration: payload.estimatedDuration,
      })

      notify.success(`Task "${title}" berhasil diupdate`)
      window.dispatchEvent(new CustomEvent('tasks:changed'))
      if (onSaved) await onSaved()
      onClose()
    } catch (error) {
      console.error('[task:update] failed', error)
      notify.error(error instanceof Error ? error.message : 'Failed to update task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !task) return null

  const progress = ((currentStep + 1) / TASK_STEPS.length) * 100

  const renderStep = () => {
    switch (currentConfig.key) {
      case 'title':
        return (
          <div className="space-y-4">
            <label htmlFor="edit-title" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finish project report"
              className={`w-full rounded-2xl border px-4 py-4 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              disabled={isLoading}
              autoFocus
            />
          </div>
        )
      case 'description':
        return (
          <div className="space-y-4">
            <label htmlFor="edit-description" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description <span className="text-xs font-normal opacity-70">Optional</span>
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional: add notes, context, or a quick reminder..."
              rows={5}
              className={`w-full rounded-2xl border px-4 py-4 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              disabled={isLoading}
            />
          </div>
        )
      case 'date':
        return (
          <div className="space-y-4">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Choose a date
            </p>
            <div className="overflow-x-auto rounded-2xl">
              <CalendarPicker
                value={deadline}
                onChange={(date) => setDeadline(date)}
              />
            </div>
          </div>
        )
      case 'time':
        return (
          <div className="space-y-4">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Pick a time
            </p>
            <TimeSlotPicker
              value={deadlineTime}
              onChange={(time) => setDeadlineTime(time)}
              disabled={isLoading}
            />
          </div>
        )
      case 'priority':
        return (
          <div className="space-y-3">
            {priorityOptions.map((option) => {
              const active = priority === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : theme === 'dark'
                        ? 'border-gray-700 bg-gray-800 text-gray-100 hover:border-gray-600'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{option.label}</p>
                      <p className={`mt-1 text-sm ${active ? 'text-white/80' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {option.hint}
                      </p>
                    </div>
                    {active ? <Check className="mt-0.5 h-5 w-5 flex-shrink-0" strokeWidth={2.5} /> : null}
                  </div>
                </button>
              )
            })}
          </div>
        )
      case 'duration':
        return (
          <div className="space-y-4">
            <label htmlFor="edit-estimatedDuration" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Duration (minutes)
            </label>
            <input
              id="edit-estimatedDuration"
              type="number"
              min="5"
              step="5"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-4 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              disabled={isLoading}
            />
            <div className="grid grid-cols-3 gap-2">
              {['30', '60', '90'].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setEstimatedDuration(minutes)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                    estimatedDuration === minutes
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'border-gray-700 bg-gray-800 text-gray-200'
                        : 'border-gray-300 bg-white text-gray-800'
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>
        )
      case 'review':
        return (
          <div className="space-y-3">
            {[
              { label: 'Task Title', value: title || '-' },
              { label: 'Description', value: description || 'No description' },
              { label: 'Date', value: deadline },
              { label: 'Time', value: deadlineTime },
              { label: 'Priority', value: priority },
              { label: 'Duration', value: `${estimatedDuration || '60'} min` },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border px-4 py-3 ${theme === 'dark' ? 'border-gray-800 bg-gray-800/70' : 'border-gray-200 bg-gray-50'}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.label}
                </p>
                <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        )
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end justify-center p-0 sm:items-center sm:p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
      <div
        className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/40 backdrop-blur-sm'}`}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />

      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-t-3xl shadow-2xl transition-all sm:rounded-3xl ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}
      >
        <div className={`border-b px-5 py-4 sm:px-6 ${theme === 'dark' ? 'border-gray-800 bg-gray-950/50' : 'border-gray-200 bg-gray-50/80'}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Step {currentStep + 1} of {TASK_STEPS.length}
              </p>
              <h2 className={`mt-1 text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Edit Task
              </h2>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className={`rounded-xl p-2 transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              aria-label="Close edit task modal"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <div className={`h-2 overflow-hidden rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <div className="mb-5">
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentConfig.label}
              </h3>
              <p className={`mt-2 text-sm leading-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentConfig.helper}
              </p>
            </div>
            {renderStep()}
          </div>

          <div className={`border-t px-5 py-4 sm:px-6 ${theme === 'dark' ? 'border-gray-800 bg-gray-950/40' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentStep === 0) {
                    onClose()
                    return
                  }
                  goBack()
                }}
                disabled={isLoading}
                className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition-colors ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </button>
              <button
                type="submit"
                disabled={isLoading || !canContinue}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : isLastStep ? (
                  <>
                    <Save className="h-4 w-4" strokeWidth={2.5} />
                    Save Changes
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
