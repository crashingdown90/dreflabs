import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { getSessionByToken, deleteSession, createSession, getAdminById, createLog } from '@/lib/admin-db'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, getExpirationDate, isExpired } from '@/lib/auth'
import { AuthResponse } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie or body
    const cookieRefreshToken = request.cookies.get('refreshToken')?.value
    let bodyRefreshToken: string | undefined

    try {
      const body = await request.json()
      bodyRefreshToken = body.refreshToken
    } catch {
      // Body might be empty, that's okay
    }

    const refreshToken = cookieRefreshToken || bodyRefreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token required' } as AuthResponse,
        { status: 400 }
      )
    }

    // Verify token signature
    const payload = await verifyRefreshToken(refreshToken)

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' } as AuthResponse,
        { status: 401 }
      )
    }

    // Check if session exists in database
    const session = getSessionByToken(refreshToken)

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' } as AuthResponse,
        { status: 401 }
      )
    }

    // Check if session has expired
    if (isExpired(session.expires_at)) {
      deleteSession(refreshToken)
      return NextResponse.json(
        { success: false, message: 'Session expired' } as AuthResponse,
        { status: 401 }
      )
    }

    // Get admin user
    const admin = getAdminById(session.admin_id)

    if (!admin || admin.is_active !== 1) {
      deleteSession(refreshToken)
      return NextResponse.json(
        { success: false, message: 'User not found or inactive' } as AuthResponse,
        { status: 401 }
      )
    }

    // Generate new tokens
    const tokenPayload = {
      userId: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    }

    const newAccessToken = await generateAccessToken(tokenPayload, '1h')
    const newRefreshToken = await generateRefreshToken(tokenPayload, '7d')

    // Update session in database (replace old refresh token with new one)
    deleteSession(refreshToken)
    const expiresAt = getExpirationDate(7)
    createSession(admin.id, newRefreshToken, expiresAt)

    // Log token refresh
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    await createLog(admin.id, 'TOKEN_REFRESH', 'admin_user', admin.id.toString(), ip, request.headers.get('user-agent') || undefined)

    // Prepare response
    // SECURITY: Don't return tokens in response body - use httpOnly cookies only
    const response = NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      } as AuthResponse,
      { status: 200 }
    )

    // Set new cookies with strict security
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' for better CSRF protection
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' for better CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    log.error('Token refresh error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' } as AuthResponse,
      { status: 500 }
    )
  }
}
