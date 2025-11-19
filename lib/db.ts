import Database from 'better-sqlite3'
import { log } from '@/lib/logger'
import { join } from 'path'
import { existsSync } from 'fs'

const dbPath = join(process.cwd(), 'data', 'dreflabs.db')

let db: Database.Database | null = null
let connectionAttempts = 0
const MAX_CONNECTION_ATTEMPTS = 3

/**
 * Get database connection with error handling and retry logic
 */
export function getDb(): Database.Database {
  if (!db) {
    try {
      // Check if database file exists
      if (!existsSync(dbPath)) {
        throw new Error(
          `Database file not found at ${dbPath}. Please run 'npm run db:init' to initialize the database.`
        )
      }

      // Create connection
      db = new Database(dbPath, {
        // Enable verbose mode in development
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
      })

      // Enable foreign keys
      db.pragma('foreign_keys = ON')

      // Enable WAL mode for better concurrency
      db.pragma('journal_mode = WAL')

      // Optimize for performance
      db.pragma('synchronous = NORMAL')
      db.pragma('cache_size = -64000') // 64MB cache

      // Set busy timeout (wait up to 5 seconds if database is locked)
      db.pragma('busy_timeout = 5000')

      // Test connection
      db.prepare('SELECT 1').get()

      connectionAttempts = 0
      log.info('✅ Database connection established')
    } catch (error) {
      connectionAttempts++
      log.error(`❌ Database connection error (attempt ${connectionAttempts}):`, error)

      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        throw new Error(
          `Failed to connect to database after ${MAX_CONNECTION_ATTEMPTS} attempts. Please check database configuration.`
        )
      }

      // Retry after a short delay
      if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
        log.info(`Retrying database connection in 1 second...`)
        setTimeout(() => {
          db = null
          getDb()
        }, 1000)
      }

      throw error
    }
  }

  return db
}

/**
 * Close database connection
 */
export function closeDb(): void {
  if (db) {
    try {
      db.close()
      log.info('✅ Database connection closed')
    } catch (error) {
      log.error('❌ Error closing database:', error)
    } finally {
      db = null
    }
  }
}

/**
 * Execute a query with automatic retry on busy/locked errors
 */
export function executeWithRetry<T>(
  operation: (db: Database.Database) => T,
  maxRetries: number = 3
): T {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const database = getDb()
      return operation(database)
    } catch (error: any) {
      lastError = error

      // Retry on SQLITE_BUSY or SQLITE_LOCKED errors
      if (
        error.code === 'SQLITE_BUSY' ||
        error.code === 'SQLITE_LOCKED' ||
        error.message?.includes('database is locked')
      ) {
        if (attempt < maxRetries) {
          log.warn(`Database busy, retrying (attempt ${attempt}/${maxRetries})...`)
          // Exponential backoff
          const delay = Math.min(100 * Math.pow(2, attempt - 1), 1000)
          const start = Date.now()
          while (Date.now() - start < delay) {
            // Busy wait
          }
          continue
        }
      }

      // Don't retry on other errors
      throw error
    }
  }

  throw lastError || new Error('Database operation failed')
}

/**
 * Check database health
 */
export function checkDatabaseHealth(): { healthy: boolean; message: string } {
  try {
    const db = getDb()
    db.prepare('SELECT 1').get()
    return { healthy: true, message: 'Database is healthy' }
  } catch (error: any) {
    return { healthy: false, message: error.message || 'Database health check failed' }
  }
}

// Gracefully close database on process exit
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    log.info('Process exiting, closing database...')
    closeDb()
  })

  process.on('SIGINT', () => {
    log.info('Received SIGINT, closing database...')
    closeDb()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    log.info('Received SIGTERM, closing database...')
    closeDb()
    process.exit(0)
  })

  process.on('uncaughtException', (error) => {
    log.error('Uncaught exception:', error)
    closeDb()
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled rejection', { promise, reason })
    closeDb()
    process.exit(1)
  })
}
