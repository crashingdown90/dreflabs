import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { authorizeRequest, authorizeOwnResource } from '@/lib/auth-helpers'
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/blog-db'
import { createLog } from '@/lib/admin-db'
import { sanitizeHtml, sanitizeText, sanitizeUrl, validateCsrfToken } from '@/lib/security'

/**
 * GET /api/admin/blog/[id]
 * Get a single blog post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await authorizeRequest(request, 'blog:read')
    if (!authResult.authorized) {
      return authResult.response!
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog post ID' },
        { status: 400 }
      )
    }

    const post = getBlogPostById(id)

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    log.error('Error fetching blog post:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/blog/[id]
 * Update a blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate CSRF token
    if (!validateCsrfToken(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog post ID' },
        { status: 400 }
      )
    }

    // Get the post to check ownership
    const existingPost = getBlogPostById(id)
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Verify authentication and authorization with ownership check
    const authResult = await authorizeOwnResource(
      request,
      'blog:update',
      existingPost.author_id
    )
    if (!authResult.authorized) {
      return authResult.response!
    }
    const payload = authResult.payload!

    // Parse request body
    const body = await request.json()

    // Sanitize inputs to prevent XSS attacks
    const sanitizedData: any = {}
    if (body.slug !== undefined) sanitizedData.slug = sanitizeText(body.slug)
    if (body.title !== undefined) sanitizedData.title = sanitizeText(body.title)
    if (body.excerpt !== undefined) sanitizedData.excerpt = sanitizeText(body.excerpt)
    if (body.content !== undefined) sanitizedData.content = sanitizeHtml(body.content)
    if (body.cover_image !== undefined) {
      sanitizedData.cover_image = body.cover_image
        ? (body.cover_image.startsWith('http') ? sanitizeUrl(body.cover_image) : body.cover_image)
        : undefined
    }
    if (body.category !== undefined) sanitizedData.category = sanitizeText(body.category)
    if (body.tags !== undefined) {
      sanitizedData.tags = Array.isArray(body.tags) ? body.tags.map((tag: string) => sanitizeText(tag)) : []
    }
    if (body.read_time !== undefined) sanitizedData.read_time = parseInt(body.read_time) || 5
    if (body.status !== undefined) {
      sanitizedData.status = ['draft', 'published'].includes(body.status) ? body.status : 'draft'
    }

    // Update blog post
    const post = updateBlogPost(id, sanitizedData)

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Log action
    await createLog(
      payload.userId,
      'BLOG_POST_UPDATED',
      'blog_post',
      id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    })
  } catch (error: any) {
    log.error('Error updating blog post:', error)
    
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

/**
 * DELETE /api/admin/blog/[id]
 * Delete a blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate CSRF token
    if (!validateCsrfToken(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    // Verify authentication and authorization (only admins can delete)
    const authResult = await authorizeRequest(request, 'blog:delete')
    if (!authResult.authorized) {
      return authResult.response!
    }
    const payload = authResult.payload!

    const id = parseInt(params.id)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog post ID' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = getBlogPostById(id)
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Delete blog post
    const deleted = deleteBlogPost(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete blog post' },
        { status: 500 }
      )
    }

    // Log action
    await createLog(
      payload.userId,
      'BLOG_POST_DELETED',
      'blog_post',
      id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    })
  } catch (error) {
    log.error('Error deleting blog post:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

