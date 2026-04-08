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
import { successResponse, paginatedResponse, errorResponse, validationError } from '@/lib/api/responses'
import { validatePaginationParams, validateSearchQuery } from '@/lib/api/validation'

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

    // TODO: Implement database query with Prisma
    // const where: Prisma.TaskWhereInput = {
    //   AND: [
    //     search ? { 
    //       OR: [
    //         { title: { contains: search, mode: 'insensitive' } },
    //         { description: { contains: search, mode: 'insensitive' } }
    //       ]
    //     } : {},
    //     status ? { status } : {},
    //     priority ? { priority } : {},
    //   ]
    // }
    //
    // const [tasks, total] = await Promise.all([
    //   prisma.task.findMany({
    //     where,
    //     orderBy: { [sort]: order },
    //     skip: (page - 1) * limit,
    //     take: limit,
    //   }),
    //   prisma.task.count({ where })
    // ])

    return paginatedResponse([], page, limit, 0)
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
    const body = await request.json()

    // TODO: Validate input with validation helper
    // const validation = validateTaskInput(body)
    // if (!validation.valid) {
    //   return validationError(validation.errors)
    // }

    // TODO: Create task in database
    // const newTask = await prisma.task.create({
    //   data: {
    //     ...body,
    //     status: body.status || 'TODO',
    //   },
    // })

    return successResponse(
      {},
      'Task created successfully',
      201
    )
  } catch (error) {
    console.error('POST /api/tasks error:', error)
    return errorResponse('Failed to create task', 'CREATE_ERROR')
  }
}
