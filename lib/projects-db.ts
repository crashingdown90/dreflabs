import { getDb } from './db'

export interface Project {
  id: number
  slug: string
  title: string
  description: string
  category: string
  technologies: string | null
  image: string | null
  link: string | null
  github: string | null
  status: 'active' | 'archived' | 'in-progress'
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  slug: string
  title: string
  description: string
  category: string
  technologies?: string[]
  image?: string
  link?: string
  github?: string
  status?: 'active' | 'archived' | 'in-progress'
}

export interface UpdateProjectInput {
  slug?: string
  title?: string
  description?: string
  category?: string
  technologies?: string[]
  image?: string
  link?: string
  github?: string
  status?: 'active' | 'archived' | 'in-progress'
}

/**
 * Get all projects with optional filters
 */
export function getAllProjects(filters?: {
  status?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Project[] {
  const db = getDb()
  
  let query = 'SELECT * FROM projects WHERE 1=1'
  const params: any[] = []

  if (filters?.status) {
    query += ' AND status = ?'
    params.push(filters.status)
  }

  if (filters?.category) {
    query += ' AND category = ?'
    params.push(filters.category)
  }

  if (filters?.search) {
    query += ' AND (title LIKE ? OR description LIKE ?)'
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

  return db.prepare(query).all(...params) as Project[]
}

/**
 * Get a single project by ID
 */
export function getProjectById(id: number): Project | null {
  const db = getDb()
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | null
}

/**
 * Get a single project by slug
 */
export function getProjectBySlug(slug: string): Project | null {
  const db = getDb()
  return db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as Project | null
}

/**
 * Create a new project
 */
export function createProject(input: CreateProjectInput): Project {
  const db = getDb()
  
  const technologies = input.technologies ? input.technologies.join(',') : null
  const now = new Date().toISOString()

  const result = db.prepare(`
    INSERT INTO projects (
      slug, title, description, category, technologies, image, link, github,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.slug,
    input.title,
    input.description,
    input.category,
    technologies,
    input.image || null,
    input.link || null,
    input.github || null,
    input.status || 'active',
    now,
    now
  )

  return getProjectById(result.lastInsertRowid as number)!
}

/**
 * Update a project
 */
export function updateProject(id: number, input: UpdateProjectInput): Project | null {
  const db = getDb()
  
  const existingProject = getProjectById(id)
  if (!existingProject) {
    return null
  }

  const updates: string[] = []
  const params: any[] = []

  if (input.slug !== undefined) {
    updates.push('slug = ?')
    params.push(input.slug)
  }

  if (input.title !== undefined) {
    updates.push('title = ?')
    params.push(input.title)
  }

  if (input.description !== undefined) {
    updates.push('description = ?')
    params.push(input.description)
  }

  if (input.category !== undefined) {
    updates.push('category = ?')
    params.push(input.category)
  }

  if (input.technologies !== undefined) {
    updates.push('technologies = ?')
    params.push(input.technologies.join(','))
  }

  if (input.image !== undefined) {
    updates.push('image = ?')
    params.push(input.image)
  }

  if (input.link !== undefined) {
    updates.push('link = ?')
    params.push(input.link)
  }

  if (input.github !== undefined) {
    updates.push('github = ?')
    params.push(input.github)
  }

  if (input.status !== undefined) {
    updates.push('status = ?')
    params.push(input.status)
  }

  updates.push('updated_at = ?')
  params.push(new Date().toISOString())

  params.push(id)

  db.prepare(`
    UPDATE projects SET ${updates.join(', ')} WHERE id = ?
  `).run(...params)

  return getProjectById(id)
}

/**
 * Delete a project
 */
export function deleteProject(id: number): boolean {
  const db = getDb()
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id)
  return result.changes > 0
}

/**
 * Get project count with optional filters
 */
export function getProjectCount(filters?: {
  status?: string
  category?: string
  search?: string
}): number {
  const db = getDb()
  
  let query = 'SELECT COUNT(*) as count FROM projects WHERE 1=1'
  const params: any[] = []

  if (filters?.status) {
    query += ' AND status = ?'
    params.push(filters.status)
  }

  if (filters?.category) {
    query += ' AND category = ?'
    params.push(filters.category)
  }

  if (filters?.search) {
    query += ' AND (title LIKE ? OR description LIKE ?)'
    const searchTerm = `%${filters.search}%`
    params.push(searchTerm, searchTerm)
  }

  const result = db.prepare(query).get(...params) as { count: number }
  return result.count
}

/**
 * Get project categories with counts
 */
export function getProjectCategories(): { category: string; count: number }[] {
  const db = getDb()
  return db.prepare(`
    SELECT category, COUNT(*) as count
    FROM projects
    GROUP BY category
    ORDER BY count DESC
  `).all() as { category: string; count: number }[]
}

