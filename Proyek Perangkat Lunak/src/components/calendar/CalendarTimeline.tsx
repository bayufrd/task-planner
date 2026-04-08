'use client'

import { useState } from 'react'
import { useTaskStore } from '@/lib/utils/store'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function CalendarTimeline() {
  const { selectedDate, setSelectedDate, tasks } = useTaskStore()
  const { t } = useLanguage()
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Today Quick View */}
      <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100/50 dark:border-blue-900/50 rounded-2xl p-5 hover:shadow-lg dark:hover:shadow-lg/50 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" strokeWidth={2} />
              {t('calendar.today')}
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
              {format(new Date(), 'EEEE, MMM d')}
            </h3>
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
      </div>

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
          {/* Day Headers */}
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

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const taskCount = getTaskCountForDay(day)
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())
              const isSameMonthDay = isSameMonth(day, currentMonth)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
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
    </div>
  )
}
