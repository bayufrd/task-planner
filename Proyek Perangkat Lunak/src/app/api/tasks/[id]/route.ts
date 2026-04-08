/**
 * Task Detail API Routes
 * Base URL: /api/tasks/:id
 * 
 * Endpoints:
 * - GET /api/tasks/:id    → Get task details
 * - PUT /api/tasks/:id    → Update task
 * - DELETE /api/tasks/:id → Delete task
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { successResponse, errorResponse, notFoundResponse, validationError } from '@/lib/api/responses'
import { validateId } from '@/lib/api/validation'

type RouteParams = {
  params: { id: string }
}

// ============================================================================
// GET /api/tasks/:id
// ============================================================================
// Get single task details
// Response:
// {
//   id: string
//   title: string
//   description?: string
//   priority: 'HIGH' | 'MEDIUM' | 'LOW'
//   status: 'TODO' | 'IN_PROGRESS' | 'DONE'
//   deadline: ISO string
//   createdAt: ISO string
//   updatedAt: ISO string
// }
//
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const idValidation = validateId(id)
    if (!idValidation.valid) {
      return errorResponse(idValidation.error || 'Invalid ID', 'INVALID_ID', undefined, 400)
    }

    // TODO: Fetch single task from database
    // const task = await prisma.task.findUnique({
    //   where: { id },
    //   include: {
    //     subtasks: true,
    //     tags: true,
    //   }
    // })
    //
    // if (!task) {
    //   return notFoundResponse('Task')
    // }

    return successResponse({})
  } catch (error) {
    console.error(`GET /api/tasks/${params.id} error:`, error)
    return errorResponse('Failed to fetch task', 'FETCH_ERROR')
  }
}

// ============================================================================
// PUT /api/tasks/:id
// ============================================================================
// Update task
// Request body: (all fields optional)
// {
//   title?: string
//   description?: string
//   priority?: 'HIGH' | 'MEDIUM' | 'LOW'
//   status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
//   deadline?: ISO string
// }
//
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const body = await request.json()

    const idValidation = validateId(id)
    if (!idValidation.valid) {
      return errorResponse(idValidation.error || 'Invalid ID', 'INVALID_ID', undefined, 400)
    }

    // TODO: Validate update data with validation helper
    // TODO: Update task in database
    // const updatedTask = await prisma.task.update({
    //   where: { id },
    //   data: body,
    // })

    return successResponse({}, 'Task updated successfully')
  } catch (error) {
    console.error(`PUT /api/tasks/${params.id} error:`, error)
    return errorResponse('Failed to update task', 'UPDATE_ERROR')
  }
}

// ============================================================================
// DELETE /api/tasks/:id
// ============================================================================
// Delete task
//
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const idValidation = validateId(id)
    if (!idValidation.valid) {
      return errorResponse(idValidation.error || 'Invalid ID', 'INVALID_ID', undefined, 400)
    }

    // TODO: Delete task from database
    // await prisma.task.delete({
    //   where: { id }
    // })

    return successResponse({}, 'Task deleted successfully')
  } catch (error) {
    console.error(`DELETE /api/tasks/${params.id} error:`, error)
    return errorResponse('Failed to delete task', 'DELETE_ERROR')
  }
}
