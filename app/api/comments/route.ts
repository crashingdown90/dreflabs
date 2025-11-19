import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { createComment, getCommentsByPost } from '@/lib/queries'
import { validateEmail } from '@/lib/utils'
import {
  sanitizeName,
  sanitizeEmail,
  sanitizeText,
  checkRateLimit,
  getClientIdentifier,
  applySecurityHeaders
} from '@/lib/security'
import type { ApiResponse, CommentFormData } from '@/types'

// Rate limit: 5 comments per 30 minutes per IP
const RATE_LIMIT_CONFIG = {
  windowMs: 30 * 60 * 1000, // 30 minutes
  maxRequests: 5,
  blockDurationMs: 60 * 60 * 1000, // Block for 1 hour if exceeded
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('postSlug')

    if (!postSlug) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Post slug is required' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Sanitize post slug
    const sanitizedSlug = postSlug.trim().replace(/[^a-z0-9-]/gi, '')

    const comments = getCommentsByPost(sanitizedSlug, true)

    const response = NextResponse.json<ApiResponse>(
      { success: true, data: comments },
      { status: 200 }
    )

    return applySecurityHeaders(response)
  } catch (error) {
    log.error('Get comments error:', error)
    const response = NextResponse.json<ApiResponse>(
      { success: false, error: 'An error occurred fetching comments' },
      { status: 500 }
    )
    return applySecurityHeaders(response)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(`comments:${clientId}`, RATE_LIMIT_CONFIG)

    if (!rateLimit.allowed) {
      const response = NextResponse.json<ApiResponse>(
        {
          success: false,
          error: rateLimit.blocked
            ? 'Too many comments. You have been temporarily blocked.'
            : 'Too many comments. Please try again later.',
        },
        { status: 429 }
      )

      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

      return applySecurityHeaders(response)
    }

    const body: CommentFormData = await request.json()

    // SECURITY: Honeypot field check (bot protection)
    // Frontend should include a hidden field that bots will fill but humans won't
    if ((body as any).website || (body as any).url || (body as any).homepage) {
      // Silently reject (looks like success to bot)
      const response = NextResponse.json<ApiResponse>(
        { success: true, message: 'Comment submitted successfully.' },
        { status: 201 }
      )
      return applySecurityHeaders(response)
    }

    // Validation
    if (!body.postSlug || body.postSlug.trim().length === 0) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Post slug is required' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (!body.authorName || body.authorName.trim().length < 2) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (!body.authorEmail || !validateEmail(body.authorEmail)) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (!body.content || body.content.trim().length < 10) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Comment must be at least 10 characters' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    if (body.content.trim().length > 2000) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Comment is too long (max 2000 characters)' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Sanitize inputs
    let postSlug: string, authorName: string, authorEmail: string, content: string

    try {
      postSlug = body.postSlug.trim().replace(/[^a-z0-9-]/gi, '')
      authorName = sanitizeName(body.authorName)
      authorEmail = sanitizeEmail(body.authorEmail)
      content = sanitizeText(body.content)
    } catch (error: any) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: error.message || 'Invalid input data' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Additional validation after sanitization
    if (authorName.length < 2) {
      const response = NextResponse.json<ApiResponse>(
        { success: false, error: 'Name contains invalid characters' },
        { status: 400 }
      )
      return applySecurityHeaders(response)
    }

    // Create comment (will be pending approval)
    const commentId = createComment(postSlug, authorName, authorEmail, content)

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Comment submitted successfully. It will be visible after approval.',
        data: { id: commentId },
      },
      { status: 201 }
    )

    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString())

    return applySecurityHeaders(response)
  } catch (error) {
    log.error('Create comment error:', error)
    const response = NextResponse.json<ApiResponse>(
      { success: false, error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
    return applySecurityHeaders(response)
  }
}
