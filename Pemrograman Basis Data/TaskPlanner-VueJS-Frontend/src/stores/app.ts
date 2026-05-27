import { reactive } from 'vue'
import { aiApi, plannerApi, reminderApi, taskApi } from '../services/api'
import type {
  DailyStatsItem,
  OverviewAnalysis,
  PlannerItem,
  Reminder,
  Task,
  TaskPriority,
  TaskStats,
  TaskStatus,
  WeeklyStatsItem,
} from '../types'

export const appStore = reactive({
  tasks: [] as Task[],
  reminders: [] as Reminder[],
  planner: [] as PlannerItem[],
  stats: null as TaskStats | null,
  dailyStats: [] as DailyStatsItem[],
  weeklyStats: [] as WeeklyStatsItem[],
  analysis: null as OverviewAnalysis | null,
  loading: false,
  async bootstrap() {
    this.loading = true
    try {
      await Promise.all([
        this.loadTasks(),
        this.loadStats(),
        this.loadDailyStats(),
        this.loadWeeklyStats(),
        this.loadPlanner(),
        this.loadReminders(),
      ])
    } finally {
      this.loading = false
    }
  },
  async loadTasks(params?: { search?: string; status?: TaskStatus | ''; priority?: TaskPriority | '' }) {
    const response = await taskApi.list({ page: 1, limit: 100, ...params })
    this.tasks = response.data
    return this.tasks
  },
  async createTask(payload: Partial<Task>) {
    const created = await taskApi.create(payload)
    await this.loadTasks()
    await this.loadStats()
    await this.loadPlanner()
    return created
  },
  async updateTask(id: string, payload: Partial<Task>) {
    const updated = await taskApi.update(id, payload)
    await this.loadTasks()
    await this.loadStats()
    await this.loadPlanner()
    return updated
  },
  async updateTaskStatus(id: string, status: TaskStatus) {
    const updated = await taskApi.updateStatus(id, status)
    await this.loadTasks()
    await this.loadStats()
    await this.loadPlanner()
    return updated
  },
  async completeTask(id: string) {
    const updated = await taskApi.complete(id)
    await this.loadTasks()
    await this.loadStats()
    await this.loadPlanner()
    return updated
  },
  async skipTask(id: string) {
    const updated = await taskApi.skip(id)
    await this.loadTasks()
    await this.loadStats()
    await this.loadPlanner()
    return updated
  },
  async deleteTask(id: string) {
    await taskApi.remove(id)
    await this.loadTasks()
    await this.loadStats()
    await this.loadPlanner()
  },
  async loadStats() {
    this.stats = await taskApi.stats()
    return this.stats
  },
  async loadDailyStats(days = 7) {
    this.dailyStats = await taskApi.dailyStats(days)
    return this.dailyStats
  },
  async loadWeeklyStats(weeks = 4) {
    this.weeklyStats = await taskApi.weeklyStats(weeks)
    return this.weeklyStats
  },
  async loadPlanner(limit = 5) {
    this.planner = await plannerApi.today(limit)
    return this.planner
  },
  async loadReminders() {
    this.reminders = await reminderApi.list()
    return this.reminders
  },
  async createReminder(payload: Partial<Reminder>) {
    const created = await reminderApi.create(payload)
    await this.loadReminders()
    return created
  },
  async updateReminder(id: string, payload: Partial<Reminder>) {
    const updated = await reminderApi.update(id, payload)
    await this.loadReminders()
    return updated
  },
  async deleteReminder(id: string) {
    await reminderApi.remove(id)
    await this.loadReminders()
  },
  async generateAnalysis() {
    this.analysis = await aiApi.overviewAnalysis()
    return this.analysis
  },
})
