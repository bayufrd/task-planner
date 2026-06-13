/**
 * UI Component Utilities & Design System
 * Button, Badge, Container variants dan helper functions
 */

/**
 * Button variants dengan design system consistent
 */
export const buttonVariants = {
  primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
  secondary: 'bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300',
  success: 'bg-green-100/80 dark:bg-green-900/20 hover:bg-green-200/80 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-100/80 dark:bg-yellow-900/20 hover:bg-yellow-200/80 dark:hover:bg-yellow-800/30 text-yellow-700 dark:text-yellow-400',
  danger: 'bg-red-100/80 dark:bg-red-900/20 hover:bg-red-200/80 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400',
  ghost: 'hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300',
} as const

/**
 * Badge variants
 */
export const badgeVariants = {
  primary: 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  secondary: 'bg-gray-100/80 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300',
  success: 'bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  danger: 'bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400',
} as const

/**
 * Container variants
 */
export const containerVariants = {
  card: 'bg-white dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-xl hover:shadow-lg dark:hover:shadow-lg/50 transition-all duration-200 backdrop-blur-sm',
  section: 'bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl',
  input: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
} as const

/**
 * Icon sizes
 */
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  base: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  '2xl': 'w-8 h-8',
} as const

/**
 * Spacing scale (4px base)
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const

/**
 * Border radius
 */
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const

/**
 * Shadow variants
 */
export const shadowVariants = {
  sm: 'shadow-sm',
  base: 'shadow-md',
  lg: 'shadow-lg shadow-blue-500/20',
  xl: 'shadow-xl shadow-blue-500/30',
  '2xl': 'shadow-2xl shadow-blue-500/40',
} as const

/**
 * Merge class names helper
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get priority color gradient
 */
export function getPriorityGradient(priority: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  const map = {
    HIGH: 'from-red-600 to-orange-600',
    MEDIUM: 'from-yellow-600 to-orange-600',
    LOW: 'from-green-600 to-emerald-600',
  }
  return `bg-gradient-to-r ${map[priority]}`
}

/**
 * Get priority border color
 */
export function getPriorityBorder(priority: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  const map = {
    HIGH: 'border-l-red-500',
    MEDIUM: 'border-l-yellow-500',
    LOW: 'border-l-green-500',
  }
  return map[priority]
}
