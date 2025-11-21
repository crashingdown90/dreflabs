import { SignJWT, jwtVerify } from 'jose'
import { log } from '@/lib/logger'
import bcrypt from 'bcryptjs'
import { JWTPayload, AdminUser } from '@/types/auth'
import { getEnv } from './env'

// Get validated environment variables
const env = getEnv()

// Edge runtime detection with proper type
interface EdgeGlobal {
  EdgeRuntime?: string
}

const isEdgeRuntime = typeof (globalThis as unknown as EdgeGlobal).EdgeRuntime === 'string' ||
                      process.env.NEXT_RUNTIME === 'edge' ||
                      typeof process.versions?.node === 'undefined'

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)

/**
 * Type guard to validate JWT payload structure
 * @param payload - Payload to validate
 * @returns True if payload matches JWTPayload structure
 */
function isValidJWTPayload(payload: unknown): payload is JWTPayload {
  if (!payload || typeof payload !== 'object') return false

  const p = payload as Record<string, unknown>
  return (
    typeof p.userId === 'number' &&
    typeof p.username === 'string' &&
    typeof p.email === 'string' &&
    typeof p.role === 'string'
  )
}

/**
 * Generate a JWT access token
 * @param payload - User data to encode in token
 * @param expiresIn - Token expiration time (default: 1 hour)
 * @returns JWT token string
 */
export async function generateAccessToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: string = '1h'
): Promise<string> {
  // jose's SignJWT accepts Record<string, unknown>
  const token = await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)

  return token
}

/**
 * Generate a refresh token (long-lived)
 * @param payload - User data to encode in token
 * @param expiresIn - Token expiration time (default: 7 days)
 * @returns Refresh token string
 */
export async function generateRefreshToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: string = '7d'
): Promise<string> {
  // jose's SignJWT accepts Record<string, unknown>
  const token = await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(REFRESH_TOKEN_SECRET)

  return token
}

/**
 * Verify a JWT access token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    // Check if token is blacklisted (skip in edge runtime)
    if (!isEdgeRuntime) {
      const { isTokenBlacklisted } = await import('./redis')
      const blacklisted = await isTokenBlacklisted(token)
      if (blacklisted) {
        log.warn('Attempted use of blacklisted token')
        return null
      }
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Use type guard to validate and narrow type
    if (isValidJWTPayload(payload)) {
      return payload
    }
    return null
  } catch (error) {
    log.error('Token verification failed:', error)
    return null
  }
}

/**
 * Verify a refresh token
 * @param token - Refresh token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    // Check if token is blacklisted (skip in edge runtime)
    if (!isEdgeRuntime) {
      const { isTokenBlacklisted } = await import('./redis')
      const blacklisted = await isTokenBlacklisted(token)
      if (blacklisted) {
        log.warn('Attempted use of blacklisted refresh token')
        return null
      }
    }

    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET)

    // Use type guard to validate and narrow type
    if (isValidJWTPayload(payload)) {
      return payload
    }
    return null
  } catch (error) {
    log.error('Refresh token verification failed:', error)
    return null
  }
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare a plain text password with a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if passwords match
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Extract token from Authorization header or cookies
 * @param authHeader - Authorization header value
 * @param cookieToken - Token from cookie
 * @returns Token string or null
 */
export function extractToken(authHeader?: string | null, cookieToken?: string): string | null {
  // Check Authorization header first (Bearer token)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Fallback to cookie token
  if (cookieToken) {
    return cookieToken
  }

  return null
}

/**
 * Get expiration date for token
 * @param days - Number of days from now
 * @returns ISO date string
 */
export function getExpirationDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

/**
 * Check if a date has expired
 * @param expirationDate - ISO date string
 * @returns True if expired
 */
export function isExpired(expirationDate: string): boolean {
  return new Date(expirationDate) < new Date()
}

/**
 * Sanitize user data for client response (remove sensitive fields)
 * @param user - User object from database
 * @returns Sanitized user object without sensitive fields
 */
export function sanitizeUser(user: AdminUser): Omit<AdminUser, 'password_hash'> {
  const { password_hash: _passwordHash, ...sanitized } = user
  return sanitized
}

/**
 * Verify authentication from request headers
 * @param authHeader - Authorization header value
 * @param request - Next.js request object
 * @returns Decoded JWT payload or null if invalid
 */
export async function verifyAuth(
  authHeader: string | null,
  _request?: Request
): Promise<JWTPayload | null> {
  try {
    // Extract token from Authorization header
    const token = extractToken(authHeader)

    if (!token) {
      return null
    }

    // Verify the access token
    const payload = await verifyAccessToken(token)

    return payload
  } catch (error) {
    log.error('Auth verification failed:', error)
    return null
  }
}
