'use client'

import { useState, useEffect, useRef } from 'react'
import { useTaskStore } from '@/lib/store'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export default function CommandPalette({ isOpen, onClose, onOpen }: CommandPaletteProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { addTask } = useTaskStore()

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        isOpen ? onClose() : onOpen()
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onOpen])

  // Parse natural language commands
  const parseCommand = (text: string) => {
    const trimmed = text.trim().toLowerCase()

    // Command suggestions
    if (trimmed.startsWith('/')) {
      const commands = [
        '/add - Add a new task',
        '/today - Show today\' priority',
        '/upcoming - Show upcoming tasks',
        '/done - Mark task as done',
        '/list - List all tasks',
      ]
      setSuggestions(commands.filter(cmd => cmd.startsWith(trimmed)))
    } else if (trimmed.startsWith('add ') || trimmed === 'add') {
      setSuggestions([
        'add meeting tomorrow 3pm high',
        'add study session 2 hours deadline friday',
        'add project review deadline next week',
      ])
    } else {
      setSuggestions([])
    }
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    parseCommand(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processCommand(input)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    processCommand(suggestion)
  }

  const processCommand = (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) return

    // Parse natural language or commands
    if (trimmed.startsWith('/add') || !trimmed.startsWith('/')) {
      // Extract task details from natural language
      const match = trimmed.match(
        /(?:add\s+)?(.+?)(?:\s+(?:deadline|due)\s+(.+?))?(?:\s+(\w+))?(?:\s+(\d+)\s*(?:min|h|hour|hours))?$/i
      )

      if (match) {
        const [, title, deadline, priority, duration] = match

        // Calculate deadline
        let deadlineDate = new Date()
        if (deadline) {
          if (deadline.toLowerCase().includes('tomorrow')) {
            deadlineDate.setDate(deadlineDate.getDate() + 1)
          } else if (deadline.toLowerCase().includes('today')) {
            // Keep today
          } else if (deadline.toLowerCase().includes('next week')) {
            deadlineDate.setDate(deadlineDate.getDate() + 7)
          } else if (deadline.toLowerCase().includes('friday')) {
            const day = deadlineDate.getDay()
            const daysUntilFriday = (5 - day + 7) % 7 || 7
            deadlineDate.setDate(deadlineDate.getDate() + daysUntilFriday)
          }
        }

        const newTask = {
          title: title.trim(),
          description: '',
          deadline: deadlineDate.toISOString(),
          priority: (priority?.toUpperCase() || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
          estimatedDuration: duration ? parseInt(duration) : undefined,
          status: 'TODO' as const,
          reminderTime: 60,
          tags: [],
        }

        addTask(newTask)

        // Reset and show success
        setInput('')
        setSuggestions([])
        onClose()

        // Show notification
        showNotification(`Task added: ${newTask.title}`)
      }
    }
  }

  const showNotification = (message: string) => {
    // You can add a toast notification here
    console.log('✅', message)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Command Palette Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0 md:flex md:items-end md:justify-center">
        <div className="w-full md:w-full md:max-w-2xl md:mb-20 bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center px-4 py-3">
              <span className="text-gray-400 dark:text-gray-600 mr-3">💬</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Add task, use /add or type naturally... (Ctrl+K to open)"
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                <span>Enter</span>
              </kbd>
            </div>
          </form>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800 text-sm"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-50">{suggestion}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {suggestion.includes('/') ? 'Command' : 'Example'}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Help Text */}
          {!input && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">Type to add a task or use commands</p>
              <div className="space-y-1 text-xs">
                <p><kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/add</kbd> - Add task</p>
                <p><kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/list</kbd> - List tasks</p>
                <p>Or type naturally: "add meeting tomorrow 3pm high"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
