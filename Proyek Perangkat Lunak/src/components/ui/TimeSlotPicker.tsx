'use client'

import { useTheme } from '@/components/providers/ThemeProvider'

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

interface TimeSlotPickerProps {
  value: string
  onChange: (time: string) => void
  disabled?: boolean
}

export default function TimeSlotPicker({ value, onChange, disabled }: TimeSlotPickerProps) {
  const { theme } = useTheme()

  return (
    <div
      className={`w-full md:w-32 max-h-[180px] md:max-h-none overflow-y-auto rounded-lg border p-2 ${
        theme === 'dark'
          ? 'border-gray-700 bg-gray-900'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="grid grid-cols-4 md:grid-cols-1 gap-1.5">
        {timeSlots.map((time) => {
          const selected = value === time
          return (
            <button
              key={time}
              type="button"
              disabled={disabled}
              onClick={() => onChange(time)}
              className={`w-full px-2 py-1.5 text-sm rounded-lg border transition-all ${
                selected
                  ? theme === 'dark'
                    ? 'bg-gray-200 text-gray-900 border-gray-200'
                    : 'bg-gray-900 text-white border-gray-900'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {time}
            </button>
          )
        })}
      </div>
    </div>
  )
}