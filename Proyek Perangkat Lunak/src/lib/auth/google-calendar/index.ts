/**
 * Google Calendar Integration Helper
 * Handles bi-directional sync between Task Planner and Google Calendar
 */

import { google } from 'googleapis'
import type { Session } from 'next-auth'

const calendar = google.calendar('v3')

interface CreateEventParams {
  title: string
  description?: string
  deadline: Date
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface UpdateEventParams extends CreateEventParams {
  eventId: string
  calendarId: string
}

/**
 * Get authenticated Google Calendar client
 * Uses access token from NextAuth session
 */
export function getAuthenticatedCalendar(session: Session | null) {
  if (!session?.user || !(session.user as any).accessToken) {
    throw new Error('No authenticated session or access token available')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  )

  oauth2Client.setCredentials({
    access_token: (session.user as any).accessToken,
  })

  return oauth2Client
}

/**
 * Create a new event in Google Calendar
 * Returns the event ID for storing in database
 */
export async function createCalendarEvent(
  session: Session | null,
  params: CreateEventParams
) {
  try {
    if (!session?.user || !(session.user as any).accessToken) {
      throw new Error('No authenticated session or access token available')
    }

    const accessToken = (session.user as any).accessToken

    // Format color based on priority
    const colorMap: Record<string, string> = {
      HIGH: '11', // Red
      MEDIUM: '5', // Orange
      LOW: '2', // Blue
    }

    // Google Calendar API requires local time in the specified timezone
    // Convert UTC to Asia/Jakarta time
    const formatDateTimeInTimezone = (date: Date, timezone: string): string => {
      // Use Intl formatter to convert to specific timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone,
      })

      const parts = formatter.formatToParts(date)
      const partMap: Record<string, string> = {}
      parts.forEach((part) => {
        partMap[part.type] = part.value
      })

      const year = partMap.year
      const month = partMap.month
      const day = partMap.day
      const hour = partMap.hour
      const minute = partMap.minute
      const second = partMap.second

      return `${year}-${month}-${day}T${hour}:${minute}:${second}`
    }

    const timezone = 'Asia/Jakarta'
    const startDateTime = formatDateTimeInTimezone(params.deadline, timezone)
    const endDateTime = formatDateTimeInTimezone(
      new Date(params.deadline.getTime() + 60 * 60000),
      timezone
    )

    const event = {
      summary: params.title,
      description: params.description || '',
      start: {
        dateTime: startDateTime,
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: timezone,
      },
      colorId: colorMap[params.priority || 'MEDIUM'],
      transparency: 'opaque',
      visibility: 'private',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'notification', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    }

    console.log('📅 Creating event with payload:', JSON.stringify(event, null, 2))

    // Use direct HTTP call to Google Calendar API for better error handling
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Google Calendar API error response:')
      console.error('Status:', response.status)
      console.error('Error body:', JSON.stringify(data, null, 2))
      
      throw new Error(data.error?.message || `Google Calendar API error: ${response.statusText}`)
    }

    console.log('✅ Event created successfully:', data.id)
    return {
      success: true,
      eventId: data.id,
      calendarId: 'primary',
      webLink: data.htmlLink,
    }
  } catch (error: any) {
    console.error('❌ Failed to create Google Calendar event')
    console.error('Error message:', error?.message)
    console.error('Full error:', error)
    
    return {
      success: false,
      error: error?.message || 'Unknown error',
    }
  }
}

/**
 * Update an existing event in Google Calendar
 */
export async function updateCalendarEvent(
  session: Session | null,
  params: UpdateEventParams
) {
  try {
    const auth = getAuthenticatedCalendar(session)

    const colorMap: Record<string, string> = {
      HIGH: '11',
      MEDIUM: '5',
      LOW: '2',
    }

    const event = {
      summary: params.title,
      description: params.description,
      start: {
        dateTime: params.deadline.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(params.deadline.getTime() + 60 * 60000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      colorId: colorMap[params.priority || 'MEDIUM'],
    }

    const response = await calendar.events.update({
      auth,
      calendarId: params.calendarId,
      eventId: params.eventId,
      requestBody: event as any,
    })

    return {
      success: true,
      eventId: response.data.id,
      webLink: response.data.htmlLink,
    }
  } catch (error) {
    console.error('Failed to update Google Calendar event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Delete an event from Google Calendar
 */
export async function deleteCalendarEvent(
  session: Session | null,
  eventId: string,
  calendarId: string = 'primary'
) {
  try {
    const auth = getAuthenticatedCalendar(session)

    await calendar.events.delete({
      auth,
      calendarId,
      eventId,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to delete Google Calendar event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get all events from Google Calendar for a date range
 * Used for syncing existing events back to Task Planner
 */
export async function getCalendarEvents(
  session: Session | null,
  startDate: Date,
  endDate: Date
) {
  try {
    const auth = getAuthenticatedCalendar(session)

    const response = await calendar.events.list({
      auth,
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    return {
      success: true,
      events: (response.data.items || []).map((event) => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        colorId: event.colorId,
      })),
    }
  } catch (error) {
    console.error('Failed to fetch Google Calendar events:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      events: [],
    }
  }
}

/**
 * Check if Google Calendar is connected (has valid auth)
 */
export async function isCalendarConnected(session: Session | null): Promise<boolean> {
  try {
    if (!session?.user || !(session.user as any).accessToken) {
      return false
    }
    
    const auth = getAuthenticatedCalendar(session)
    
    // Try to get calendar list to verify connection
    await calendar.calendarList.list({
      auth,
    })
    
    return true
  } catch (error) {
    console.error('Calendar connection check failed:', error)
    return false
  }
}
