export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED'

export interface ApiEnvelope<T> {
  success: boolean
  message: string | null
  data: T
  timestamp?: string
  pagination?: {
    page: number
    limit: number
    total?: number
    totalItems?: number
    totalPages: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  theme?: string
  image?: string | null
  createdAt?: string | null
}

export interface AuthResult {
  user: UserProfile
  token: string
  refreshToken?: string
  tokenType?: string
  expiresIn?: number
}

export interface LoginPayload {
  email: string
  password: string
  captchaToken: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface Task {
  id: string
  userId?: string
  title: string
  description?: string
  deadline: string
  priority: TaskPriority
  status: TaskStatus
  estimatedDuration?: number
  reminderTime?: number
  reminderSent?: boolean
  createdAt?: string
  updatedAt?: string
  completedAt?: string | null
}

export interface TaskStats {
  total: number
  todo: number
  inProgress: number
  done: number
  skipped: number
}

export interface DailyStatsItem {
  date: string
  created: number
  completed: number
}

export interface WeeklyStatsItem {
  week: string
  created: number
  completed: number
}

export interface PlannerItem {
  task: Task
  priorityScore: number
  priority: TaskPriority
  status: TaskStatus
  deadline: string
}

export interface Reminder {
  id: string
  taskId: string
  message: string
  remindAt: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface ParsedTaskDraft {
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  estimatedDuration: number
  deadline: string
}

export interface OverviewAdviceItem {
  title: string
  description: string
  type: 'success' | 'warning' | 'info'
}

export interface OverviewAnalysis {
  score: number
  insights: string[]
  advice: OverviewAdviceItem[]
}
