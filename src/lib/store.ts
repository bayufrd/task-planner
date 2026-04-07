import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  description?: string
  deadline: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedDuration?: number
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  reminderTime: number
  tags: string[]
  createdAt: string
  completedAt?: string
}

export interface TaskStore {
  tasks: Task[]
  filteredTasks: Task[]
  selectedDate: Date
  searchQuery: string
  filterPriority: string | null
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setTasks: (tasks: Task[]) => void
  setSelectedDate: (date: Date) => void
  setSearchQuery: (query: string) => void
  setFilterPriority: (priority: string | null) => void
  getTasksByDate: (date: Date) => Task[]
  getTodayTasks: () => Task[]
  getUpcomingTasks: () => Task[]
  getCompletedTasks: () => Task[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        filteredTasks: [],
        selectedDate: new Date(),
        searchQuery: '',
        filterPriority: null,

        addTask: (task) =>
          set((state) => {
            const newTask: Task = {
              ...task,
              id: generateId(),
              createdAt: new Date().toISOString(),
            }
            return { tasks: [...state.tasks, newTask] }
          }),

        updateTask: (id, updates) =>
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          })),

        deleteTask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          })),

        setTasks: (tasks) => set({ tasks }),

        setSelectedDate: (date) => set({ selectedDate: date }),

        setSearchQuery: (query) => set({ searchQuery: query }),

        setFilterPriority: (priority) => set({ filterPriority: priority }),

        getTasksByDate: (date) => {
          const { tasks } = get()
          const dateString = date.toISOString().split('T')[0]
          return tasks.filter((task) => {
            const taskDateString = task.deadline.split('T')[0]
            return taskDateString === dateString
          })
        },

        getTodayTasks: () => {
          const { getTasksByDate } = get()
          return getTasksByDate(new Date()).filter(
            (task) => task.status !== 'DONE'
          )
        },

        getUpcomingTasks: () => {
          const { tasks } = get()
          const now = new Date()
          const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

          return tasks.filter((task) => {
            const deadline = new Date(task.deadline)
            return deadline >= now && deadline <= sevenDaysFromNow && task.status !== 'DONE'
          })
        },

        getCompletedTasks: () => {
          const { tasks } = get()
          return tasks.filter((task) => task.status === 'DONE')
        },
      }),
      {
        name: 'task-store',
      }
    )
  )
)
