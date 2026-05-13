'use client'

import { useState } from 'react'
import { useTaskStore } from '@/lib/utils/store'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, X, Clock, Tag } from 'lucide-react'
import { cn } from '@/lib/utils/ui'

export default function CalendarTimeline() {
  const { selectedDate, setSelectedDate, tasks } = useTaskStore()
  const { t } = useLanguage()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDay = (day: Date) => {
    // Normalize day to Date object (handles persisted string from localStorage)
    const normalizedDay = day instanceof Date ? day : new Date(day)
    return tasks
      .filter((task) => {
        const taskDate = new Date(task.deadline)
        return (
          taskDate.getFullYear() === normalizedDay.getFullYear() &&
          taskDate.getMonth() === normalizedDay.getMonth() &&
          taskDate.getDate() === normalizedDay.getDate() &&
          task.status !== 'DONE'
        )
      })
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
  }

  const todayTaskCount = getTasksForDay(new Date()).length
  const selectedDateTasks = getTasksForDay(selectedDate)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
    setIsDateModalOpen(true)
  }

  const priorityClass = {
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    MEDIUM: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Today Quick View */}
      <button
        type="button"
        onClick={() => handleDateClick(new Date())}
        className="w-full text-left bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100/50 dark:border-blue-900/50 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-lg/50 transition-all duration-300 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" strokeWidth={2} />
              {t('calendar.today')}
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
              {format(new Date(), 'EEEE, MMM d')}
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Click to view tasks for today
            </p>
          </div>
          <div className="text-right bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {todayTaskCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
              {todayTaskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
      </button>

      {/* Month Selector & Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-50">
            {format(currentMonth, 'MMMM')}
            <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
              {format(currentMonth, 'yyyy')}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1 backdrop-blur-sm">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/80 dark:hover:bg-gray-700/80 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 hover:bg-blue-600/20 dark:hover:bg-blue-600/30 rounded-md transition-all duration-200 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/80 dark:hover:bg-gray-700/80 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Next month"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="space-y-3 min-w-full">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const taskCount = getTasksForDay(day).length
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())
              const isSameMonthDay = isSameMonth(day, currentMonth)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  disabled={!isSameMonthDay}
                  className={`relative p-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-200 group ${
                    !isSameMonthDay
                      ? 'text-gray-400 dark:text-gray-600 cursor-default'
                      : isSelected
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : isToday
                      ? 'bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                  }`}
                  title={`View tasks for ${format(day, 'MMM d, yyyy')}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{format(day, 'd')}</span>
                    {taskCount > 0 && (
                      <div
                        className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                          isSelected
                            ? 'bg-white/30 text-white'
                            : isToday
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                            : 'bg-orange-100/80 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}
                      >
                        {taskCount}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {isDateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setIsDateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-800 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Tasks by date
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedDateTasks.length} active task{selectedDateTasks.length === 1 ? '' : 's'}
                </p>
              </div>
              <button
                onClick={() => setIsDateModalOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                aria-label="Close task list"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              {selectedDateTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-3 font-semibold text-gray-800 dark:text-gray-200">
                    No active tasks on this date
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pick another date or create a new task for this day.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/70"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-50">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold',
                            priorityClass[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 dark:bg-gray-800">
                          <Clock className="h-3.5 w-3.5" />
                          {format(new Date(task.deadline), 'HH:mm')}
                        </span>
                        <span className="rounded-lg bg-white px-2 py-1 dark:bg-gray-800">
                          {task.status}
                        </span>
                        {task.estimatedDuration && (
                          <span className="rounded-lg bg-white px-2 py-1 dark:bg-gray-800">
                            {task.estimatedDuration} min
                          </span>
                        )}
                      </div>

                      {task.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}