import { getDb } from './db'

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category: string
  tags: string | null
  read_time: number
  status: 'draft' | 'published'
  author_id: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface CreateBlogPostInput {
  slug: string
  title: string
  excerpt?: string
  content: string
  cover_image?: string
  category: string
  tags?: string[]
  read_time?: number
  status?: 'draft' | 'published'
  author_id: number
}

export interface UpdateBlogPostInput {
  slug?: string
  title?: string
  excerpt?: string
  content?: string
  cover_image?: string
  category?: string
  tags?: string[]
  read_time?: number
  status?: 'draft' | 'published'
}

/**
 * Get all blog posts with optional filters
 */
export function getAllBlogPosts(filters?: {
  status?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
}): BlogPost[] {
  const db = getDb()
  
  let query = 'SELECT * FROM blog_posts WHERE 1=1'
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
    query += ' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)'
    const searchTerm = `%${filters.search}%`
    params.push(searchTerm, searchTerm, searchTerm)
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

  return db.prepare(query).all(...params) as BlogPost[]
}

/**
 * Get a single blog post by ID
 */
export function getBlogPostById(id: number): BlogPost | null {
  const db = getDb()
  return db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as BlogPost | null
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const db = getDb()
  return db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug) as BlogPost | null
}

/**
 * Create a new blog post
 */
export function createBlogPost(input: CreateBlogPostInput): BlogPost {
  const db = getDb()
  
  const tags = input.tags ? input.tags.join(',') : null
  const now = new Date().toISOString()
  const publishedAt = input.status === 'published' ? now : null

  const result = db.prepare(`
    INSERT INTO blog_posts (
      slug, title, excerpt, content, cover_image, category, tags,
      read_time, status, author_id, created_at, updated_at, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.slug,
    input.title,
    input.excerpt || null,
    input.content,
    input.cover_image || null,
    input.category,
    tags,
    input.read_time || 5,
    input.status || 'draft',
    input.author_id,
    now,
    now,
    publishedAt
  )

  return getBlogPostById(result.lastInsertRowid as number)!
}

/**
 * Update a blog post
 */
export function updateBlogPost(id: number, input: UpdateBlogPostInput): BlogPost | null {
  const db = getDb()
  
  const existingPost = getBlogPostById(id)
  if (!existingPost) {
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

  if (input.excerpt !== undefined) {
    updates.push('excerpt = ?')
    params.push(input.excerpt)
  }

  if (input.content !== undefined) {
    updates.push('content = ?')
    params.push(input.content)
  }

  if (input.cover_image !== undefined) {
    updates.push('cover_image = ?')
    params.push(input.cover_image)
  }

  if (input.category !== undefined) {
    updates.push('category = ?')
    params.push(input.category)
  }

  if (input.tags !== undefined) {
    updates.push('tags = ?')
    params.push(input.tags.join(','))
  }

  if (input.read_time !== undefined) {
    updates.push('read_time = ?')
    params.push(input.read_time)
  }

  if (input.status !== undefined) {
    updates.push('status = ?')
    params.push(input.status)
    
    // Set published_at when status changes to published
    if (input.status === 'published' && existingPost.status !== 'published') {
      updates.push('published_at = ?')
      params.push(new Date().toISOString())
    }
  }

  updates.push('updated_at = ?')
  params.push(new Date().toISOString())

  params.push(id)

  db.prepare(`
    UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?
  `).run(...params)

  return getBlogPostById(id)
}

/**
 * Delete a blog post
 */
export function deleteBlogPost(id: number): boolean {
  const db = getDb()
  const result = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id)
  return result.changes > 0
}

/**
 * Get blog post count with optional filters
 */
export function getBlogPostCount(filters?: {
  status?: string
  category?: string
  search?: string
}): number {
  const db = getDb()
  
  let query = 'SELECT COUNT(*) as count FROM blog_posts WHERE 1=1'
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
    query += ' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)'
    const searchTerm = `%${filters.search}%`
    params.push(searchTerm, searchTerm, searchTerm)
  }

  const result = db.prepare(query).get(...params) as { count: number }
  return result.count
}

/**
 * Get blog categories with post counts
 */
export function getBlogCategories(): { category: string; count: number }[] {
  const db = getDb()
  return db.prepare(`
    SELECT category, COUNT(*) as count
    FROM blog_posts
    GROUP BY category
    ORDER BY count DESC
  `).all() as { category: string; count: number }[]
}

