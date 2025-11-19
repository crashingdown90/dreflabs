import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { createPageView } from '@/lib/queries'
import { checkRateLimit, getClientIdentifier, applySecurityHeaders } from '@/lib/security'
import type { ApiResponse } from '@/types'

// Rate limit: 100 requests per 5 minutes per IP (analytics can be frequent)
const RATE_LIMIT_CONFIG = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 100,
  blockDurationMs: 15 * 60 * 1000, // Block for 15 minutes if exceeded
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(`analytics:${clientId}`, RATE_LIMIT_CONFIG)

    if (!rateLimit.allowed) {
      const response = NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Too many requests',
        },
        { status: 429 }
      )

      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

      return applySecurityHeaders(response)
    }

    const body = await request.json()
    const { pagePath } = body

    if (!pagePath) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Page path is required' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Sanitize page path (allow only valid URL paths)
    const sanitizedPath = pagePath.trim().replace(/[^a-zA-Z0-9\-_\/]/g, '')

    if (!sanitizedPath || sanitizedPath.length > 500) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid page path' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Get referrer and user agent from headers
    const referrer = request.headers.get('referer') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Create page view record
    const viewId = createPageView(sanitizedPath, referrer, userAgent)

    const response = NextResponse.json<ApiResponse>(
      { success: true, data: { id: viewId } },
      { status: 201 }
    )

    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

    return applySecurityHeaders(response)
  } catch (error) {
    log.error('Analytics error:', error)
    const response = NextResponse.json<ApiResponse>(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
    return applySecurityHeaders(response)
  }
}
