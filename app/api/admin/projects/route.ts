import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { getAllProjects, createProject, getProjectCount, getProjectCategories } from '@/lib/projects-db'
import { createLog } from '@/lib/admin-db'
import { sanitizeHtml, sanitizeText, sanitizeUrl, validateCsrfToken } from '@/lib/security'

/**
 * GET /api/admin/projects
 * Get all projects with optional filters
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get projects
    const projects = getAllProjects({
      status,
      category,
      search,
      limit,
      offset,
    })

    // Get total count
    const total = getProjectCount({ status, category, search })

    // Get categories
    const categories = getProjectCategories()

    // Log action
    await createLog(
      payload.userId,
      'PROJECTS_LIST_VIEWED',
      'project',
      undefined,
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      data: {
        projects,
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
    log.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/projects
 * Create a new project
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

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.slug || !body.category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: title, description, slug, category' },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS attacks
    const sanitizedData = {
      slug: sanitizeText(body.slug),
      title: sanitizeText(body.title),
      description: sanitizeHtml(body.description), // Allow some HTML but sanitize
      category: sanitizeText(body.category),
      technologies: Array.isArray(body.technologies) ? body.technologies.map((tech: string) => sanitizeText(tech)) : [],
      image: body.image ? (body.image.startsWith('http') ? sanitizeUrl(body.image) : body.image) : undefined,
      link: body.link ? sanitizeUrl(body.link) : undefined,
      github: body.github ? sanitizeUrl(body.github) : undefined,
      status: ['active', 'completed', 'archived', 'in_progress'].includes(body.status) ? body.status : 'active',
    }

    // Create project
    const project = createProject(sanitizedData)

    // Log action
    await createLog(
      payload.userId,
      'PROJECT_CREATED',
      'project',
      project.id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: project,
    }, { status: 201 })
  } catch (error: any) {
    log.error('Error creating project:', error)
    
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

