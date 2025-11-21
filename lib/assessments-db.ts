import { getDb } from './db'
import { logger } from './logger'

export interface WebAssessment {
  id: number
  name: string
  email: string
  phone: string
  company: string | null
  project_type: string
  budget: string
  timeline: string
  description: string
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled'
  notes: string | null
  submitted_at: string
  read: number
  followed_up_at: string | null
}

export interface CreateAssessmentData {
  name: string
  email: string
  phone: string
  company?: string
  project_type: string
  budget: string
  timeline: string
  description: string
}

/**
 * Create a new web assessment submission
 */
export function createAssessment(data: CreateAssessmentData): WebAssessment {
  try {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO web_assessments (
        name, email, phone, company, project_type,
        budget, timeline, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.name,
      data.email,
      data.phone,
      data.company || null,
      data.project_type,
      data.budget,
      data.timeline,
      data.description
    )

    const assessment = getAssessmentById(result.lastInsertRowid as number)
    if (!assessment) {
      throw new Error('Failed to retrieve created assessment')
    }

    logger.info('Web assessment created', { id: assessment.id, email: data.email })
    return assessment
  } catch (error) {
    logger.error('Error creating web assessment', error)
    throw error
  }
}

/**
 * Get assessment by ID
 */
export function getAssessmentById(id: number): WebAssessment | null {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM web_assessments WHERE id = ?')
    const assessment = stmt.get(id) as WebAssessment | undefined
    return assessment || null
  } catch (error) {
    logger.error('Error getting assessment by ID', error)
    throw error
  }
}

/**
 * Get all assessments with optional filters
 */
export function getAllAssessments(options?: {
  status?: string
  read?: boolean
  limit?: number
  offset?: number
}): WebAssessment[] {
  try {
    const db = getDb()
    let query = 'SELECT * FROM web_assessments WHERE 1=1'
    const params: any[] = []

    if (options?.status) {
      query += ' AND status = ?'
      params.push(options.status)
    }

    if (options?.read !== undefined) {
      query += ' AND read = ?'
      params.push(options.read ? 1 : 0)
    }

    query += ' ORDER BY submitted_at DESC'

    if (options?.limit) {
      query += ' LIMIT ?'
      params.push(options.limit)
    }

    if (options?.offset) {
      query += ' OFFSET ?'
      params.push(options.offset)
    }

    const stmt = db.prepare(query)
    return stmt.all(...params) as WebAssessment[]
  } catch (error) {
    logger.error('Error getting all assessments', error)
    throw error
  }
}

/**
 * Get unread assessments count
 */
export function getUnreadAssessmentsCount(): number {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT COUNT(*) as count FROM web_assessments WHERE read = 0')
    const result = stmt.get() as { count: number }
    return result.count
  } catch (error) {
    logger.error('Error getting unread assessments count', error)
    throw error
  }
}

/**
 * Mark assessment as read
 */
export function markAssessmentAsRead(id: number): boolean {
  try {
    const db = getDb()
    const stmt = db.prepare('UPDATE web_assessments SET read = 1 WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  } catch (error) {
    logger.error('Error marking assessment as read', error)
    throw error
  }
}

/**
 * Update assessment status
 */
export function updateAssessmentStatus(
  id: number,
  status: WebAssessment['status'],
  notes?: string
): boolean {
  try {
    const db = getDb()
    const followedUpAt = status === 'contacted' ? new Date().toISOString() : null

    const stmt = db.prepare(`
      UPDATE web_assessments
      SET status = ?, notes = COALESCE(?, notes), followed_up_at = COALESCE(?, followed_up_at)
      WHERE id = ?
    `)

    const result = stmt.run(status, notes || null, followedUpAt, id)
    return result.changes > 0
  } catch (error) {
    logger.error('Error updating assessment status', error)
    throw error
  }
}

/**
 * Delete assessment by ID
 */
export function deleteAssessment(id: number): boolean {
  try {
    const db = getDb()
    const stmt = db.prepare('DELETE FROM web_assessments WHERE id = ?')
    const result = stmt.run(id)

    if (result.changes > 0) {
      logger.info('Web assessment deleted', { id })
    }

    return result.changes > 0
  } catch (error) {
    logger.error('Error deleting assessment', error)
    throw error
  }
}

/**
 * Get assessment statistics
 */
export function getAssessmentStats(): {
  total: number
  new: number
  contacted: number
  inProgress: number
  completed: number
  cancelled: number
  unread: number
} {
  try {
    const db = getDb()

    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM web_assessments')
    const newStmt = db.prepare("SELECT COUNT(*) as count FROM web_assessments WHERE status = 'new'")
    const contactedStmt = db.prepare("SELECT COUNT(*) as count FROM web_assessments WHERE status = 'contacted'")
    const inProgressStmt = db.prepare("SELECT COUNT(*) as count FROM web_assessments WHERE status = 'in-progress'")
    const completedStmt = db.prepare("SELECT COUNT(*) as count FROM web_assessments WHERE status = 'completed'")
    const cancelledStmt = db.prepare("SELECT COUNT(*) as count FROM web_assessments WHERE status = 'cancelled'")
    const unreadStmt = db.prepare('SELECT COUNT(*) as count FROM web_assessments WHERE read = 0')

    return {
      total: (totalStmt.get() as { count: number }).count,
      new: (newStmt.get() as { count: number }).count,
      contacted: (contactedStmt.get() as { count: number }).count,
      inProgress: (inProgressStmt.get() as { count: number }).count,
      completed: (completedStmt.get() as { count: number }).count,
      cancelled: (cancelledStmt.get() as { count: number }).count,
      unread: (unreadStmt.get() as { count: number }).count,
    }
  } catch (error) {
    logger.error('Error getting assessment stats', error)
    throw error
  }
}
