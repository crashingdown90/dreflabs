import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { getMediaFileById, deleteMediaFile } from '@/lib/media-db'
import { createLog } from '@/lib/admin-db'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'

/**
 * GET /api/admin/media/[id]
 * Get a single media file by ID
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
        { success: false, message: 'Invalid media file ID' },
        { status: 400 }
      )
    }

    const mediaFile = getMediaFileById(id)

    if (!mediaFile) {
      return NextResponse.json(
        { success: false, message: 'Media file not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mediaFile,
    })
  } catch (error) {
    log.error('Error fetching media file:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/media/[id]
 * Delete a media file
 */
export async function DELETE(
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
        { success: false, message: 'Invalid media file ID' },
        { status: 400 }
      )
    }

    // Get media file
    const mediaFile = getMediaFileById(id)
    if (!mediaFile) {
      return NextResponse.json(
        { success: false, message: 'Media file not found' },
        { status: 404 }
      )
    }

    // Delete physical file
    if (existsSync(mediaFile.file_path)) {
      try {
        await unlink(mediaFile.file_path)
      } catch (error) {
        log.error('Error deleting physical file:', error)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete database record
    const deleted = deleteMediaFile(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete media file' },
        { status: 500 }
      )
    }

    // Log action
    await createLog(
      payload.userId,
      'MEDIA_FILE_DELETED',
      'media_file',
      id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Media file deleted successfully',
    })
  } catch (error) {
    log.error('Error deleting media file:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

