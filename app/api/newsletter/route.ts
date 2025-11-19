import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { createSubscriber, getSubscriberByEmail } from '@/lib/queries'
import { sendWelcomeEmail } from '@/lib/email'
import { validateEmail } from '@/lib/utils'
import { sanitizeEmail, checkRateLimit, getClientIdentifier, applySecurityHeaders } from '@/lib/security'
import type { ApiResponse, NewsletterFormData } from '@/types'

// Rate limit: 5 requests per 15 minutes per IP
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  blockDurationMs: 60 * 60 * 1000, // Block for 1 hour if exceeded
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(`newsletter:${clientId}`, RATE_LIMIT_CONFIG)

    if (!rateLimit.allowed) {
      const response = NextResponse.json<ApiResponse>(
        {
          success: false,
          error: rateLimit.blocked
            ? 'Too many requests. You have been temporarily blocked.'
            : 'Too many requests. Please try again later.',
        },
        { status: 429 }
      )

      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

      return applySecurityHeaders(response)
    }

    const body: NewsletterFormData = await request.json()

    // SECURITY: Honeypot field check (bot protection)
    if ((body as any).name || (body as any).phone || (body as any).website) {
      // Silently reject (looks like success to bot)
      const response = NextResponse.json<ApiResponse>(
        { success: true, message: 'Successfully subscribed to newsletter!' },
        { status: 201 }
      )
      return applySecurityHeaders(response)
    }

    // Validation
    if (!body.email || !validateEmail(body.email)) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Sanitize email
    let email: string
    try {
      email = sanitizeEmail(body.email)
    } catch (error) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Check if already subscribed (with transaction-like behavior)
    const existing = getSubscriberByEmail(email)
    if (existing && existing.active) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'This email is already subscribed' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Subscribe (createSubscriber handles duplicate check internally)
    let subscriberId: number
    try {
      subscriberId = createSubscriber(email)
    } catch (error: any) {
      // Handle duplicate email error
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        const response = NextResponse.json<ApiResponse>(
          { success: false, error: 'This email is already subscribed' },
          { status: 400 }
        )
        return applySecurityHeaders(response)
      }
      throw error
    }

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(email).catch((error) =>
      log.error('Failed to send welcome email:', error)
    )

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: { id: subscriberId },
      },
      { status: 201 }
    )

    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

    return applySecurityHeaders(response)
  } catch (error) {
    log.error('Newsletter subscription error:', error)
    const response = NextResponse.json<ApiResponse>(
      { success: false, error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
    return applySecurityHeaders(response)
  }
}
