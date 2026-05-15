'use client'

import { useTheme } from '@/components/providers/ThemeProvider'

const timeSlots = [
  '00:00', '00:30',
  '01:00', '01:30',
  '02:00', '02:30',
  '03:00', '03:30',
  '04:00', '04:30',
  '05:00', '05:30',
  '06:00', '06:30',
  '07:00', '07:30',
  '08:00', '08:30',
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30',
  '21:00', '21:30',
  '22:00', '22:30',
  '23:00', '23:30',
  '24:00'
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