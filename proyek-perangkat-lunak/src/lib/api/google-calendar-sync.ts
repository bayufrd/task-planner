/**
 * Google Calendar Sync Helper
 * Handles task synchronization with Google Calendar
 */

import type { Session } from 'next-auth'
import { createCalendarEvent } from '@/lib/auth/google-calendar'

interface SyncTaskToCalendarParams {
  title: string
  description?: string
  deadline: Date
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

/**
 * Sync task to Google Calendar
 * @param session - User session
 * @param taskData - Task data to sync
 * @returns Sync result with event ID and status
 */
export async function syncTaskToCalendar(
  session: Session | null,
  taskData: SyncTaskToCalendarParams
) {
  if (!session) {
    return {
      success: false,
      error: 'No session available',
    }
  }

  try {
    console.log('Attempting Google Calendar sync...')
    const calendarResult = await createCalendarEvent(session, taskData)

    if (calendarResult.success) {
      console.log('Google Calendar sync successful:', calendarResult.eventId)
      return {
        success: true,
        eventId: calendarResult.eventId,
        calendarId: calendarResult.calendarId,
        webLink: calendarResult.webLink,
      }
    } else {
      console.error('Google Calendar sync failed:', calendarResult.error)
      return {
        success: false,
        error: calendarResult.error,
      }
    }
  } catch (error) {
    console.error('Error syncing task to calendar:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
