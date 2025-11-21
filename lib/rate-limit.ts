import { NextRequest } from 'next/server'

interface RateLimitOptions {
  maxAttempts: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries periodically
const cleanupInterval = setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

// Prevent memory leak in development
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    clearInterval(cleanupInterval)
  })
}

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return '127.0.0.1'
}

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { maxAttempts, windowMs } = options
  const ip = getClientIP(request)
  const key = `rate-limit:${ip}:${request.nextUrl.pathname}`
  const now = Date.now()

  const existing = rateLimitStore.get(key)

  if (!existing || existing.resetTime < now) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })

    return {
      success: true,
      remaining: maxAttempts - 1,
      reset: now + windowMs,
    }
  }

  if (existing.count >= maxAttempts) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: existing.resetTime,
    }
  }

  // Increment counter
  existing.count++
  rateLimitStore.set(key, existing)

  return {
    success: true,
    remaining: maxAttempts - existing.count,
    reset: existing.resetTime,
  }
}
