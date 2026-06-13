/**
 * Task utilities
 */

export function getStatusColor(status: string): string {
  switch (status) {
    case 'DONE':
      return 'text-green-600 dark:text-green-400'
    case 'IN_PROGRESS':
      return 'text-blue-600 dark:text-blue-400'
    case 'TODO':
      return 'text-gray-600 dark:text-gray-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function getPriorityColor(priority: string): {
  bg: string
  text: string
  border: string
} {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-100',
        border: 'border-red-300 dark:border-red-700',
      }
    case 'MEDIUM':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-100',
        border: 'border-yellow-300 dark:border-yellow-700',
      }
    case 'LOW':
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-100',
        border: 'border-green-300 dark:border-green-700',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-100',
        border: 'border-gray-300 dark:border-gray-700',
      }
  }
}

export function validateTaskInput(title: string, deadline: Date): {
  valid: boolean
  error?: string
} {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Task title is required' }
  }

  if (title.length > 500) {
    return { valid: false, error: 'Task title is too long (max 500 characters)' }
  }

  if (deadline < new Date()) {
    return { valid: false, error: 'Deadline cannot be in the past' }
  }

  return { valid: true }
}
