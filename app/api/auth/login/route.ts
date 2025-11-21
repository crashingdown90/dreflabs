import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { getAdminByUsername, createSession, createLog, updateRateLimit, isBlocked, blockIdentifier } from '@/lib/admin-db'
import { comparePassword, generateAccessToken, generateRefreshToken, getExpirationDate } from '@/lib/auth'
import { validateCsrfToken } from '@/lib/security'
import { LoginRequest, AuthResponse, AuthErrorResponse } from '@/types/auth'

// SECURITY: Strengthened rate limiting for login attempts
const MAX_LOGIN_ATTEMPTS = 3 // Reduced from 5 to 3
const BLOCK_DURATION_MINUTES = 30 // Increased from 15 to 30 minutes

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token first
    if (!validateCsrfToken(request)) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    const body: LoginRequest = await request.json()
    const { username, password, rememberMe } = body

    if (!username || !password) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const identifier = `login:${ip}:${username}`

    // Check if blocked
    if (isBlocked(identifier)) {
      await createLog(null, 'LOGIN_BLOCKED', 'admin_user', username, ip, request.headers.get('user-agent') || undefined)

      return NextResponse.json<AuthErrorResponse>(
        { success: false, error: 'Too many failed login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Get admin user
    const admin = getAdminByUsername(username)

    if (!admin) {
      // Update rate limit for failed attempt
      const rateLimit = updateRateLimit(identifier)

      if (rateLimit.attempt_count >= MAX_LOGIN_ATTEMPTS) {
        blockIdentifier(identifier, BLOCK_DURATION_MINUTES)
      }

      await createLog(null, 'LOGIN_FAILED_USER_NOT_FOUND', 'admin_user', username, ip, request.headers.get('user-agent') || undefined)

      return NextResponse.json<AuthErrorResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, admin.password_hash)

    if (!isValidPassword) {
      // Update rate limit for failed attempt
      const rateLimit = updateRateLimit(identifier)

      if (rateLimit.attempt_count >= MAX_LOGIN_ATTEMPTS) {
        blockIdentifier(identifier, BLOCK_DURATION_MINUTES)
      }

      await createLog(admin.id, 'LOGIN_FAILED_INVALID_PASSWORD', 'admin_user', username, ip, request.headers.get('user-agent') || undefined)

      return NextResponse.json<AuthErrorResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if admin is active
    if (admin.is_active !== 1) {
      await createLog(admin.id, 'LOGIN_FAILED_INACTIVE', 'admin_user', username, ip, request.headers.get('user-agent') || undefined)

      return NextResponse.json<AuthErrorResponse>(
        { success: false, error: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Generate tokens
    const tokenPayload = {
      userId: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    }

    const accessToken = await generateAccessToken(tokenPayload, '1h')
    const refreshToken = await generateRefreshToken(tokenPayload, rememberMe ? '30d' : '7d')

    // Store refresh token in database
    const expiresAt = getExpirationDate(rememberMe ? 30 : 7)
    createSession(admin.id, refreshToken, expiresAt)

    // Log successful login
    await createLog(admin.id, 'LOGIN_SUCCESS', 'admin_user', username, ip, request.headers.get('user-agent') || undefined)

    // Reset rate limit on successful login
    // Note: We could implement resetRateLimit(identifier) here if desired

    // Prepare response
    // SECURITY: Don't return tokens in response body - use httpOnly cookies only
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      } as AuthResponse,
      { status: 200 }
    )

    // Set cookies with strict security
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' for better CSRF protection
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' for better CSRF protection
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days or 7 days
      path: '/',
    })

    return response
  } catch (error) {
    log.error('Login error:', error)
    return NextResponse.json<AuthErrorResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
