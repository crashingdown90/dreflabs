import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { createMediaFile } from '@/lib/media-db'
import { createLog } from '@/lib/admin-db'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'
import { randomBytes } from 'crypto'
import { fileTypeFromBuffer } from 'file-type'

/**
 * POST /api/admin/media/upload
 * Upload a media file
 */
export async function POST(request: NextRequest) {
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

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // SECURITY: Validate file size (max 5MB, reduced from 10MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // SECURITY: Validate filename to prevent path traversal
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return NextResponse.json(
        { success: false, message: 'Invalid filename' },
        { status: 400 }
      )
    }

    // Convert file to buffer FIRST for magic bytes validation
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file type using magic bytes (not just MIME type)
    const fileTypeResult = await fileTypeFromBuffer(buffer)

    // Define allowed MIME types based on magic bytes detection
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
      // Note: SVG removed due to XSS risk - needs special handling
    ]

    if (!fileTypeResult || !allowedMimeTypes.includes(fileTypeResult.mime)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate cryptographically secure unique filename
    const timestamp = Date.now()
    const randomString = randomBytes(16).toString('hex')
    const extension = fileTypeResult.ext // Use extension from magic bytes detection
    const filename = `${timestamp}-${randomString}.${extension}`
    const filePath = join(uploadsDir, filename)
    const fileUrl = `/uploads/${filename}`

    // Get image dimensions if it's an image
    let width: number | undefined
    let height: number | undefined

    // All validated files are images, so we can safely get dimensions
    try {
      const metadata = await sharp(buffer).metadata()
      width = metadata.width
      height = metadata.height
    } catch (error) {
      log.error('Error getting image metadata:', error)
    }

    // Write file to disk
    await writeFile(filePath, buffer)

    // Create database record using validated MIME type
    const mediaFile = createMediaFile({
      filename,
      original_name: file.name,
      file_path: filePath,
      file_url: fileUrl,
      mime_type: fileTypeResult.mime, // Use validated MIME type from magic bytes
      file_size: file.size,
      width,
      height,
      uploaded_by: payload.userId,
    })

    // Log action
    await createLog(
      payload.userId,
      'MEDIA_FILE_UPLOADED',
      'media_file',
      mediaFile.id.toString(),
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: mediaFile,
    }, { status: 201 })
  } catch (error) {
    log.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Disable body parser for file uploads (Next.js 14 App Router)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

