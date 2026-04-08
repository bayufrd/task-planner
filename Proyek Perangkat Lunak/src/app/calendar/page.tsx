'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { id, enUS } from 'date-fns/locale'

export default function CalendarPage() {
  const { language, t } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const locale = language === 'id' ? id : enUS
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t('header.calendar')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {format(currentDate, 'MMMM yyyy', { locale })}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
            <Plus className="w-5 h-5" strokeWidth={2} />
            New Task
          </button>
        </div>

        {/* Calendar Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" strokeWidth={2} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy', { locale })}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" strokeWidth={2} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold text-gray-600 dark:text-gray-400 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => (
              <button
                key={day.toISOString()}
                className={`p-4 rounded-lg transition-all border text-center font-medium ${
                  isToday(day)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                    : isSameMonth(day, currentDate)
                    ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'bg-gray-50/50 dark:bg-gray-800/20 text-gray-400 dark:text-gray-600 border-transparent'
                }`}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Days</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{daysInMonth.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Current Month</p>
            <p className="text-2xl font-bold text-blue-600">{format(currentDate, 'MMMM', { locale })}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Year</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentDate.getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
