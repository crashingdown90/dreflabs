import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { getAllMediaFiles, getMediaFileCount, getTotalStorageUsed } from '@/lib/media-db'
import { createLog } from '@/lib/admin-db'

/**
 * GET /api/admin/media
 * Get all media files with optional filters
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
    const mimeType = searchParams.get('mime_type') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get media files
    const files = getAllMediaFiles({
      mime_type: mimeType,
      search,
      limit,
      offset,
    })

    // Get total count
    const total = getMediaFileCount({ mime_type: mimeType, search })

    // Get total storage used
    const totalStorage = getTotalStorageUsed()

    // Log action
    await createLog(
      payload.userId,
      'MEDIA_LIST_VIEWED',
      'media_file',
      undefined,
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      data: {
        files,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          totalFiles: total,
          totalStorage,
          totalStorageMB: (totalStorage / (1024 * 1024)).toFixed(2),
        },
      },
    })
  } catch (error) {
    log.error('Error fetching media files:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

