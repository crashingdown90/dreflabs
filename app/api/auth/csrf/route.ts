import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { generateCsrfToken } from '@/lib/security'

/**
 * GET /api/auth/csrf
 * Get a CSRF token for form submissions
 */
export async function GET(_request: NextRequest) {
  try {
    // Generate a new CSRF token
    const csrfToken = generateCsrfToken()

    // Create response
    const response = NextResponse.json(
      {
        csrfToken,
        message: 'CSRF token generated successfully'
      },
      { status: 200 }
    )

    // Set CSRF token as httpOnly cookie for validation
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    return response
  } catch (error) {
    log.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}