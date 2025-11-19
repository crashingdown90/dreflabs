import { getDb } from './db'

export interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_url: string
  mime_type: string
  file_size: number
  width: number | null
  height: number | null
  uploaded_by: number
  created_at: string
}

export interface CreateMediaFileInput {
  filename: string
  original_name: string
  file_path: string
  file_url: string
  mime_type: string
  file_size: number
  width?: number
  height?: number
  uploaded_by: number
}

/**
 * Get all media files with optional filters
 */
export function getAllMediaFiles(filters?: {
  mime_type?: string
  search?: string
  limit?: number
  offset?: number
}): MediaFile[] {
  const db = getDb()
  
  let query = 'SELECT * FROM media_files WHERE 1=1'
  const params: any[] = []

  if (filters?.mime_type) {
    query += ' AND mime_type LIKE ?'
    params.push(`${filters.mime_type}%`)
  }

  if (filters?.search) {
    query += ' AND (filename LIKE ? OR original_name LIKE ?)'
    const searchTerm = `%${filters.search}%`
    params.push(searchTerm, searchTerm)
  }

  query += ' ORDER BY created_at DESC'

  if (filters?.limit) {
    query += ' LIMIT ?'
    params.push(filters.limit)
  }

  if (filters?.offset) {
    query += ' OFFSET ?'
    params.push(filters.offset)
  }

  return db.prepare(query).all(...params) as MediaFile[]
}

/**
 * Get a single media file by ID
 */
export function getMediaFileById(id: number): MediaFile | null {
  const db = getDb()
  return db.prepare('SELECT * FROM media_files WHERE id = ?').get(id) as MediaFile | null
}

/**
 * Get a single media file by filename
 */
export function getMediaFileByFilename(filename: string): MediaFile | null {
  const db = getDb()
  return db.prepare('SELECT * FROM media_files WHERE filename = ?').get(filename) as MediaFile | null
}

/**
 * Create a new media file record
 */
export function createMediaFile(input: CreateMediaFileInput): MediaFile {
  const db = getDb()
  
  const now = new Date().toISOString()

  const result = db.prepare(`
    INSERT INTO media_files (
      filename, original_name, file_path, file_url, mime_type, file_size,
      width, height, uploaded_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.filename,
    input.original_name,
    input.file_path,
    input.file_url,
    input.mime_type,
    input.file_size,
    input.width || null,
    input.height || null,
    input.uploaded_by,
    now
  )

  return getMediaFileById(result.lastInsertRowid as number)!
}

/**
 * Delete a media file record
 */
export function deleteMediaFile(id: number): boolean {
  const db = getDb()
  const result = db.prepare('DELETE FROM media_files WHERE id = ?').run(id)
  return result.changes > 0
}

/**
 * Get media file count with optional filters
 */
export function getMediaFileCount(filters?: {
  mime_type?: string
  search?: string
}): number {
  const db = getDb()
  
  let query = 'SELECT COUNT(*) as count FROM media_files WHERE 1=1'
  const params: any[] = []

  if (filters?.mime_type) {
    query += ' AND mime_type LIKE ?'
    params.push(`${filters.mime_type}%`)
  }

  if (filters?.search) {
    query += ' AND (filename LIKE ? OR original_name LIKE ?)'
    const searchTerm = `%${filters.search}%`
    params.push(searchTerm, searchTerm)
  }

  const result = db.prepare(query).get(...params) as { count: number }
  return result.count
}

/**
 * Get total storage used in bytes
 */
export function getTotalStorageUsed(): number {
  const db = getDb()
  const result = db.prepare('SELECT SUM(file_size) as total FROM media_files').get() as { total: number | null }
  return result.total || 0
}

