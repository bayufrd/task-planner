/**
 * Validation Schemas
 * Input validation for tasks and other entities
 */

export interface CreateTaskInput {
  title: string
  description?: string
  deadline: string | Date
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedDuration?: number
  reminderTime?: number
  tags?: string[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  deadline?: string | Date
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedDuration?: number
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
  reminderTime?: number
  tags?: string[]
}

export const validateCreateTask = (data: CreateTaskInput) => {
  const errors: string[] = []

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }
  if (data.title && data.title.length > 500) {
    errors.push('Title must be less than 500 characters')
  }

  // Deadline validation
  if (!data.deadline) {
    errors.push('Deadline is required')
  }
  if (data.deadline) {
    const deadline = new Date(data.deadline)
    if (isNaN(deadline.getTime())) {
      errors.push('Invalid deadline format')
    }
  }

  // Priority validation
  if (data.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority)) {
    errors.push('Priority must be HIGH, MEDIUM, or LOW')
  }

  // Duration validation
  if (data.estimatedDuration !== undefined && data.estimatedDuration <= 0) {
    errors.push('Estimated duration must be greater than 0')
  }

  // Reminder validation
  if (data.reminderTime !== undefined && data.reminderTime < 0) {
    errors.push('Reminder time must be non-negative')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export const validateUpdateTask = (data: UpdateTaskInput) => {
  // Similar to validateCreateTask but all fields are optional
  const errors: string[] = []

  if (data.title !== undefined && data.title.length > 500) {
    errors.push('Title must be less than 500 characters')
  }

  if (data.deadline) {
    const deadline = new Date(data.deadline)
    if (isNaN(deadline.getTime())) {
      errors.push('Invalid deadline format')
    }
  }

  if (data.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority)) {
    errors.push('Priority must be HIGH, MEDIUM, or LOW')
  }

  if (data.status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(data.status)) {
    errors.push('Status must be TODO, IN_PROGRESS, or DONE')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
