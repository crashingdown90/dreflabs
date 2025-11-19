/**
 * Edge-runtime-safe logger
 * Simple console-based logger for edge runtime environments
 */

// Log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
}

// Get current log level from environment
const currentLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
const currentLevelNum = logLevels[currentLevel as keyof typeof logLevels] || logLevels.info

/**
 * Log sanitization to prevent log injection
 */
function sanitizeLog(data: any): any {
  if (typeof data === 'string') {
    // Remove control characters and limit length
    return data
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\r?\n|\r/g, ' ') // Replace newlines with spaces
      .slice(0, 1000) // Limit string length
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLog)
  }

  if (data && typeof data === 'object') {
    const sanitized: any = {}
    for (const key in data) {
      // Redact sensitive fields
      if (key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('auth')) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = sanitizeLog(data[key])
      }
    }
    return sanitized
  }

  return data
}

/**
 * Format log message
 */
function formatLog(level: string, message: string, meta?: any): string {
  const timestamp = new Date().toISOString()
  const sanitizedMeta = meta ? sanitizeLog(meta) : null

  if (process.env.NODE_ENV === 'production') {
    // JSON format for production
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...sanitizedMeta
    })
  } else {
    // Readable format for development
    let log = `${timestamp} [${level}]: ${message}`
    if (sanitizedMeta && Object.keys(sanitizedMeta).length > 0) {
      log += ` ${JSON.stringify(sanitizedMeta)}`
    }
    return log
  }
}

/**
 * Check if should log based on level
 */
function shouldLog(level: keyof typeof logLevels): boolean {
  return logLevels[level] <= currentLevelNum
}

/**
 * Edge-safe logger
 */
export const log = {
  error: (message: string, meta?: any) => {
    if (shouldLog('error')) {
      console.error(formatLog('error', message, meta))
    }
  },

  warn: (message: string, meta?: any) => {
    if (shouldLog('warn')) {
      console.warn(formatLog('warn', message, meta))
    }
  },

  info: (message: string, meta?: any) => {
    if (shouldLog('info')) {
      console.log(formatLog('info', message, meta))
    }
  },

  http: (message: string, meta?: any) => {
    if (shouldLog('http')) {
      console.log(formatLog('http', message, meta))
    }
  },

  verbose: (message: string, meta?: any) => {
    if (shouldLog('verbose')) {
      console.log(formatLog('verbose', message, meta))
    }
  },

  debug: (message: string, meta?: any) => {
    if (shouldLog('debug')) {
      console.log(formatLog('debug', message, meta))
    }
  },

  silly: (message: string, meta?: any) => {
    if (shouldLog('silly')) {
      console.log(formatLog('silly', message, meta))
    }
  },

  // Specific logging methods for common scenarios
  api: (method: string, path: string, statusCode: number, duration: number, meta?: any) => {
    if (shouldLog('http')) {
      console.log(formatLog('http', 'API Request', {
        method,
        path,
        statusCode,
        duration,
        ...sanitizeLog(meta),
      }))
    }
  },

  auth: (action: string, userId: string | number, success: boolean, meta?: any) => {
    if (shouldLog('info')) {
      console.log(formatLog('info', 'Authentication', {
        action,
        userId,
        success,
        ...sanitizeLog(meta),
      }))
    }
  },

  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) => {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn'
    if (shouldLog(level as keyof typeof logLevels)) {
      const logFn = level === 'error' ? console.error : console.warn
      logFn(formatLog(level, `Security Event: ${event}`, {
        severity,
        ...sanitizeLog(meta),
      }))
    }
  },

  database: (operation: string, table: string, duration: number, meta?: any) => {
    if (shouldLog('verbose')) {
      console.log(formatLog('verbose', 'Database Operation', {
        operation,
        table,
        duration,
        ...sanitizeLog(meta),
      }))
    }
  },

  performance: (metric: string, value: number, unit: string, meta?: any) => {
    if (shouldLog('verbose')) {
      console.log(formatLog('verbose', 'Performance Metric', {
        metric,
        value,
        unit,
        ...sanitizeLog(meta),
      }))
    }
  },
}

// Export a simple logger instance for edge runtime
export const logger = {
  error: log.error,
  warn: log.warn,
  info: log.info,
  debug: log.debug,
  verbose: log.verbose,
  silly: log.silly,
  log: (level: string, message: string, meta?: any) => {
    // Only use basic log levels for the generic log method
    const basicLevels = ['error', 'warn', 'info', 'debug', 'verbose', 'silly'] as const
    if (basicLevels.includes(level as any)) {
      const logFn = log[level as keyof Pick<typeof log, 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly'>]
      logFn(message, meta)
    } else {
      log.info(message, meta)
    }
  }
}

// Export stream placeholder for compatibility
export const stream = {
  write: (message: string) => {
    log.http(message.trim())
  },
}

// Export default for convenience
export default log

/**
 * Gracefully close logger on application shutdown (no-op in edge runtime)
 */
export function closeLogger(): Promise<void> {
  return Promise.resolve()
}

/**
 * Error tracking integration
 */
export function logException(error: Error, context?: any): void {
  log.error('Unhandled Exception', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context: sanitizeLog(context),
  })
}