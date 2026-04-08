/**
 * Task Management API Routes
 * Base URL: /api/tasks
 * 
 * Endpoints:
 * - GET /api/tasks                    → List all tasks
 * - POST /api/tasks                   → Create new task
 * - GET /api/tasks/today              → Get today's tasks
 * - GET /api/tasks/upcoming           → Get next 7 days tasks
 * - GET /api/tasks/priority/:priority → Get tasks by priority
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, paginatedResponse, errorResponse, validationError } from '@/lib/api/responses'
import { validatePaginationParams, validateSearchQuery } from '@/lib/api/validation'
import { syncTaskToCalendar } from '@/lib/api/google-calendar-sync'
import { prisma } from '@/lib/db'

// ============================================================================
// GET /api/tasks
// ============================================================================
// Query parameters:
// - ?search=text         - Search tasks by title/description
// - ?status=TODO         - Filter by status (TODO, IN_PROGRESS, DONE)
// - ?priority=HIGH       - Filter by priority (HIGH, MEDIUM, LOW)
// - ?sort=deadline       - Sort by field (deadline, priority, createdAt)
// - ?order=asc           - Sort order (asc, desc)
// - ?limit=20            - Results per page
// - ?page=1              - Page number
//
export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.error('❌ Unauthorized: No session found')
      return errorResponse('Unauthorized', 'UNAUTHORIZED')
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const sort = searchParams.get('sort') || 'deadline'
    const order = searchParams.get('order') || 'asc'
    
    const paginationValidation = validatePaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    )

    if (!paginationValidation.valid) {
      return validationError(paginationValidation.errors)
    }

    const { page, limit } = paginationValidation

    // Query tasks dari database
    const where: any = {
      userId: session.user.id,
    }

    // Add filters
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) where.status = status
    if (priority) where.priority = priority

    // Map sort field
    const sortField = sort as keyof typeof prisma.task.fields || 'deadline'
    const orderBy: Record<string, 'asc' | 'desc'> = {
      [sortField]: (order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
    }

    // Query database dengan Prisma
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ])

    return paginatedResponse(tasks, page, limit, total)
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return errorResponse('Failed to fetch tasks', 'FETCH_ERROR')
  }
}

// ============================================================================
// POST /api/tasks
// ============================================================================
// Create a new task
// Request body:
// {
//   title: string (required)
//   description?: string
//   priority: 'HIGH' | 'MEDIUM' | 'LOW'
//   deadline: ISO string
//   status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
//   tags?: string[]
//   estimatedDuration?: number (minutes)
// }
//
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.error('❌ Unauthorized: No session found')
      return errorResponse('Unauthorized', 'UNAUTHORIZED')
    }

    console.log('✅ User session found:', session.user.id)

    const body = await request.json()

    // Validate required fields
    if (!body.title || body.title.trim().length === 0) {
      console.error('❌ Validation: Task title is required')
      return errorResponse('Task title is required', 'VALIDATION_ERROR')
    }

    if (!body.deadline) {
      console.error('❌ Validation: Task deadline is required')
      return errorResponse('Task deadline is required', 'VALIDATION_ERROR')
    }

    console.log('📝 Creating task:', {
      title: body.title,
      deadline: body.deadline,
      priority: body.priority || 'MEDIUM',
    })

    // Create task in database
    const newTask = await prisma.task.create({
      data: {
        userId: session.user.id,
        title: body.title,
        description: body.description || '',
        deadline: new Date(body.deadline),
        priority: body.priority || 'MEDIUM',
        status: body.status || 'TODO',
        estimatedDuration: body.estimatedDuration,
      },
    })

    console.log('💾 Task saved to database:', newTask.id)

    // TODO: Fix Google Calendar sync - currently returns 400 Bad Request
    // Will uncomment after fixing timezone/datetime format issues
    /*
    const calendarResult = await syncTaskToCalendar(session, {
      title: body.title,
      description: body.description,
      deadline: new Date(body.deadline),
      priority: body.priority || 'MEDIUM',
    })

    if (calendarResult.success) {
      console.log('✅ Google Calendar sync successful:', calendarResult.eventId)
      // Update task dengan Google Calendar event ID
      await prisma.task.update({
        where: { id: newTask.id },
        data: {
          googleCalendarEventId: calendarResult.eventId,
          googleCalendarId: calendarResult.calendarId,
        },
      })
    } else {
      console.error('❌ Google Calendar sync failed:', calendarResult.error)
    }
    */

    // Placeholder sync result while debugging
    const calendarResult = {
      success: false,
      error: 'Google Calendar sync temporarily disabled',
    }

    return successResponse(
      {
        id: newTask.id,
        title: newTask.title,
        deadline: newTask.deadline,
        priority: newTask.priority,
        status: newTask.status,
        googleCalendarEventId: null,
        googleCalendarSync: {
          synced: false,
          error: 'Google Calendar sync temporarily disabled - will be re-enabled after fixing datetime format issues',
        },
      },
      'Task created successfully (Google Calendar sync disabled)',
      201
    )
  } catch (error) {
    console.error('❌ POST /api/tasks error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse(`Failed to create task: ${errorMsg}`, 'SERVER_ERROR')
  }
}
