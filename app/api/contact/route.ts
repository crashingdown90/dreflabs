import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { createContact } from '@/lib/queries'
import { sendContactNotification } from '@/lib/email'
import { validateEmail } from '@/lib/utils'
import {
  sanitizeName,
  sanitizeEmail,
  sanitizeText,
  checkRateLimit,
  getClientIdentifier,
  applySecurityHeaders
} from '@/lib/security'
import type { ApiResponse, ContactFormData } from '@/types'

// Rate limit: 3 requests per 10 minutes per IP
const RATE_LIMIT_CONFIG = {
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 3,
  blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes if exceeded
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(`contact:${clientId}`, RATE_LIMIT_CONFIG)

    if (!rateLimit.allowed) {
      const response = NextResponse.json<ApiResponse>(
        {
          success: false,
          error: rateLimit.blocked
            ? 'Too many contact requests. You have been temporarily blocked.'
            : 'Too many requests. Please try again later.',
        },
        { status: 429 }
      )

      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

      return applySecurityHeaders(response)
    }

    const body: ContactFormData = await request.json()

    // SECURITY: Honeypot field check (bot protection)
    if ((body as any).website || (body as any).url || (body as any).phone_number) {
      // Silently reject (looks like success to bot)
      const response = NextResponse.json<ApiResponse>(
        { success: true, message: 'Thank you for your message. I will get back to you soon!' },
        { status: 201 }
      )
      return applySecurityHeaders(response)
    }

    // Validation
    if (!body.name || body.name.trim().length < 2) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (!body.email || !validateEmail(body.email)) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (!body.message || body.message.trim().length < 10) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (body.message.trim().length > 5000) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Sanitize inputs
    let name: string, email: string, message: string
    let company: string | undefined, serviceInterest: string | undefined

    try {
      name = sanitizeName(body.name)
      email = sanitizeEmail(body.email)
      message = sanitizeText(body.message)
      company = body.company ? sanitizeText(body.company) : undefined
      serviceInterest = body.serviceInterest ? sanitizeText(body.serviceInterest) : undefined
    } catch (error: any) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: error.message || 'Invalid input data' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Additional validation after sanitization
    if (name.length < 2) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Name contains invalid characters' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Save to database
    const contactId = createContact(name, email, message, company, serviceInterest)

    // Send email notification (don't wait for it)
    sendContactNotification(name, email, message, company, serviceInterest)
      .catch((error) => log.error('Failed to send email notification:', error))

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Thank you for your message. I will get back to you soon!',
        data: { id: contactId },
      },
      { status: 201 }
    )

    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

    return applySecurityHeaders(response)
  } catch (error) {
    log.error('Contact form error:', error)
    const response = NextResponse.json<ApiResponse>(
      { success: false, error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
    return applySecurityHeaders(response)
  }
}
