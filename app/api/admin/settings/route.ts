import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'
import { verifyAuth } from '@/lib/auth'
import { getAllSettings, getGroupedSettings, updateMultipleSettings, UpdateSettingInput } from '@/lib/settings-db'
import { createLog } from '@/lib/admin-db'
import { sanitizeText, sanitizeUrl, sanitizeEmail, validateCsrfToken } from '@/lib/security'

/**
 * GET /api/admin/settings
 * Get all site settings
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

    // Get query parameter for format
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'grouped' // 'grouped' or 'flat'

    let data: any

    if (format === 'flat') {
      data = getAllSettings()
    } else {
      data = getGroupedSettings()
    }

    // Log action
    await createLog(
      payload.userId,
      'SETTINGS_VIEWED',
      'site_settings',
      undefined,
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    log.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/settings
 * Update multiple settings
 */
export async function PUT(request: NextRequest) {
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

    if (!body.settings || !Array.isArray(body.settings)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body. Expected { settings: [...] }' },
        { status: 400 }
      )
    }

    // Validate and sanitize settings
    const settings: UpdateSettingInput[] = []
    for (const setting of body.settings) {
      if (!setting.setting_key) {
        return NextResponse.json(
          { success: false, message: 'Each setting must have a setting_key' },
          { status: 400 }
        )
      }

      // Sanitize setting value based on key type
      let sanitizedValue = setting.setting_value !== undefined ? String(setting.setting_value) : ''

      // Apply appropriate sanitization based on setting key
      if (setting.setting_key.includes('email')) {
        try {
          sanitizedValue = sanitizeEmail(sanitizedValue)
        } catch (error) {
          return NextResponse.json(
            { success: false, message: `Invalid email format for ${setting.setting_key}` },
            { status: 400 }
          )
        }
      } else if (setting.setting_key.includes('url') || setting.setting_key.includes('link')) {
        if (sanitizedValue && sanitizedValue.startsWith('http')) {
          try {
            sanitizedValue = sanitizeUrl(sanitizedValue)
          } catch (error) {
            return NextResponse.json(
              { success: false, message: `Invalid URL format for ${setting.setting_key}` },
              { status: 400 }
            )
          }
        }
      } else {
        sanitizedValue = sanitizeText(sanitizedValue)
      }

      settings.push({
        setting_key: sanitizeText(setting.setting_key),
        setting_value: sanitizedValue,
        setting_type: setting.setting_type || 'string',
      })
    }

    // Update settings
    const updatedSettings = updateMultipleSettings(settings)

    // Log action
    await createLog(
      payload.userId,
      'SETTINGS_UPDATED',
      'site_settings',
      `${settings.length} settings`,
      request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      message: `${settings.length} settings updated successfully`,
      data: updatedSettings,
    })
  } catch (error) {
    log.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

