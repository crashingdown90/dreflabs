import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { getProjectById, updateProject, deleteProject } from '@/lib/projects-db'
import { createLog } from '@/lib/admin-db'
import { sanitizeHtml, sanitizeText, sanitizeUrl, validateCsrfToken } from '@/lib/security'

/**
 * GET /api/admin/projects/[id]
 * Get a single project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = getProjectById(id)

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    log.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update a project
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

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Sanitize inputs to prevent XSS attacks
    const sanitizedData: any = {}
    if (body.slug !== undefined) sanitizedData.slug = sanitizeText(body.slug)
    if (body.title !== undefined) sanitizedData.title = sanitizeText(body.title)
    if (body.description !== undefined) sanitizedData.description = sanitizeHtml(body.description)
    if (body.category !== undefined) sanitizedData.category = sanitizeText(body.category)
    if (body.technologies !== undefined) {
      sanitizedData.technologies = Array.isArray(body.technologies)
        ? body.technologies.map((tech: string) => sanitizeText(tech))
        : []
    }
    if (body.image !== undefined) {
      sanitizedData.image = body.image
        ? (body.image.startsWith('http') ? sanitizeUrl(body.image) : body.image)
        : undefined
    }
    if (body.link !== undefined) {
      sanitizedData.link = body.link ? sanitizeUrl(body.link) : undefined
    }
    if (body.github !== undefined) {
      sanitizedData.github = body.github ? sanitizeUrl(body.github) : undefined
    }
    if (body.status !== undefined) {
      sanitizedData.status = ['active', 'completed', 'archived', 'in_progress'].includes(body.status)
        ? body.status
        : 'active'
    }

    // Update project
    const project = updateProject(id, sanitizedData)

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Log action
    await createLog(
      payload.userId,
      'PROJECT_UPDATED',
      'project',
      id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    })
  } catch (error: any) {
    log.error('Error updating project:', error)
    
    // Handle unique constraint violation (duplicate slug)
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, message: 'A project with this slug already exists' },
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
 * DELETE /api/admin/projects/[id]
 * Delete a project
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

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Check if project exists
    const project = getProjectById(id)
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete project
    const deleted = deleteProject(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete project' },
        { status: 500 }
      )
    }

    // Log action
    await createLog(
      payload.userId,
      'PROJECT_DELETED',
      'project',
      id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    log.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

