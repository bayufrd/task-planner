"use client";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface CalendarPickerProps {
  value?: string;
  onChange?: (date: string) => void;
  minDate?: Date;
}

export default function CalendarPicker({ value, onChange, minDate }: CalendarPickerProps) {
  const { theme } = useTheme();
  
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const mutedColor = isDark ? "text-gray-400" : "text-gray-500";
  const hoverBg = isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const todayDot = isDark ? "dark:data-today:after:bg-gray-300" : "data-today:after:bg-gray-900";
  const selectedBg = isDark 
    ? "data-selected:bg-gray-200 data-selected:text-gray-900 dark:data-selected:bg-gray-200 dark:data-selected:text-gray-900" 
    : "data-selected:bg-gray-900 data-selected:text-white";
  const todaySelected = isDark 
    ? "data-selected:data-today:after:bg-gray-900" 
    : "data-selected:data-today:after:bg-white";

  const parsedDate = value ? parseDate(new Date(value)) : parseDate(new Date());
  
  return (
    <DatePicker.Root
      inline
      value={parsedDate ? [parsedDate] : undefined}
      onValueChange={(details) => {
        if (details.value && details.value[0] && onChange) {
          const d = details.value[0].toDate("UTC");
          onChange(d.toISOString().slice(0, 10));
        }
      }}
      isDateUnavailable={minDate ? (date) => date.compare(parseDate(minDate)) < 0 : undefined}
    >
      <DatePicker.Content className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-3 inline-block`}>
        <DatePicker.View view="day">
          <DatePicker.Context>
            {(api) => (
              <>
                <DatePicker.ViewControl className="flex items-center justify-between mb-3">
                  <DatePicker.PrevTrigger className={`p-1 rounded-md transition-colors ${hoverBg} ${mutedColor}`}>
                    <ChevronLeftIcon className="w-4 h-4" />
                  </DatePicker.PrevTrigger>
                  <DatePicker.ViewTrigger className={`text-sm font-medium ${textColor} ${hoverBg} px-2 py-1 rounded-md transition-colors`}>
                    <DatePicker.RangeText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.NextTrigger className={`p-1 rounded-md transition-colors ${hoverBg} ${mutedColor}`}>
                    <ChevronRightIcon className="w-4 h-4" />
                  </DatePicker.NextTrigger>
                </DatePicker.ViewControl>
                <DatePicker.Table className="w-full border-separate border-spacing-y-0.5">
                  <DatePicker.TableHead>
                    <DatePicker.TableRow>
                      {api.weekDays.map((weekDay, id) => (
                        <DatePicker.TableHeader
                          key={id}
                          className={`text-sm font-medium ${mutedColor} w-9 h-7 text-center`}
                        >
                          {weekDay.narrow}
                        </DatePicker.TableHeader>
                      ))}
                    </DatePicker.TableRow>
                  </DatePicker.TableHead>
                  <DatePicker.TableBody>
                    {api.weeks.map((week, id) => (
                      <DatePicker.TableRow key={id}>
                        {week.map((day, id) => (
                          <DatePicker.TableCell key={id} value={day} className="p-0">
                            <DatePicker.TableCellTrigger className={`relative w-9 h-9 text-sm ${textColor} ${hoverBg} transition-colors rounded-lg flex items-center justify-center font-medium data-outside-range:${mutedColor} data-unavailable:${mutedColor} data-unavailable:line-through flex items-center justify-center ${selectedBg} ${todayDot} data-today:after:content-[''] data-today:after:absolute data-today:after:bottom-0.5 data-today:after:w-1 data-today:after:h-1 data-today:after:rounded-full ${todaySelected}`}>
                              {day.day}
                            </DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        ))}
                      </DatePicker.TableRow>
                    ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
        <DatePicker.View view="month">
          <DatePicker.Context>
            {(api) => (
              <>
                <DatePicker.ViewControl className="flex items-center justify-between mb-4">
                  <DatePicker.PrevTrigger className={`p-1 rounded-md transition-colors ${hoverBg} ${mutedColor}`}>
                    <ChevronLeftIcon className="w-4 h-4" />
                  </DatePicker.PrevTrigger>
                  <DatePicker.ViewTrigger className={`text-base font-semibold ${textColor} ${hoverBg} px-2 py-1 rounded-md transition-colors`}>
                    <DatePicker.RangeText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.NextTrigger className={`p-1 rounded-md transition-colors ${hoverBg} ${mutedColor}`}>
                    <ChevronRightIcon className="w-4 h-4" />
                  </DatePicker.NextTrigger>
                </DatePicker.ViewControl>
                <DatePicker.Table className="w-full border-separate border-spacing-y-0.5">
                  <DatePicker.TableBody>
                    {api.getMonthsGrid({ columns: 4, format: "short" }).map((months, id) => (
                      <DatePicker.TableRow key={id}>
                        {months.map((month, id) => (
                          <DatePicker.TableCell key={id} value={month.value}>
                            <DatePicker.TableCellTrigger className={`w-16 h-10 text-sm ${textColor} ${hoverBg} rounded-lg transition-colors flex items-center justify-center font-medium ${selectedBg}`}>
                              {month.label}
                            </DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        ))}
                      </DatePicker.TableRow>
                    ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
        <DatePicker.View view="year">
          <DatePicker.Context>
            {(api) => (
              <>
                <DatePicker.ViewControl className="flex items-center justify-between mb-4">
                  <DatePicker.PrevTrigger className={`p-1 rounded-md transition-colors ${hoverBg} ${mutedColor}`}>
                    <ChevronLeftIcon className="w-4 h-4" />
                  </DatePicker.PrevTrigger>
                  <DatePicker.ViewTrigger className={`text-base font-semibold ${textColor} ${hoverBg} px-2 py-1 rounded-md transition-colors`}>
                    <DatePicker.RangeText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.NextTrigger className={`p-1 rounded-md transition-colors ${hoverBg} ${mutedColor}`}>
                    <ChevronRightIcon className="w-4 h-4" />
                  </DatePicker.NextTrigger>
                </DatePicker.ViewControl>
                <DatePicker.Table className="w-full border-separate border-spacing-y-0.5">
                  <DatePicker.TableBody>
                    {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                      <DatePicker.TableRow key={id}>
                        {years.map((year, id) => (
                          <DatePicker.TableCell key={id} value={year.value}>
                            <DatePicker.TableCellTrigger className={`w-16 h-10 text-sm ${textColor} ${hoverBg} rounded-lg transition-colors flex items-center justify-center font-medium ${selectedBg}`}>
                              {year.label}
                            </DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        ))}
                      </DatePicker.TableRow>
                    ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
</object>