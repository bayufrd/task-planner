/**
 * Priority Scheduling Algorithm
 * 
 * This algorithm determines task priority based on:
 * 1. Deadline urgency (days until deadline)
 * 2. User-set priority level (HIGH, MEDIUM, LOW)
 * 3. Reminder setting (how soon reminder is)
 * 4. Estimated duration (shorter tasks can be done quickly)
 * 
 * Scoring formula:
 * score = (urgencyScore * 0.4) + (priorityScore * 0.35) + (reminderScore * 0.15) + (durationScore * 0.1)
 */

export interface TaskWithScore {
  id: string
  title: string
  deadline: Date
  priority: string
  estimatedDuration?: number
  reminderTime: number
  status: string
  score: number
  daysUntilDeadline: number
  hoursUntilReminder: number
}

export interface TaskForScheduling {
  id: string
  title: string
  deadline: Date
  priority: string
  estimatedDuration?: number
  reminderTime?: number
  status: string
}

/**
 * Calculate urgency score based on days until deadline
 * Closer to deadline = higher urgency
 */
function calculateUrgencyScore(daysUntilDeadline: number): number {
  if (daysUntilDeadline < 0) return 100 // Overdue
  if (daysUntilDeadline === 0) return 95 // Today
  if (daysUntilDeadline === 1) return 85 // Tomorrow
  if (daysUntilDeadline <= 3) return 70
  if (daysUntilDeadline <= 7) return 50
  if (daysUntilDeadline <= 14) return 30
  return 10 // More than 2 weeks
}

/**
 * Calculate priority score based on priority level
 */
function calculatePriorityScore(priority: string): number {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return 90
    case 'MEDIUM':
      return 60
    case 'LOW':
      return 30
    default:
      return 60
  }
}

/**
 * Calculate reminder score based on how soon reminder is set
 * Closer reminder time = higher priority to complete before reminder
 */
function calculateReminderScore(hoursUntilReminder: number): number {
  if (hoursUntilReminder < 0) return 0 // Reminder already sent
  if (hoursUntilReminder === 0) return 100 // Reminder now
  if (hoursUntilReminder <= 1) return 95
  if (hoursUntilReminder <= 3) return 80
  if (hoursUntilReminder <= 6) return 60
  if (hoursUntilReminder <= 12) return 40
  if (hoursUntilReminder <= 24) return 20
  return 5
}

/**
 * Calculate duration score
 * Shorter tasks get slightly higher priority (can be completed quickly)
 */
function calculateDurationScore(estimatedDuration?: number): number {
  if (!estimatedDuration) return 50
  if (estimatedDuration <= 15) return 80 // Quick task
  if (estimatedDuration <= 30) return 70
  if (estimatedDuration <= 60) return 60
  if (estimatedDuration <= 120) return 50
  if (estimatedDuration <= 240) return 35 // Long task
  return 20
}

/**
 * Calculate days until deadline
 */
function calculateDaysUntilDeadline(deadline: Date): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
  
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Calculate hours until reminder
 */
function calculateHoursUntilReminder(deadline: Date, reminderTime: number): number {
  const now = new Date()
  const reminderDate = new Date(deadline.getTime() - reminderTime * 60 * 1000)
  const diffTime = reminderDate.getTime() - now.getTime()
  const diffHours = diffTime / (1000 * 60 * 60)
  
  return diffHours
}

/**
 * Calculate priority score for a single task
 */
export function calculateTaskScore(task: TaskForScheduling): TaskWithScore {
  const daysUntilDeadline = calculateDaysUntilDeadline(task.deadline)
  const hoursUntilReminder = calculateHoursUntilReminder(task.deadline, task.reminderTime || 60)
  
  const urgencyScore = calculateUrgencyScore(daysUntilDeadline)
  const priorityScore = calculatePriorityScore(task.priority)
  const reminderScore = calculateReminderScore(hoursUntilReminder)
  const durationScore = calculateDurationScore(task.estimatedDuration)
  
  // Weighted scoring formula
  const score =
    urgencyScore * 0.4 +
    priorityScore * 0.35 +
    reminderScore * 0.15 +
    durationScore * 0.1
  
  return {
    id: task.id,
    title: task.title,
    deadline: task.deadline,
    priority: task.priority,
    estimatedDuration: task.estimatedDuration,
    reminderTime: task.reminderTime || 60,
    status: task.status,
    score: Math.round(score * 100) / 100,
    daysUntilDeadline,
    hoursUntilReminder: Math.round(hoursUntilReminder * 100) / 100,
  }
}

/**
 * Sort and prioritize tasks
 * Only includes TODO and IN_PROGRESS tasks
 */
export function prioritizeTasks(tasks: TaskForScheduling[]): TaskWithScore[] {
  return tasks
    .filter(task => task.status === 'TODO' || task.status === 'IN_PROGRESS')
    .map(task => calculateTaskScore(task))
    .sort((a, b) => b.score - a.score)
}

/**
 * Get today's priority tasks
 */
export function getTodayPriorityTasks(tasks: TaskForScheduling[]): TaskWithScore[] {
  const prioritized = prioritizeTasks(tasks)
  return prioritized.filter(task => task.daysUntilDeadline <= 1)
}

/**
 * Get tasks due soon (next 7 days)
 */
export function getUpcomingTasks(tasks: TaskForScheduling[]): TaskWithScore[] {
  const prioritized = prioritizeTasks(tasks)
  return prioritized.filter(task => task.daysUntilDeadline >= 0 && task.daysUntilDeadline <= 7)
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(tasks: TaskForScheduling[]): TaskWithScore[] {
  const prioritized = prioritizeTasks(tasks)
  return prioritized.filter(task => task.daysUntilDeadline < 0)
}
