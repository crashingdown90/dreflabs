import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getEnv } from '@/lib/env'

interface HealthStatus {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'ok' | 'error'
      message?: string
    }
    environment: {
      status: 'ok' | 'error'
      message?: string
    }
    filesystem: {
      status: 'ok' | 'error'
      message?: string
    }
  }
  version?: string
  environment?: string
}

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
export async function GET(_request: NextRequest) {
  const startTime = Date.now()
  const health: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: { status: 'ok' },
      environment: { status: 'ok' },
      filesystem: { status: 'ok' }
    }
  }

  try {
    // 1. Check database connectivity
    try {
      const db = getDb()
      const result = db.prepare('SELECT 1 as healthy').get() as { healthy: number } | undefined

      if (!result || result.healthy !== 1) {
        throw new Error('Database query failed')
      }

      // Check if critical tables exist
      const tables = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table'
        AND name IN ('admin_users', 'blog_posts', 'projects')
      `).all() as { name: string }[]

      if (tables.length < 3) {
        health.checks.database = {
          status: 'error',
          message: `Missing tables. Found ${tables.length}/3 required tables`
        }
        health.status = 'error'
      }
    } catch (error) {
      health.checks.database = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database check failed'
      }
      health.status = 'error'
    }

    // 2. Check environment configuration
    try {
      const env = getEnv()

      // Check critical environment variables
      if (!env.JWT_SECRET || !env.REFRESH_TOKEN_SECRET) {
        health.checks.environment = {
          status: 'error',
          message: 'Missing critical authentication environment variables'
        }
        health.status = 'error'
      }

      // Add environment info (non-sensitive)
      health.environment = env.NODE_ENV
    } catch (error) {
      health.checks.environment = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Environment check failed'
      }
      health.status = 'error'
    }

    // 3. Check filesystem (uploads directory)
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

      try {
        await fs.access(uploadsDir, fs.constants.W_OK)
      } catch {
        // Try to create it if it doesn't exist
        await fs.mkdir(uploadsDir, { recursive: true })
      }
    } catch (error) {
      health.checks.filesystem = {
        status: 'error',
        message: 'Uploads directory not writable'
      }
      health.status = 'error'
    }

    // Add version info from package.json
    try {
      // Dynamic import to avoid ESLint require() error
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const packageJson = require('../../../package.json')
      health.version = packageJson.version
    } catch {
      // Version is optional
    }

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Return appropriate status code
    const statusCode = health.status === 'ok' ? 200 : 503

    return NextResponse.json(
      {
        ...health,
        responseTime: `${responseTime}ms`
      },
      {
        status: statusCode,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': `${responseTime}ms`
        }
      }
    )
  } catch (error) {
    // Catastrophic failure
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed catastrophically',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}