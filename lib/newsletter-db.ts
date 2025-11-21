import { getDb } from './db'

export interface Subscriber {
  id: number
  email: string
  subscribed_at: string
  active: number
}

/**
 * Add a new subscriber to the newsletter
 */
export function addSubscriber(email: string): Subscriber {
  const db = getDb()

  try {
    const stmt = db.prepare(`
      INSERT INTO subscribers (email, active)
      VALUES (?, 1)
    `)

    const result = stmt.run(email.toLowerCase().trim())

    return {
      id: result.lastInsertRowid as number,
      email: email.toLowerCase().trim(),
      subscribed_at: new Date().toISOString(),
      active: 1,
    }
  } catch (error: any) {
    // Check for unique constraint violation
    if (error.message?.includes('UNIQUE constraint failed')) {
      throw new Error('This email is already subscribed')
    }
    throw error
  }
}

/**
 * Check if an email is already subscribed
 */
export function isSubscribed(email: string): boolean {
  const db = getDb()

  const stmt = db.prepare(`
    SELECT id FROM subscribers
    WHERE email = ? AND active = 1
  `)

  const result = stmt.get(email.toLowerCase().trim())
  return !!result
}

/**
 * Unsubscribe an email
 */
export function unsubscribe(email: string): boolean {
  const db = getDb()

  const stmt = db.prepare(`
    UPDATE subscribers
    SET active = 0
    WHERE email = ?
  `)

  const result = stmt.run(email.toLowerCase().trim())
  return result.changes > 0
}

/**
 * Get all active subscribers
 */
export function getAllSubscribers(): Subscriber[] {
  const db = getDb()

  const stmt = db.prepare(`
    SELECT * FROM subscribers
    WHERE active = 1
    ORDER BY subscribed_at DESC
  `)

  return stmt.all() as Subscriber[]
}

/**
 * Get subscriber by email
 */
export function getSubscriberByEmail(email: string): Subscriber | null {
  const db = getDb()

  const stmt = db.prepare(`
    SELECT * FROM subscribers
    WHERE email = ?
  `)

  return stmt.get(email.toLowerCase().trim()) as Subscriber | null
}

/**
 * Get subscriber statistics
 */
export function getSubscriberStats() {
  const db = getDb()

  const total = db.prepare('SELECT COUNT(*) as count FROM subscribers WHERE active = 1').get() as { count: number }
  const today = db.prepare(`
    SELECT COUNT(*) as count FROM subscribers
    WHERE active = 1 AND DATE(subscribed_at) = DATE('now')
  `).get() as { count: number }
  const thisWeek = db.prepare(`
    SELECT COUNT(*) as count FROM subscribers
    WHERE active = 1 AND DATE(subscribed_at) >= DATE('now', '-7 days')
  `).get() as { count: number }
  const thisMonth = db.prepare(`
    SELECT COUNT(*) as count FROM subscribers
    WHERE active = 1 AND DATE(subscribed_at) >= DATE('now', 'start of month')
  `).get() as { count: number }

  return {
    total: total.count,
    today: today.count,
    thisWeek: thisWeek.count,
    thisMonth: thisMonth.count,
  }
}
