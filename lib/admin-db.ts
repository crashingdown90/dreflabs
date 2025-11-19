import { getDb } from './db'
import { AdminUser, AdminSession, AdminLog, RateLimit } from '@/types/auth'
import { hashPassword } from './auth'

// ============================================
// ADMIN USER OPERATIONS
// ============================================

/**
 * Get admin user by username
 */
export function getAdminByUsername(username: string): AdminUser | null {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ? AND is_active = 1')
  return stmt.get(username) as AdminUser | null
}

/**
 * Get admin user by email
 */
export function getAdminByEmail(email: string): AdminUser | null {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM admin_users WHERE email = ? AND is_active = 1')
  return stmt.get(email) as AdminUser | null
}

/**
 * Get admin user by ID
 */
export function getAdminById(id: number): AdminUser | null {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM admin_users WHERE id = ?')
  return stmt.get(id) as AdminUser | null
}

/**
 * Get all admin users
 */
export function getAllAdmins(): AdminUser[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM admin_users ORDER BY created_at DESC')
  return stmt.all() as AdminUser[]
}

/**
 * Create a new admin user
 */
export async function createAdminUser(
  username: string,
  email: string,
  password: string,
  role: 'superadmin' | 'admin' | 'editor' = 'admin'
): Promise<number> {
  const db = getDb()
  const passwordHash = await hashPassword(password)

  const stmt = db.prepare(`
    INSERT INTO admin_users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `)

  const result = stmt.run(username, email, passwordHash, role)
  return result.lastInsertRowid as number
}

/**
 * Update admin user
 */
export function updateAdminUser(
  id: number,
  data: Partial<Pick<AdminUser, 'email' | 'role' | 'is_active'>>
): boolean {
  const db = getDb()
  const fields: string[] = []
  const values: (string | number)[] = []

  if (data.email !== undefined) {
    fields.push('email = ?')
    values.push(data.email)
  }
  if (data.role !== undefined) {
    fields.push('role = ?')
    values.push(data.role)
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?')
    values.push(data.is_active)
  }

  if (fields.length === 0) return false

  fields.push('updated_at = CURRENT_TIMESTAMP')
  values.push(id)

  const stmt = db.prepare(`
    UPDATE admin_users
    SET ${fields.join(', ')}
    WHERE id = ?
  `)

  const result = stmt.run(...values)
  return result.changes > 0
}

/**
 * Update admin password
 */
export async function updateAdminPassword(id: number, newPassword: string): Promise<boolean> {
  const db = getDb()
  const passwordHash = await hashPassword(newPassword)

  const stmt = db.prepare(`
    UPDATE admin_users
    SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)

  const result = stmt.run(passwordHash, id)
  return result.changes > 0
}

/**
 * Delete admin user (soft delete by setting is_active = 0)
 */
export function deleteAdminUser(id: number): boolean {
  const db = getDb()
  const stmt = db.prepare('UPDATE admin_users SET is_active = 0 WHERE id = ?')
  const result = stmt.run(id)
  return result.changes > 0
}

// ============================================
// SESSION OPERATIONS
// ============================================

/**
 * Create a new session
 */
export function createSession(adminId: number, refreshToken: string, expiresAt: string): number {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO admin_sessions (admin_id, refresh_token, expires_at)
    VALUES (?, ?, ?)
  `)

  const result = stmt.run(adminId, refreshToken, expiresAt)
  return result.lastInsertRowid as number
}

/**
 * Get session by refresh token
 */
export function getSessionByToken(refreshToken: string): AdminSession | null {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM admin_sessions WHERE refresh_token = ?')
  return stmt.get(refreshToken) as AdminSession | null
}

/**
 * Delete session by refresh token
 */
export function deleteSession(refreshToken: string): boolean {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM admin_sessions WHERE refresh_token = ?')
  const result = stmt.run(refreshToken)
  return result.changes > 0
}

/**
 * Delete all sessions for a user
 */
export function deleteAllUserSessions(adminId: number): boolean {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM admin_sessions WHERE admin_id = ?')
  const result = stmt.run(adminId)
  return result.changes > 0
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): number {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM admin_sessions WHERE expires_at < datetime("now")')
  const result = stmt.run()
  return result.changes
}

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

/**
 * Create an audit log entry
 */
export function createLog(
  adminId: number | null,
  action: string,
  resourceType?: string,
  resourceId?: string,
  ipAddress?: string,
  userAgent?: string
): number {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO admin_logs (admin_id, action, resource_type, resource_id, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(adminId, action, resourceType || null, resourceId || null, ipAddress || null, userAgent || null)
  return result.lastInsertRowid as number
}

/**
 * Get logs by admin ID
 */
export function getLogsByAdminId(adminId: number, limit: number = 100): AdminLog[] {
  const db = getDb()
  const stmt = db.prepare(`
    SELECT * FROM admin_logs
    WHERE admin_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `)
  return stmt.all(adminId, limit) as AdminLog[]
}

/**
 * Get recent logs
 */
export function getRecentLogs(limit: number = 100): AdminLog[] {
  const db = getDb()
  const stmt = db.prepare(`
    SELECT * FROM admin_logs
    ORDER BY created_at DESC
    LIMIT ?
  `)
  return stmt.all(limit) as AdminLog[]
}

// ============================================
// RATE LIMITING OPERATIONS
// ============================================

/**
 * Get rate limit record for identifier
 */
export function getRateLimit(identifier: string): RateLimit | null {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM rate_limits WHERE identifier = ?')
  return stmt.get(identifier) as RateLimit | null
}

/**
 * Create or update rate limit record
 */
export function updateRateLimit(identifier: string): RateLimit {
  const db = getDb()
  const existing = getRateLimit(identifier)

  if (existing) {
    const stmt = db.prepare(`
      UPDATE rate_limits
      SET attempt_count = attempt_count + 1, last_attempt_at = CURRENT_TIMESTAMP
      WHERE identifier = ?
    `)
    stmt.run(identifier)
  } else {
    const stmt = db.prepare(`
      INSERT INTO rate_limits (identifier, attempt_count)
      VALUES (?, 1)
    `)
    stmt.run(identifier)
  }

  return getRateLimit(identifier)!
}

/**
 * Block an identifier for a duration
 */
export function blockIdentifier(identifier: string, durationMinutes: number): boolean {
  const db = getDb()
  const blockedUntil = new Date()
  blockedUntil.setMinutes(blockedUntil.getMinutes() + durationMinutes)

  const stmt = db.prepare(`
    UPDATE rate_limits
    SET blocked_until = ?
    WHERE identifier = ?
  `)

  const result = stmt.run(blockedUntil.toISOString(), identifier)
  return result.changes > 0
}

/**
 * Check if identifier is blocked
 */
export function isBlocked(identifier: string): boolean {
  const rateLimit = getRateLimit(identifier)

  if (!rateLimit || !rateLimit.blocked_until) {
    return false
  }

  const blockedUntil = new Date(rateLimit.blocked_until)
  const now = new Date()

  return blockedUntil > now
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): boolean {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM rate_limits WHERE identifier = ?')
  const result = stmt.run(identifier)
  return result.changes > 0
}

/**
 * Clean up old rate limit records
 */
export function cleanupOldRateLimits(olderThanHours: number = 24): number {
  const db = getDb()
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - olderThanHours)

  const stmt = db.prepare(`
    DELETE FROM rate_limits
    WHERE last_attempt_at < ? AND (blocked_until IS NULL OR blocked_until < datetime("now"))
  `)

  const result = stmt.run(cutoffDate.toISOString())
  return result.changes
}
