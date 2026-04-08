/**
 * API Response Helper
 * Standardized API responses
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function errorResponse(error: string): ApiResponse<null> {
  return {
    success: false,
    error,
    data: null,
  }
}

/**
 * Error Handler for API Routes
 */
export function handleApiError(error: unknown, defaultMessage: string = 'Internal Server Error') {
  if (error instanceof Error) {
    return errorResponse(error.message)
  }
  return errorResponse(defaultMessage)
}
