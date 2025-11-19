import { getDb } from './db'
import type { Comment, Subscriber, Contact, PageView } from '@/types'

// Comments
export function getCommentsByPost(postSlug: string, approvedOnly = true): Comment[] {
  const db = getDb()
  const query = approvedOnly
    ? 'SELECT * FROM comments WHERE post_slug = ? AND approved = 1 ORDER BY created_at DESC'
    : 'SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC'

  const rows = db.prepare(query).all(postSlug) as Array<{
    id: number
    post_slug: string
    author_name: string
    author_email: string
    content: string
    created_at: string
    approved: number
  }>

  return rows.map((row) => ({
    id: row.id,
    postSlug: row.post_slug,
    authorName: row.author_name,
    authorEmail: row.author_email,
    content: row.content,
    createdAt: row.created_at,
    approved: row.approved === 1,
  }))
}

export function createComment(
  postSlug: string,
  authorName: string,
  authorEmail: string,
  content: string
): number {
  const db = getDb()
  const result = db
    .prepare('INSERT INTO comments (post_slug, author_name, author_email, content) VALUES (?, ?, ?, ?)')
    .run(postSlug, authorName, authorEmail, content)
  return result.lastInsertRowid as number
}

export function approveComment(id: number): void {
  const db = getDb()
  db.prepare('UPDATE comments SET approved = 1 WHERE id = ?').run(id)
}

// Subscribers
export function getSubscriberByEmail(email: string): Subscriber | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email) as
    | {
        id: number
        email: string
        subscribed_at: string
        active: number
      }
    | undefined

  if (!row) return null

  return {
    id: row.id,
    email: row.email,
    subscribedAt: row.subscribed_at,
    active: row.active === 1,
  }
}

export function createSubscriber(email: string): number {
  const db = getDb()
  const result = db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email)
  return result.lastInsertRowid as number
}

export function unsubscribeEmail(email: string): void {
  const db = getDb()
  db.prepare('UPDATE subscribers SET active = 0 WHERE email = ?').run(email)
}

// Contacts
export function createContact(
  name: string,
  email: string,
  message: string,
  company?: string,
  serviceInterest?: string
): number {
  const db = getDb()
  const result = db
    .prepare(
      'INSERT INTO contacts (name, email, company, service_interest, message) VALUES (?, ?, ?, ?, ?)'
    )
    .run(name, email, company || null, serviceInterest || null, message)
  return result.lastInsertRowid as number
}

export function getContacts(unreadOnly = false): Contact[] {
  const db = getDb()
  const query = unreadOnly
    ? 'SELECT * FROM contacts WHERE read = 0 ORDER BY submitted_at DESC'
    : 'SELECT * FROM contacts ORDER BY submitted_at DESC'

  const rows = db.prepare(query).all() as Array<{
    id: number
    name: string
    email: string
    company: string | null
    service_interest: string | null
    message: string
    submitted_at: string
    read: number
  }>

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company || undefined,
    serviceInterest: row.service_interest || undefined,
    message: row.message,
    submittedAt: row.submitted_at,
    read: row.read === 1,
  }))
}

export function markContactAsRead(id: number): void {
  const db = getDb()
  db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(id)
}

// Page Views / Analytics
export function createPageView(
  pagePath: string,
  referrer?: string,
  userAgent?: string
): number {
  const db = getDb()
  const result = db
    .prepare('INSERT INTO page_views (page_path, referrer, user_agent) VALUES (?, ?, ?)')
    .run(pagePath, referrer || null, userAgent || null)
  return result.lastInsertRowid as number
}

export function getPageViewsByPath(pagePath: string, limit = 100): PageView[] {
  const db = getDb()
  const rows = db
    .prepare(
      'SELECT * FROM page_views WHERE page_path = ? ORDER BY viewed_at DESC LIMIT ?'
    )
    .all(pagePath, limit) as Array<{
    id: number
    page_path: string
    referrer: string | null
    user_agent: string | null
    viewed_at: string
  }>

  return rows.map((row) => ({
    id: row.id,
    pagePath: row.page_path,
    referrer: row.referrer || undefined,
    userAgent: row.user_agent || undefined,
    viewedAt: row.viewed_at,
  }))
}

export function getPageViewStats(days = 7): Array<{ path: string; count: number }> {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT page_path as path, COUNT(*) as count
       FROM page_views
       WHERE viewed_at >= datetime('now', '-' || ? || ' days')
       GROUP BY page_path
       ORDER BY count DESC`
    )
    .all(days) as Array<{ path: string; count: number }>

  return rows
}
