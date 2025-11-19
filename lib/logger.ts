/**
 * Universal logger that works in both Node.js and Edge runtime
 * Automatically detects runtime and uses appropriate implementation
 */

// Edge runtime detection
const isEdgeRuntime = typeof (globalThis as any).EdgeRuntime === 'string' ||
                      process.env.NEXT_RUNTIME === 'edge' ||
                      typeof process.versions?.node === 'undefined'

// Edge-safe logger implementation (used in edge runtime)
const edgeLogger = {
  // Log levels
  logLevels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },

  // Get current log level from environment
  currentLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

  sanitizeLog(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/\r?\n|\r/g, ' ')
        .slice(0, 1000)
    }

    if (Array.isArray(data)) {
      return data.map((item) => edgeLogger.sanitizeLog(item))
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {}
      for (const key in data) {
        if (key.toLowerCase().includes('password') ||
            key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('secret') ||
            key.toLowerCase().includes('key') ||
            key.toLowerCase().includes('auth')) {
          sanitized[key] = '[REDACTED]'
        } else {
          sanitized[key] = edgeLogger.sanitizeLog(data[key])
        }
      }
      return sanitized
    }

    return data
  },

  formatLog(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const sanitizedMeta = meta ? edgeLogger.sanitizeLog(meta) : null

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...sanitizedMeta
      })
    } else {
      let log = `${timestamp} [${level}]: ${message}`
      if (sanitizedMeta && Object.keys(sanitizedMeta).length > 0) {
        log += ` ${JSON.stringify(sanitizedMeta)}`
      }
      return log
    }
  },

  shouldLog(level: string): boolean {
    const currentLevelNum = edgeLogger.logLevels[edgeLogger.currentLevel as keyof typeof edgeLogger.logLevels] || edgeLogger.logLevels.info
    return edgeLogger.logLevels[level as keyof typeof edgeLogger.logLevels] <= currentLevelNum
  }
}

// Node.js Winston logger initialization (lazy loaded)
let winstonLogger: any = null
let winstonInitialized = false

function getWinstonLogger() {
  if (winstonInitialized || isEdgeRuntime) return winstonLogger

  // Delay winston initialization until actually needed
  if (typeof window === 'undefined' && !isEdgeRuntime) {
    try {
      // Dynamic imports for Node.js-only modules (not available in edge runtime)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const winston = require('winston')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const DailyRotateFile = require('winston-daily-rotate-file')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs')

      const logLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      }

      const logColors = {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        verbose: 'cyan',
        debug: 'blue',
        silly: 'grey',
      }

      winston.addColors(logColors)

      const logFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
      )

      const consoleFormat = winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, metadata }: any) => {
          let log = `${timestamp} [${level}]: ${message}`
          if (metadata && Object.keys(metadata).length > 0) {
            log += ` ${JSON.stringify(metadata)}`
          }
          return log
        })
      )

      const jsonFormat = winston.format.combine(
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...metadata }: any) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            ...metadata,
          })
        })
      )

      const logsDir = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true })
      }

      const transports: any[] = []

      if (process.env.NODE_ENV !== 'production') {
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(logFormat, consoleFormat),
            level: process.env.LOG_LEVEL || 'debug',
          })
        )
      } else {
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(logFormat, jsonFormat),
            level: process.env.LOG_LEVEL || 'info',
          })
        )
      }

      transports.push(
        new DailyRotateFile({
          filename: path.join(logsDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: winston.format.combine(logFormat, jsonFormat),
        })
      )

      transports.push(
        new DailyRotateFile({
          filename: path.join(logsDir, 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(logFormat, jsonFormat),
        })
      )

      transports.push(
        new DailyRotateFile({
          filename: path.join(logsDir, 'http-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          level: 'http',
          format: winston.format.combine(logFormat, jsonFormat),
        })
      )

      winstonLogger = winston.createLogger({
        levels: logLevels,
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        transports,
        exitOnError: false,
      })

      winstonInitialized = true

      if (process.env.NODE_ENV !== 'test') {
        winstonLogger.info('Logger initialized', {
          environment: process.env.NODE_ENV || 'development',
          logLevel: winstonLogger.level,
          pid: process.pid,
        })
      }

      // Handle uncaught exceptions (only in Node.js environment)
      process.on('uncaughtException', (error) => {
        logException(error, { type: 'uncaughtException' })
        setTimeout(() => {
          process.exit(1)
        }, 1000)
      })

      process.on('unhandledRejection', (reason, promise) => {
        winstonLogger.error('Unhandled Promise Rejection', {
          reason,
          promise,
        })
      })
    } catch (error) {
      console.error('Failed to initialize Winston logger:', error)
      winstonInitialized = false
    }
  }

  return winstonLogger
}

/**
 * Structured logging helper functions
 */
export const log = {
  error: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('error')) {
        console.error(edgeLogger.formatLog('error', message, meta))
      }
    } else {
      winston.error(message, edgeLogger.sanitizeLog(meta))
    }
  },

  warn: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('warn')) {
        console.warn(edgeLogger.formatLog('warn', message, meta))
      }
    } else {
      winston.warn(message, edgeLogger.sanitizeLog(meta))
    }
  },

  info: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('info')) {
        console.log(edgeLogger.formatLog('info', message, meta))
      }
    } else {
      winston.info(message, edgeLogger.sanitizeLog(meta))
    }
  },

  http: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('http')) {
        console.log(edgeLogger.formatLog('http', message, meta))
      }
    } else {
      winston.http(message, edgeLogger.sanitizeLog(meta))
    }
  },

  verbose: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('verbose')) {
        console.log(edgeLogger.formatLog('verbose', message, meta))
      }
    } else {
      winston.verbose(message, edgeLogger.sanitizeLog(meta))
    }
  },

  debug: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('debug')) {
        console.log(edgeLogger.formatLog('debug', message, meta))
      }
    } else {
      winston.debug(message, edgeLogger.sanitizeLog(meta))
    }
  },

  silly: (message: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('silly')) {
        console.log(edgeLogger.formatLog('silly', message, meta))
      }
    } else {
      winston.silly(message, edgeLogger.sanitizeLog(meta))
    }
  },

  // Specific logging methods for common scenarios
  api: (method: string, path: string, statusCode: number, duration: number, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('http')) {
        console.log(edgeLogger.formatLog('http', 'API Request', {
          method,
          path,
          statusCode,
          duration,
          ...edgeLogger.sanitizeLog(meta),
        }))
      }
    } else {
      winston.http('API Request', {
        method,
        path,
        statusCode,
        duration,
        ...edgeLogger.sanitizeLog(meta),
      })
    }
  },

  auth: (action: string, userId: string | number, success: boolean, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('info')) {
        console.log(edgeLogger.formatLog('info', 'Authentication', {
          action,
          userId,
          success,
          ...edgeLogger.sanitizeLog(meta),
        }))
      }
    } else {
      winston.info('Authentication', {
        action,
        userId,
        success,
        ...edgeLogger.sanitizeLog(meta),
      })
    }
  },

  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) => {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn'
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog(level)) {
        const logFn = level === 'error' ? console.error : console.warn
        logFn(edgeLogger.formatLog(level, `Security Event: ${event}`, {
          severity,
          ...edgeLogger.sanitizeLog(meta),
        }))
      }
    } else {
      winston.log(level, `Security Event: ${event}`, {
        severity,
        ...edgeLogger.sanitizeLog(meta),
      })
    }
  },

  database: (operation: string, table: string, duration: number, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('verbose')) {
        console.log(edgeLogger.formatLog('verbose', 'Database Operation', {
          operation,
          table,
          duration,
          ...edgeLogger.sanitizeLog(meta),
        }))
      }
    } else {
      winston.verbose('Database Operation', {
        operation,
        table,
        duration,
        ...edgeLogger.sanitizeLog(meta),
      })
    }
  },

  performance: (metric: string, value: number, unit: string, meta?: any) => {
    const winston = getWinstonLogger()
    if (isEdgeRuntime || !winston) {
      if (edgeLogger.shouldLog('verbose')) {
        console.log(edgeLogger.formatLog('verbose', 'Performance Metric', {
          metric,
          value,
          unit,
          ...edgeLogger.sanitizeLog(meta),
        }))
      }
    } else {
      winston.verbose('Performance Metric', {
        metric,
        value,
        unit,
        ...edgeLogger.sanitizeLog(meta),
      })
    }
  },
}

// Create a stream for Morgan HTTP logger
export const stream = {
  write: (message: string) => {
    log.http(message.trim())
  },
}

// Export the logger interface for compatibility
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

// Export default for convenience
export default log

/**
 * Gracefully close logger on application shutdown
 */
export function closeLogger(): Promise<void> {
  const winston = getWinstonLogger()
  if (winston) {
    return new Promise((resolve) => {
      winston.on('finish', resolve)
      winston.end()
    })
  }
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
    context: edgeLogger.sanitizeLog(context),
  })
}