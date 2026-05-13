'use client'

import { useState, useEffect, useRef } from 'react'
import { useTaskStore } from '@/lib/utils/store'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNotification } from '@/lib/hooks/useNotification'
import { API_ROUTES } from '@/lib/constants/api'
import { Search, X, Lightbulb, Command, History, ArrowUp, ArrowDown } from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export default function CommandPalette({ isOpen, onClose, onOpen }: CommandPaletteProps) {
  const { t } = useLanguage()
  const notify = useNotification()
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addTask } = useTaskStore()

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('commandHistory')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setHistoryIndex(-1)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        isOpen ? onClose() : onOpen()
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
      // Arrow up/down for history navigation
      if (isOpen && inputRef.current === document.activeElement) {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          navigateHistory('up')
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          navigateHistory('down')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onOpen, history, historyIndex])

  // Navigate through command history with arrow keys
  const navigateHistory = (direction: 'up' | 'down') => {
    if (history.length === 0) return

    let newIndex = historyIndex
    if (direction === 'up') {
      newIndex = Math.min(newIndex + 1, history.length - 1)
    } else {
      newIndex = Math.max(newIndex - 1, -1)
    }

    setHistoryIndex(newIndex)
    if (newIndex === -1) {
      setInput('')
    } else {
      setInput(history[history.length - 1 - newIndex])
    }
  }

  // Save command to history
  const addToHistory = (command: string) => {
    if (!command.trim()) return

    const newHistory = [command, ...history].slice(0, 50) // Keep last 50 commands
    setHistory(newHistory)
    localStorage.setItem('commandHistory', JSON.stringify(newHistory))
  }

  // Parse natural language commands
  const parseCommand = (text: string) => {
    const trimmed = text.trim().toLowerCase()

    if (trimmed.startsWith('/')) {
      const commands = [
        '/add - Add new task',
        '/task - Add new task',
        '/list - List all tasks',
        '/today - Show today\'s tasks',
        '/help - Show help',
      ]
      setSuggestions(commands.filter(cmd => cmd.startsWith(trimmed)))
    } else if (trimmed.startsWith('add ') || trimmed === 'add') {
      setSuggestions([
        'add meeting besok jam 18:30 high',
        'add study session 2 hours deadline friday 14.00',
        'add project review deadline next week medium',
        'add call with team tomorrow 10am',
      ])
    } else if (trimmed) {
      // Show example suggestions for natural language
      setSuggestions([
        'add meeting besok 18:30',
        'add study session 2 hours deadline friday',
        'add project review deadline next week low',
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

  const parseAndCreateTask = async (text: string) => {
    // More robust parsing for task creation
    const priorityMatch = text.match(/\b(high|medium|low)\b/i)
    const durationMatch = text.match(/(\d+)\s*(?:min|m|hour|h|hr|hours?)/i)
    
    // Parse time - supports: 18:30, 18.30, 6pm, 6:30pm, 18.30, jam 18:30
    const timeMatch = text.match(/(?:jam\s+)?(\d{1,2})[\.:\.‧]?(\d{2})?\s*(?:am|pm)?|\b(\d{1,2})\s*(?:am|pm)\b/i)
    let hours = 0
    let minutes = 0
    
    if (timeMatch) {
      if (timeMatch[1]) {
        // Format: 18:30 or 18.30 or just 18
        hours = parseInt(timeMatch[1])
        minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
        
        // Check if PM was specified in the original text
        const pmMatch = text.match(/(18|19|20|21|22|23)[\.:\.‧]?(\d{2})?\s*pm/i)
        if (pmMatch || (text.toLowerCase().includes('pm') && hours < 12)) {
          // Already in 24-hour format or needs AM/PM handling
        }
      } else if (timeMatch[3]) {
        // Format: 6am, 6pm
        hours = parseInt(timeMatch[3])
        if (text.toLowerCase().includes('pm') && hours < 12) {
          hours += 12
        }
      }
    }
    
    // Remove priority, duration, and time from title
    let title = text
      .replace(/\b(high|medium|low)\b/i, '')
      .replace(/(\d+)\s*(?:min|m|hour|h|hr|hours?)/i, '')
      .replace(/(?:jam\s+)?(\d{1,2})[\.:\.‧]?(\d{2})?\s*(?:am|pm)?|\b(\d{1,2})\s*(?:am|pm)\b/i, '')
      .trim()

    // Validate title
    if (!title || title.length < 2) {
      notify.warning('Task title too short (minimum 2 characters)')
      return
    }

    if (title.length > 200) {
      notify.warning('Task title too long (maximum 200 characters)')
      return
    }

    // Calculate deadline with time
    let deadlineDate = new Date()
    const lower = text.toLowerCase()
    
    if (lower.includes('besok') || lower.includes('tomorrow')) {
      deadlineDate.setDate(deadlineDate.getDate() + 1)
    } else if (lower.includes('hari ini') || lower.includes('today')) {
      deadlineDate.setHours(23, 59, 59, 999)
    } else if (lower.includes('next week') || lower.includes('nextweek') || lower.includes('minggu depan')) {
      deadlineDate.setDate(deadlineDate.getDate() + 7)
    } else if (lower.includes('friday') || lower.includes('jumat')) {
      const day = deadlineDate.getDay()
      const daysUntilFriday = (5 - day + 7) % 7 || 7
      deadlineDate.setDate(deadlineDate.getDate() + daysUntilFriday)
    } else if (lower.includes('monday') || lower.includes('senin')) {
      const day = deadlineDate.getDay()
      const daysUntilMonday = (1 - day + 7) % 7 || 7
      deadlineDate.setDate(deadlineDate.getDate() + daysUntilMonday)
    } else if (lower.includes('next month') || lower.includes('bulan depan')) {
      deadlineDate.setMonth(deadlineDate.getMonth() + 1)
    } else {
      deadlineDate.setDate(deadlineDate.getDate() + 1)
    }
    
    // Set the parsed time
    if (hours > 0 || minutes > 0) {
      deadlineDate.setHours(hours, minutes, 0, 0)
    } else {
      // Default time if no time specified
      deadlineDate.setHours(9, 0, 0, 0) // 9 AM default
    }

    const newTask = {
      title: title.trim(),
      description: '',
      deadline: deadlineDate.toISOString(),
      priority: (priorityMatch?.[1]?.toUpperCase() || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
      estimatedDuration: durationMatch ? parseInt(durationMatch[1]) : undefined,
      status: 'TODO' as const,
      reminderTime: 60,
      tags: [],
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      // Call Express backend API to create task
      const response = await fetch(API_ROUTES.TASKS.CREATE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(newTask),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Failed to create task:', data)
        notify.error(`Failed to add task: ${data.error || 'Unknown error'}`)
        return
      }

      // Also add to local store for UI
      addTask(newTask)
      
      setInput('')
      setSuggestions([])
      onClose()

      // Format time for notification
      const timeStr = hours > 0 || minutes > 0 
        ? ` at ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        : ''
      
      const syncStatus = data.data?.googleCalendarSync?.synced 
        ? ' (synced to Google Calendar)'
        : ''
      
      notify.success(`Task added: ${newTask.title}${timeStr}${syncStatus}`)
    } catch (error) {
      console.error('Error creating task:', error)
      notify.error(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const processCommand = async (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) return

    // Save to history
    addToHistory(trimmed)

    // Handle slash commands
    if (trimmed.startsWith('/')) {
      const command = trimmed.split(' ')[0].toLowerCase()
      
      switch (command) {
        case '/add':
        case '/task':
          const taskText = trimmed.replace(/^\/(?:add|task)\s*/i, '').trim()
          if (taskText) {
            await parseAndCreateTask(taskText)
          }
          break
        case '/list':
        case '/tasks':
          console.log('📋 Tasks:', useTaskStore.getState().tasks)
          onClose()
          break
        case '/today':
          console.log('📅 Today:', useTaskStore.getState().getTodayTasks())
          onClose()
          break
        case '/help':
          notify.info('Commands: /add, /list, /today')
          setInput('')
          break
        default:
          notify.error('Unknown command. Try /help')
      }
      return
    }

    // Parse natural language
    await parseAndCreateTask(trimmed)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay - Click outside to close */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-[9998] transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
        role="presentation"
      />

      {/* Command Palette Modal Container */}
      <div 
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 px-4 sm:pt-20 pointer-events-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        {/* Modal - Clickable */}
        <div 
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <div className="flex items-center px-4 py-4 gap-3">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0" strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={t('command.placeholder')}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base font-medium"
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-200/60 dark:bg-gray-700/60 rounded-md text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <span>Enter</span>
                </kbd>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                  aria-label="Close command palette"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </form>

          {/* Suggestions & History */}
          {suggestions.length > 0 && (
            <div className="max-h-80 overflow-y-auto border-b border-gray-200/50 dark:border-gray-800/50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors border-t border-gray-100/50 dark:border-gray-800/30 text-sm group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {suggestion.includes('/') ? (
                        <Command className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" strokeWidth={2} />
                      ) : (
                        <Lightbulb className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-50 truncate">{suggestion}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {suggestion.includes('/') ? '⌘ ' + t('command.slashCommands') : '💡 ' + t('command.naturalLanguage')}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Command History */}
          {!input && history.length > 0 && suggestions.length === 0 && (
            <div className="max-h-80 overflow-y-auto border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 text-xs font-semibold text-gray-600 dark:text-gray-400 sticky top-0 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center gap-2">
                <History className="w-4 h-4" strokeWidth={2} />
                {t('command.recentCommands')} ({t('command.navigateHistory')})
              </div>
              {history.slice(0, 10).map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(cmd)}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors border-t border-gray-100/50 dark:border-gray-800/30 text-sm text-gray-700 dark:text-gray-300 group"
                >
                  <span className="text-gray-400 dark:text-gray-600 mr-2">↳</span>
                  <span className="truncate">{cmd}</span>
                </button>
              ))}
            </div>
          )}

          {/* Help Text */}
          {!input && history.length === 0 && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center justify-center gap-2">
                <Command className="w-5 h-5" strokeWidth={2} />
                {t('command.title')}
              </p>
              <div className="space-y-4 text-left max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" strokeWidth={2} />
                    {t('command.naturalLanguage')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">add meeting tomorrow 3pm high</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Command className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={2} />
                    {t('command.slashCommands')}
                  </p>
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <p><kbd className="bg-gray-200/60 dark:bg-gray-700/60 px-1.5 py-0.5 rounded text-xs font-medium">/add</kbd> {t('command.addTask')}</p>
                    <p><kbd className="bg-gray-200/60 dark:bg-gray-700/60 px-1.5 py-0.5 rounded text-xs font-medium">/list</kbd> {t('command.listTasks')}</p>
                    <p><kbd className="bg-gray-200/60 dark:bg-gray-700/60 px-1.5 py-0.5 rounded text-xs font-medium">/today</kbd> {t('command.todayTasks')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
