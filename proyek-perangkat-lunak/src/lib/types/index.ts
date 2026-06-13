/**
 * Shared Type Definitions
 * Types yang digunakan across aplikasi
 */

/**
 * Task Priority Levels
 */
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'

/**
 * Task Status
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

/**
 * Task Model
 */
export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  deadline: string // ISO date
  estimatedDuration?: number // minutes
  reminderTime?: number // minutes before deadline
  tags?: string[]
  createdAt: string // ISO date
  updatedAt: string // ISO date
  completedAt?: string // ISO date
}

/**
 * Task Input untuk creation/update
 */
export interface TaskInput {
  title: string
  description?: string
  priority: TaskPriority
  deadline: string
  status?: TaskStatus
  estimatedDuration?: number
  reminderTime?: number
  tags?: string[]
}

/**
 * Task dengan priority score
 */
export interface ScoredTask extends Task {
  priorityScore: number
  daysUntilDeadline: number
  hoursUntilReminder: number
}

/**
 * API Response Standard Format
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

/**
 * API Paginated Response
 */
export interface ApiPaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  timestamp: string
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false
  error: {
    message: string
    code: string
    details?: any
  }
  timestamp: string
}

/**
 * User Settings
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'id'
  emailNotifications: boolean
  pushNotifications: boolean
  defaultPriority: TaskPriority
  defaultReminder: number // minutes
}

/**
 * Tag
 */
export interface Tag {
  id: string
  name: string
  color?: string
  createdAt: string
}

/**
 * Subtask
 */
export interface Subtask {
  id: string
  taskId: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Analytics Data
 */
export interface AnalyticsData {
  totalTasks: number
  completedTasks: number
  completionRate: number
  averageTimeToComplete: number
  tasksOverdue: number
  tasksToday: number
  tasksByPriority: {
    HIGH: number
    MEDIUM: number
    LOW: number
  }
}

/**
 * Theme Type
 */
export type Theme = 'light' | 'dark'
