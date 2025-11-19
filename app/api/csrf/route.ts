import { NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { generateCsrfToken, applySecurityHeaders } from '@/lib/security'

/**
 * GET /api/csrf
 * Generate and return a CSRF token
 */
export async function GET() {
  try {
    // Generate CSRF token
    const token = generateCsrfToken()

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        token,
      },
      { status: 200 }
    )

    // Set CSRF token in cookie
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return applySecurityHeaders(response)
  } catch (error) {
    log.error('CSRF token generation error:', error)
    const response = NextResponse.json(
      {
        success: false,
        error: 'Failed to generate CSRF token',
      },
      { status: 500 }
    )
    return applySecurityHeaders(response)
  }
}

