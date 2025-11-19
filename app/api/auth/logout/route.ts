import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { deleteSession, createLog } from '@/lib/admin-db'
import { verifyAccessToken, verifyRefreshToken } from '@/lib/auth'
import { blacklistToken } from '@/lib/redis'
import { AuthResponse } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    let adminId: number | null = null

    // Try to get admin ID from access token and blacklist it
    if (accessToken) {
      const payload = await verifyAccessToken(accessToken)
      if (payload) {
        adminId = payload.userId

        // Calculate remaining TTL and blacklist the token
        const now = Math.floor(Date.now() / 1000)
        const ttl = payload.exp ? Math.max(0, payload.exp - now) : 3600

        if (ttl > 0) {
          await blacklistToken(accessToken, ttl)
          log.info('Access token blacklisted on logout', {
            userId: adminId,
            ttl,
          })
        }
      }
    }

    // Delete refresh token from database and blacklist it
    if (refreshToken) {
      deleteSession(refreshToken)

      // Also blacklist the refresh token
      try {
        const refreshPayload = await verifyRefreshToken(refreshToken)
        if (refreshPayload) {
          const now = Math.floor(Date.now() / 1000)
          const ttl = refreshPayload.exp ? Math.max(0, refreshPayload.exp - now) : 7 * 24 * 3600

          if (ttl > 0) {
            await blacklistToken(refreshToken, ttl)
            log.info('Refresh token blacklisted on logout', {
              userId: refreshPayload.userId,
              ttl,
            })
          }
        }
      } catch (error) {
        // Refresh token might be invalid, continue with logout
        log.debug('Could not blacklist refresh token:', error)
      }
    }

    // Log logout
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (adminId) {
      await createLog(adminId, 'LOGOUT', 'admin_user', adminId.toString(), ip, request.headers.get('user-agent') || undefined)
    }

    // Prepare response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      } as AuthResponse,
      { status: 200 }
    )

    // Clear cookies
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    log.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' } as AuthResponse,
      { status: 500 }
    )
  }
}
