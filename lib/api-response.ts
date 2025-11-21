import { NextResponse } from 'next/server'
import { ApiSuccessResponse, ApiErrorResponse } from '@/types'

/**
 * Create a standardized success response
 * @param data - Response data
 * @param message - Optional success message
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with standardized success format
 */
export function successResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

/**
 * Create a standardized error response
 * @param error - Error message
 * @param status - HTTP status code (default: 500)
 * @param details - Optional error details (for validation errors, etc.)
 * @returns NextResponse with standardized error format
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
      statusCode: status,
    },
    { status }
  )
}

/**
 * Common error responses for reuse
 */
export const ErrorResponses = {
  // 400 - Bad Request
  badRequest: (message: string = 'Bad request', details?: unknown) =>
    errorResponse(message, 400, details),

  // 401 - Unauthorized
  unauthorized: (message: string = 'Unauthorized') =>
    errorResponse(message, 401),

  // 403 - Forbidden
  forbidden: (message: string = 'Forbidden') =>
    errorResponse(message, 403),

  // 404 - Not Found
  notFound: (message: string = 'Resource not found') =>
    errorResponse(message, 404),

  // 409 - Conflict
  conflict: (message: string = 'Resource already exists') =>
    errorResponse(message, 409),

  // 422 - Unprocessable Entity
  validationError: (message: string = 'Validation failed', details?: unknown) =>
    errorResponse(message, 422, details),

  // 429 - Too Many Requests
  tooManyRequests: (message: string = 'Too many requests') =>
    errorResponse(message, 429),

  // 500 - Internal Server Error
  internalError: (message: string = 'Internal server error') =>
    errorResponse(message, 500),

  // 503 - Service Unavailable
  serviceUnavailable: (message: string = 'Service temporarily unavailable') =>
    errorResponse(message, 503),
}
