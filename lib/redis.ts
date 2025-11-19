import Redis from 'ioredis'
import { logger } from './logger'

/**
 * Redis client configuration
 * Uses Redis for session management, rate limiting, and caching
 */

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
}

// Create Redis client instance
let redisClient: Redis | null = null

/**
 * Initialize Redis connection
 */
export function initializeRedis(): Redis | null {
  try {
    // Skip Redis in test environment or if explicitly disabled
    if (process.env.REDIS_DISABLED === 'true' || process.env.NODE_ENV === 'test') {
      logger.info('Redis disabled or in test mode, using in-memory fallback')
      return null
    }

    redisClient = new Redis(redisConfig)

    redisClient.on('connect', () => {
      logger.info('Redis client connected successfully')
    })

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err)
      // Don't crash the app if Redis fails, fall back to in-memory
    })

    redisClient.on('close', () => {
      logger.warn('Redis connection closed')
    })

    redisClient.on('reconnecting', (delay: number) => {
      logger.info(`Redis reconnecting in ${delay}ms`)
    })

    return redisClient
  } catch (error) {
    logger.error('Failed to initialize Redis client:', error)
    return null
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis | null {
  if (!redisClient) {
    redisClient = initializeRedis()
  }
  return redisClient
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
    logger.info('Redis connection closed gracefully')
  }
}

/**
 * Rate limiting with Redis
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const client = getRedisClient()

  // Fallback to in-memory if Redis is not available
  if (!client) {
    return checkRateLimitInMemory(key, limit, windowMs)
  }

  try {
    const now = Date.now()
    const window = Math.floor(now / windowMs)
    const redisKey = `rate_limit:${key}:${window}`

    // Use Redis pipeline for atomic operations
    const pipeline = client.pipeline()
    pipeline.incr(redisKey)
    pipeline.expire(redisKey, Math.ceil(windowMs / 1000))

    const results = await pipeline.exec()
    if (!results) {
      throw new Error('Redis pipeline failed')
    }

    const count = results[0][1] as number
    const allowed = count <= limit
    const remaining = Math.max(0, limit - count)
    const resetTime = (window + 1) * windowMs

    return { allowed, remaining, resetTime }
  } catch (error) {
    logger.error('Redis rate limit check failed:', error)
    // Fallback to in-memory on Redis failure
    return checkRateLimitInMemory(key, limit, windowMs)
  }
}

// In-memory fallback for rate limiting
const rateLimitMemoryStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimitInMemory(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const window = Math.floor(now / windowMs)
  const memKey = `${key}:${window}`

  const entry = rateLimitMemoryStore.get(memKey) || { count: 0, resetTime: (window + 1) * windowMs }

  entry.count++
  rateLimitMemoryStore.set(memKey, entry)

  // Clean up old entries
  if (rateLimitMemoryStore.size > 10000) {
    const oldestAllowed = now - windowMs * 2
    for (const [k, v] of rateLimitMemoryStore.entries()) {
      if (v.resetTime < oldestAllowed) {
        rateLimitMemoryStore.delete(k)
      }
    }
  }

  const allowed = entry.count <= limit
  const remaining = Math.max(0, limit - entry.count)

  return { allowed, remaining: remaining, resetTime: entry.resetTime }
}

/**
 * Session storage with Redis
 */
export async function setSession(sessionId: string, data: any, ttl: number = 3600): Promise<boolean> {
  const client = getRedisClient()
  if (!client) {
    // Fallback to in-memory if needed
    sessionMemoryStore.set(sessionId, { data, expires: Date.now() + ttl * 1000 })
    return true
  }

  try {
    await client.setex(`session:${sessionId}`, ttl, JSON.stringify(data))
    return true
  } catch (error) {
    logger.error('Failed to set session in Redis:', error)
    sessionMemoryStore.set(sessionId, { data, expires: Date.now() + ttl * 1000 })
    return false
  }
}

export async function getSession(sessionId: string): Promise<any | null> {
  const client = getRedisClient()
  if (!client) {
    const session = sessionMemoryStore.get(sessionId)
    if (session && session.expires > Date.now()) {
      return session.data
    }
    return null
  }

  try {
    const data = await client.get(`session:${sessionId}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    logger.error('Failed to get session from Redis:', error)
    const session = sessionMemoryStore.get(sessionId)
    if (session && session.expires > Date.now()) {
      return session.data
    }
    return null
  }
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const client = getRedisClient()
  sessionMemoryStore.delete(sessionId)

  if (!client) {
    return true
  }

  try {
    await client.del(`session:${sessionId}`)
    return true
  } catch (error) {
    logger.error('Failed to delete session from Redis:', error)
    return false
  }
}

// In-memory fallback for sessions
const sessionMemoryStore = new Map<string, { data: any; expires: number }>()

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of sessionMemoryStore.entries()) {
    if (value.expires < now) {
      sessionMemoryStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

/**
 * Token blacklist for logout
 */
export async function blacklistToken(token: string, expiresIn: number): Promise<boolean> {
  const client = getRedisClient()
  const key = `blacklist:${token}`

  if (!client) {
    tokenBlacklistMemory.set(token, Date.now() + expiresIn * 1000)
    return true
  }

  try {
    await client.setex(key, expiresIn, '1')
    return true
  } catch (error) {
    logger.error('Failed to blacklist token:', error)
    tokenBlacklistMemory.set(token, Date.now() + expiresIn * 1000)
    return false
  }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const client = getRedisClient()

  // Check memory first
  const memExpiry = tokenBlacklistMemory.get(token)
  if (memExpiry && memExpiry > Date.now()) {
    return true
  }

  if (!client) {
    return false
  }

  try {
    const exists = await client.exists(`blacklist:${token}`)
    return exists === 1
  } catch (error) {
    logger.error('Failed to check token blacklist:', error)
    return false
  }
}

// In-memory fallback for token blacklist
const tokenBlacklistMemory = new Map<string, number>()

// Clean up expired blacklisted tokens
setInterval(() => {
  const now = Date.now()
  for (const [token, expires] of tokenBlacklistMemory.entries()) {
    if (expires < now) {
      tokenBlacklistMemory.delete(token)
    }
  }
}, 60000) // Clean up every minute

/**
 * Cache management
 */
export async function setCache(key: string, value: any, ttl: number = 300): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.setex(`cache:${key}`, ttl, JSON.stringify(value))
    return true
  } catch (error) {
    logger.error('Failed to set cache:', error)
    return false
  }
}

export async function getCache(key: string): Promise<any | null> {
  const client = getRedisClient()
  if (!client) return null

  try {
    const data = await client.get(`cache:${key}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    logger.error('Failed to get cache:', error)
    return null
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.del(`cache:${key}`)
    return true
  } catch (error) {
    logger.error('Failed to delete cache:', error)
    return false
  }
}