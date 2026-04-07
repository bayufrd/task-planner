'use client'

import { useState } from 'react'
import { useTaskStore } from '@/lib/store'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'

export default function CalendarTimeline() {
  const { selectedDate, setSelectedDate, tasks } = useTaskStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get all days in current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get task count for a specific day
  const getTaskCountForDay = (day: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline)
      return (
        taskDate.getFullYear() === day.getFullYear() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getDate() === day.getDate() &&
        task.status !== 'DONE'
      )
    }).length
  }

  // Get task count for today
  const todayTaskCount = getTaskCountForDay(new Date())

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="p-4 space-y-4">
      {/* Today Quick View */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
            <h3 className="text-lg font-semibold">{format(new Date(), 'EEEE, MMMM d, yyyy')}</h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todayTaskCount}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Tasks today</p>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="space-y-2">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const taskCount = getTaskCountForDay(day)
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 rounded-lg text-center text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : isToday
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 border-2 border-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div>{format(day, 'd')}</div>
                  {taskCount > 0 && (
                    <div
                      className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white text-blue-600'
                          : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-100'
                      }`}
                    >
                      {taskCount}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
