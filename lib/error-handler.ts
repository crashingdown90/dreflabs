import { log } from '@/lib/logger'

/**
 * Centralized error handling utilities
 * Sanitizes error messages to prevent information disclosure in production
 */

export interface ApiError {
  success: false
  message: string
  code?: string
  details?: any
}

/**
 * Handle API errors with appropriate sanitization for production
 */
export function handleApiError(
  error: any,
  isDevelopment: boolean = process.env.NODE_ENV === 'development'
): ApiError {
  // SECURITY: Log full error server-side for debugging but sanitize sensitive info
  if (isDevelopment) {
    log.error('API Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString()
    })
  } else {
    // In production, log minimal info without sensitive details
    log.error('API Error:', {
      code: error.code,
      timestamp: new Date().toISOString()
    })
  }

  // SECURITY: Even in development, sanitize database paths and sensitive info
  if (isDevelopment) {
    return {
      success: false,
      message: sanitizeErrorMessage(error.message || 'An error occurred'),
      code: error.code,
      details: {
        // Don't include full stack trace or raw error object
      }
    }
  }

  // In production, return sanitized error messages
  const errorMessages: Record<string, string> = {
    // SQLite errors
    'SQLITE_CONSTRAINT': 'A record with this information already exists',
    'SQLITE_CONSTRAINT_UNIQUE': 'This value must be unique',
    'SQLITE_CONSTRAINT_FOREIGNKEY': 'Referenced record does not exist',
    'SQLITE_ERROR': 'Database error occurred',
    'SQLITE_BUSY': 'Database is busy, please try again',
    
    // File system errors
    'ENOENT': 'Resource not found',
    'EACCES': 'Permission denied',
    'EEXIST': 'Resource already exists',
    'EISDIR': 'Expected a file but found a directory',
    'ENOTDIR': 'Expected a directory but found a file',
    
    // Network errors
    'ECONNREFUSED': 'Connection refused',
    'ETIMEDOUT': 'Request timed out',
    'ENOTFOUND': 'Resource not found',
    
    // JWT errors
    'ERR_JWT_EXPIRED': 'Your session has expired. Please log in again',
    'ERR_JWT_INVALID': 'Invalid authentication token',
    'ERR_JWS_INVALID': 'Invalid authentication signature',
    
    // Validation errors
    'VALIDATION_ERROR': 'Invalid input data',
    'INVALID_EMAIL': 'Invalid email address',
    'INVALID_URL': 'Invalid URL format',
  }

  // Check if error code matches known errors
  if (error.code && errorMessages[error.code]) {
    return {
      success: false,
      message: errorMessages[error.code],
      code: error.code
    }
  }

  // Check if error message contains known patterns
  if (error.message) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return {
        success: false,
        message: 'A record with this information already exists',
        code: 'DUPLICATE_ENTRY'
      }
    }
    
    if (error.message.includes('FOREIGN KEY constraint failed')) {
      return {
        success: false,
        message: 'Cannot perform this action due to related records',
        code: 'FOREIGN_KEY_VIOLATION'
      }
    }
    
    if (error.message.includes('NOT NULL constraint failed')) {
      return {
        success: false,
        message: 'Required field is missing',
        code: 'MISSING_REQUIRED_FIELD'
      }
    }
  }

  // Default generic error message for production
  return {
    success: false,
    message: 'An error occurred. Please try again later.',
    code: 'INTERNAL_ERROR'
  }
}

/**
 * Handle database errors specifically
 */
export function handleDatabaseError(error: any): ApiError {
  log.error('Database Error:', error)

  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    return {
      success: false,
      message: `Database error: ${error.message}`,
      code: error.code,
      details: error
    }
  }

  // Check for specific database errors
  if (error.message?.includes('UNIQUE constraint')) {
    return {
      success: false,
      message: 'This record already exists',
      code: 'DUPLICATE_ENTRY'
    }
  }

  if (error.message?.includes('FOREIGN KEY')) {
    return {
      success: false,
      message: 'Cannot perform this action due to related records',
      code: 'FOREIGN_KEY_VIOLATION'
    }
  }

  if (error.message?.includes('NOT NULL')) {
    return {
      success: false,
      message: 'Required field is missing',
      code: 'MISSING_REQUIRED_FIELD'
    }
  }

  return {
    success: false,
    message: 'Database operation failed',
    code: 'DATABASE_ERROR'
  }
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: any): ApiError {
  log.error('Authentication Error:', error)

  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    return {
      success: false,
      message: `Auth error: ${error.message}`,
      code: error.code
    }
  }

  if (error.code === 'ERR_JWT_EXPIRED' || error.message?.includes('expired')) {
    return {
      success: false,
      message: 'Your session has expired. Please log in again',
      code: 'SESSION_EXPIRED'
    }
  }

  if (error.code === 'ERR_JWT_INVALID' || error.message?.includes('invalid')) {
    return {
      success: false,
      message: 'Invalid authentication. Please log in again',
      code: 'INVALID_AUTH'
    }
  }

  return {
    success: false,
    message: 'Authentication failed',
    code: 'AUTH_ERROR'
  }
}

/**
 * Handle validation errors
 */
export function handleValidationError(field: string, message: string): ApiError {
  return {
    success: false,
    message: `${field}: ${message}`,
    code: 'VALIDATION_ERROR'
  }
}

/**
 * Sanitize error message to remove sensitive information
 */
export function sanitizeErrorMessage(message: string): string {
  // Remove file paths
  let sanitized = message.replace(/\/[^\s]+\.(ts|js|tsx|jsx)/g, '[file]')
  
  // Remove line numbers
  sanitized = sanitized.replace(/:\d+:\d+/g, '')
  
  // Remove stack traces
  sanitized = sanitized.split('\n')[0]
  
  // Remove SQL queries
  sanitized = sanitized.replace(/SELECT .+ FROM .+/gi, '[SQL query]')
  sanitized = sanitized.replace(/INSERT INTO .+/gi, '[SQL query]')
  sanitized = sanitized.replace(/UPDATE .+ SET .+/gi, '[SQL query]')
  sanitized = sanitized.replace(/DELETE FROM .+/gi, '[SQL query]')
  
  return sanitized.trim()
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  _statusCode: number = 500,
  code?: string
): ApiError {
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!isDevelopment) {
    message = sanitizeErrorMessage(message)
  }

  return {
    success: false,
    message,
    code
  }
}

