/**
 * API Response Helpers
 * Standardized response formats untuk semua API endpoints
 */

import { NextResponse } from 'next/server'

/**
 * Success response wrapper
 */
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Error response wrapper
 */
export function errorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  details?: any,
  status: number = 500
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Pagination response wrapper
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
) {
  const totalPages = Math.ceil(total / limit)
  
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

/**
 * Validation error response
 */
export function validationError(
  errors: Record<string, string[]>,
  message: string = 'Validation failed'
) {
  return errorResponse(
    message,
    'VALIDATION_ERROR',
    errors,
    400
  )
}

/**
 * Not found response
 */
export function notFoundResponse(resource: string) {
  return errorResponse(
    `${resource} not found`,
    'NOT_FOUND',
    undefined,
    404
  )
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return errorResponse(message, 'UNAUTHORIZED', undefined, 401)
}

/**
 * Forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden') {
  return errorResponse(message, 'FORBIDDEN', undefined, 403)
}
