/**
 * API Validation Helpers
 * Input validation untuk API endpoints
 */

/**
 * Validasi Task input
 */
export interface TaskInput {
  title: string
  description?: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  deadline: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
  estimatedDuration?: number
  reminderTime?: number
  tags?: string[]
}

export function validateTaskInput(data: any): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}

  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.title = ['Title is required and must be a string']
  } else if (data.title.trim().length < 2) {
    errors.title = ['Title must be at least 2 characters']
  } else if (data.title.length > 200) {
    errors.title = ['Title must not exceed 200 characters']
  }

  // Priority validation
  if (!data.priority || !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority)) {
    errors.priority = ['Priority must be HIGH, MEDIUM, or LOW']
  }

  // Deadline validation
  if (!data.deadline || typeof data.deadline !== 'string') {
    errors.deadline = ['Deadline is required and must be a valid ISO date string']
  } else {
    const date = new Date(data.deadline)
    if (isNaN(date.getTime())) {
      errors.deadline = ['Deadline must be a valid ISO date string']
    }
  }

  // Description validation (optional)
  if (data.description && typeof data.description !== 'string') {
    errors.description = ['Description must be a string']
  } else if (data.description && data.description.length > 1000) {
    errors.description = ['Description must not exceed 1000 characters']
  }

  // Status validation (optional)
  if (data.status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(data.status)) {
    errors.status = ['Status must be TODO, IN_PROGRESS, or DONE']
  }

  // Estimated duration validation (optional)
  if (data.estimatedDuration !== undefined) {
    if (typeof data.estimatedDuration !== 'number' || data.estimatedDuration < 1) {
      errors.estimatedDuration = ['Estimated duration must be a positive number (minutes)']
    } else if (data.estimatedDuration > 1440) {
      errors.estimatedDuration = ['Estimated duration must not exceed 1440 minutes (24 hours)']
    }
  }

  // Reminder time validation (optional)
  if (data.reminderTime !== undefined) {
    if (typeof data.reminderTime !== 'number' || data.reminderTime < 1) {
      errors.reminderTime = ['Reminder time must be a positive number (minutes)']
    }
  }

  // Tags validation (optional)
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.tags = ['Tags must be an array']
    } else {
      const invalidTags = data.tags.filter((tag: any) => typeof tag !== 'string' || tag.length === 0)
      if (invalidTags.length > 0) {
        errors.tags = ['All tags must be non-empty strings']
      }
      if (data.tags.length > 10) {
        errors.tags = ['Maximum 10 tags allowed']
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validasi ID parameter
 */
export function validateId(id: any): { valid: boolean; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'Invalid ID' }
  }

  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id) && !/^\d+$/.test(id)) {
    return { valid: false, error: 'ID must be a valid UUID or number' }
  }

  return { valid: true }
}

/**
 * Validasi pagination parameters
 */
export function validatePaginationParams(page?: any, limit?: any): {
  valid: boolean
  errors: Record<string, string[]>
  page: number
  limit: number
} {
  const errors: Record<string, string[]> = {}
  let pageNum = 1
  let limitNum = 20

  // Page validation
  if (page !== undefined) {
    const parsedPage = parseInt(page)
    if (isNaN(parsedPage) || parsedPage < 1) {
      errors.page = ['Page must be a positive integer']
    } else {
      pageNum = parsedPage
    }
  }

  // Limit validation
  if (limit !== undefined) {
    const parsedLimit = parseInt(limit)
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      errors.limit = ['Limit must be a positive integer']
    } else if (parsedLimit > 100) {
      errors.limit = ['Limit must not exceed 100']
    } else {
      limitNum = parsedLimit
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    page: pageNum,
    limit: limitNum,
  }
}

/**
 * Validasi search query
 */
export function validateSearchQuery(query: any): { valid: boolean; error?: string; query: string } {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Search query is required', query: '' }
  }

  const trimmedQuery = query.trim()
  if (trimmedQuery.length < 2) {
    return { valid: false, error: 'Search query must be at least 2 characters', query: trimmedQuery }
  }

  if (trimmedQuery.length > 100) {
    return { valid: false, error: 'Search query must not exceed 100 characters', query: trimmedQuery }
  }

  return { valid: true, query: trimmedQuery }
}
