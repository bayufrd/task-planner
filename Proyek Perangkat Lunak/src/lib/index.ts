/**
 * Main Lib Entry Point
 * Central import location for all lib modules
 */

// Database
export { prisma } from './db'
export { connectDB, disconnectDB } from './db/helpers'

// Authentication & Calendar
export { authOptions } from './auth'
export * from './auth/google-calendar'

// API
export * from './api/responses'
// Removed export from api/validation (duplicate validateTaskInput - use utils/task instead)

// Utils
export * from './utils/date'
export * from './utils/task'
export * from './utils/validation'
export * from './utils/priority'
export * from './utils/i18n'
export { useTaskStore, type Task, type TaskStore } from './utils/store'

// Hooks
export * from './hooks'

// Types
export * from './types'

// Constants
export * from './constants'
