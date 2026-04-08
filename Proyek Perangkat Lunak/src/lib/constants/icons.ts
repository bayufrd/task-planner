/**
 * Icon System & Mappings
 * Sentralisasi icon usage across aplikasi
 */

import {
  Circle,
  HourglassIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  CheckSquare2,
  Plus,
  Command,
  Settings,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  ListTodo,
  Lightbulb,
  History,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

/**
 * Task Status Icons
 */
export const TaskStatusIcons = {
  TODO: {
    icon: Circle,
    className: 'text-gray-400',
  },
  IN_PROGRESS: {
    icon: HourglassIcon,
    className: 'text-blue-600 dark:text-blue-400',
  },
  DONE: {
    icon: CheckCircle2,
    className: 'text-green-600 dark:text-green-400',
  },
} as const

/**
 * Priority Icons & Colors
 */
export const PriorityIcons = {
  HIGH: {
    icon: AlertCircle,
    className: 'text-red-600 dark:text-red-400',
    badgeClass: 'from-red-600 to-orange-600',
  },
  MEDIUM: {
    icon: AlertCircle,
    className: 'text-yellow-600 dark:text-yellow-400',
    badgeClass: 'from-yellow-600 to-orange-600',
  },
  LOW: {
    icon: Circle,
    className: 'text-green-600 dark:text-green-400',
    badgeClass: 'from-green-600 to-emerald-600',
  },
} as const

/**
 * Common Icon Exports
 */
export {
  Calendar,
  Clock,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  CheckSquare2,
  Plus,
  Command,
  Settings,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  ListTodo,
  Lightbulb,
  History,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  HourglassIcon,
  Circle,
}
