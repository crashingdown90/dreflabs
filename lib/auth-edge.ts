/**
 * Edge-runtime-safe authentication functions
 * Used by middleware.ts which runs in edge runtime
 * Does NOT include Redis blacklist checking
 */

import { jwtVerify } from 'jose'
import { JWTPayload } from '@/types/auth'
import { getEnv } from './env'

// Get validated environment variables
const env = getEnv()

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)

/**
 * Verify a JWT access token (edge-safe version)
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    // Validate that payload has required fields
    if (
      payload &&
      typeof payload.userId === 'number' &&
      typeof payload.username === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return payload as unknown as JWTPayload
    }
    return null
  } catch (error) {
    // In edge runtime, we can't use the logger, so use console
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Verify a refresh token (edge-safe version)
 * @param token - Refresh token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET)
    // Validate that payload has required fields
    if (
      payload &&
      typeof payload.userId === 'number' &&
      typeof payload.username === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return payload as unknown as JWTPayload
    }
    return null
  } catch (error) {
    // In edge runtime, we can't use the logger, so use console
    console.error('Refresh token verification failed:', error)
    return null
  }
}