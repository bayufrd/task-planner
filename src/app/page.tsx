'use client'

import { useState } from 'react'
import { useTaskStore } from '@/lib/store'
import { useTheme } from '@/components/providers/ThemeProvider'
import CalendarTimeline from '@/components/calendar/CalendarTimeline'
import TaskPriorityList from '@/components/tasks/TaskPriorityList'
import CommandPalette from '@/components/command/CommandPalette'
import Header from '@/components/layout/Header'

export default function Home() {
  const { tasks } = useTaskStore()
  const { theme, toggleTheme } = useTheme()
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  // Open command palette with Ctrl+K or Cmd+K
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      setShowCommandPalette(true)
    }
  }

  return (
    <div 
      className="h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <Header onToggleTheme={toggleTheme} currentTheme={theme} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar Timeline - Top Section */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <CalendarTimeline />
        </div>

        {/* Tasks Display - Middle Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold mb-2">No tasks yet</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first task using the command palette (Ctrl+K)
                </p>
              </div>
            ) : (
              <TaskPriorityList />
            )}
          </div>
        </div>
      </div>

      {/* Command Palette - Bottom Section */}
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onOpen={() => setShowCommandPalette(true)}
      />
    </div>
  )
}
