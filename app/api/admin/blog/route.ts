import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { authorizeRequest } from '@/lib/auth-helpers'
import { getAllBlogPosts, createBlogPost, getBlogPostCount, getBlogCategories } from '@/lib/blog-db'
import { createLog } from '@/lib/admin-db'
import { sanitizeHtml, sanitizeText, sanitizeUrl, validateCsrfToken } from '@/lib/security'

/**
 * GET /api/admin/blog
 * Get all blog posts with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await authorizeRequest(request, 'blog:read')
    if (!authResult.authorized) {
      return authResult.response!
    }
    const payload = authResult.payload!

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get blog posts
    const posts = getAllBlogPosts({
      status,
      category,
      search,
      limit,
      offset,
    })

    // Get total count
    const total = getBlogPostCount({ status, category, search })

    // Get categories
    const categories = getBlogCategories()

    // Log action
    await createLog(
      payload.userId,
      'BLOG_LIST_VIEWED',
      'blog_post',
      undefined,
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        categories,
      },
    })
  } catch (error) {
    log.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/blog
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token
    if (!validateCsrfToken(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    // Verify authentication and authorization
    const authResult = await authorizeRequest(request, 'blog:create')
    if (!authResult.authorized) {
      return authResult.response!
    }
    const payload = authResult.payload!

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.slug || !body.category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: title, content, slug, category' },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS attacks
    const sanitizedData = {
      slug: sanitizeText(body.slug),
      title: sanitizeText(body.title),
      excerpt: body.excerpt ? sanitizeText(body.excerpt) : '',
      content: sanitizeHtml(body.content), // Allow some HTML but sanitize dangerous content
      cover_image: body.cover_image ? (body.cover_image.startsWith('http') ? sanitizeUrl(body.cover_image) : body.cover_image) : undefined,
      category: sanitizeText(body.category),
      tags: Array.isArray(body.tags) ? body.tags.map((tag: string) => sanitizeText(tag)) : [],
      read_time: parseInt(body.read_time) || 5,
      status: ['draft', 'published'].includes(body.status) ? body.status : 'draft',
      author_id: payload.userId,
    }

    // Create blog post
    const post = createBlogPost(sanitizedData)

    // Log action
    await createLog(
      payload.userId,
      'BLOG_POST_CREATED',
      'blog_post',
      post.id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    }, { status: 201 })
  } catch (error: any) {
    log.error('Error creating blog post:', error)
    
    // Handle unique constraint violation (duplicate slug)
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, message: 'A blog post with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

