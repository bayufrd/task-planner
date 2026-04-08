/**
 * Google Calendar Sync API
 * GET /api/sync/calendar - Pull events from Google Calendar and sync to Task Planner
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCalendarEvents, isCalendarConnected } from '@/lib/auth/google-calendar'
import { successResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api/responses'

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return unauthorizedResponse('User not authenticated')
    }

    // Check if calendar is connected
    const connected = await isCalendarConnected(session)
    if (!connected) {
      return forbiddenResponse('Google Calendar not connected')
    }

    // Get date range (default: last 30 days to next 30 days)
    const searchParams = request.nextUrl.searchParams
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    const now = new Date()
    const startDate = startDateParam ? new Date(startDateParam) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const endDate = endDateParam ? new Date(endDateParam) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Fetch events from Google Calendar
    const result = await getCalendarEvents(session, startDate, endDate)

    if (!result.success) {
      return errorResponse(
        result.error || 'Failed to fetch calendar events',
        'CALENDAR_FETCH_ERROR',
        undefined,
        500
      )
    }

    return successResponse({
      message: 'Calendar synced successfully',
      count: result.events.length,
      events: result.events,
      syncedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Calendar sync error:', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      'CALENDAR_SYNC_ERROR',
      undefined,
      500
    )
  }
}
