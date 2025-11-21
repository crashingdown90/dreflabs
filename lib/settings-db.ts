import { getDb } from './db'
import { log } from '@/lib/logger'

export interface SiteSetting {
  id: number
  setting_key: string
  setting_value: string | null
  setting_type: 'string' | 'boolean' | 'number' | 'json'
  updated_at: string
}

export interface UpdateSettingInput {
  setting_key: string
  setting_value: string
  setting_type?: 'string' | 'boolean' | 'number' | 'json'
}

/**
 * Get all site settings
 */
export function getAllSettings(): SiteSetting[] {
  const db = getDb()
  return db.prepare('SELECT * FROM site_settings ORDER BY setting_key').all() as SiteSetting[]
}

/**
 * Get a single setting by key
 */
export function getSettingByKey(key: string): SiteSetting | null {
  const db = getDb()
  return db.prepare('SELECT * FROM site_settings WHERE setting_key = ?').get(key) as SiteSetting | null
}

/**
 * Get settings as key-value object
 */
export function getSettingsObject(): Record<string, any> {
  const settings = getAllSettings()
  const result: Record<string, any> = {}

  for (const setting of settings) {
    let value: any = setting.setting_value

    // Parse value based on type
    if (setting.setting_type === 'boolean') {
      value = setting.setting_value === 'true'
    } else if (setting.setting_type === 'number') {
      value = setting.setting_value ? parseFloat(setting.setting_value) : null
    } else if (setting.setting_type === 'json') {
      try {
        value = setting.setting_value ? JSON.parse(setting.setting_value) : null
      } catch (error) {
        log.error(`Error parsing JSON for setting ${setting.setting_key}:`, error)
        value = null
      }
    }

    result[setting.setting_key] = value
  }

  return result
}

/**
 * Update or create a setting
 */
export function upsertSetting(input: UpdateSettingInput): SiteSetting {
  const db = getDb()
  
  const now = new Date().toISOString()
  const existing = getSettingByKey(input.setting_key)

  if (existing) {
    // Update existing setting
    db.prepare(`
      UPDATE site_settings
      SET setting_value = ?, setting_type = ?, updated_at = ?
      WHERE setting_key = ?
    `).run(
      input.setting_value,
      input.setting_type || existing.setting_type,
      now,
      input.setting_key
    )
  } else {
    // Create new setting
    db.prepare(`
      INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
      VALUES (?, ?, ?, ?)
    `).run(
      input.setting_key,
      input.setting_value,
      input.setting_type || 'string',
      now
    )
  }

  return getSettingByKey(input.setting_key)!
}

/**
 * Update multiple settings at once
 */
export function updateMultipleSettings(settings: UpdateSettingInput[]): SiteSetting[] {
  const db = getDb()
  const now = new Date().toISOString()

  // Use transaction for atomic updates
  const updateMany = db.transaction((settingsToUpdate: UpdateSettingInput[]) => {
    for (const setting of settingsToUpdate) {
      const existing = getSettingByKey(setting.setting_key)

      if (existing) {
        db.prepare(`
          UPDATE site_settings
          SET setting_value = ?, setting_type = ?, updated_at = ?
          WHERE setting_key = ?
        `).run(
          setting.setting_value,
          setting.setting_type || existing.setting_type,
          now,
          setting.setting_key
        )
      } else {
        db.prepare(`
          INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
          VALUES (?, ?, ?, ?)
        `).run(
          setting.setting_key,
          setting.setting_value,
          setting.setting_type || 'string',
          now
        )
      }
    }
  })

  updateMany(settings)

  return getAllSettings()
}

/**
 * Delete a setting
 */
export function deleteSetting(key: string): boolean {
  const db = getDb()
  const result = db.prepare('DELETE FROM site_settings WHERE setting_key = ?').run(key)
  return result.changes > 0
}

/**
 * Get settings by prefix
 */
export function getSettingsByPrefix(prefix: string): SiteSetting[] {
  const db = getDb()
  return db.prepare('SELECT * FROM site_settings WHERE setting_key LIKE ? ORDER BY setting_key')
    .all(`${prefix}%`) as SiteSetting[]
}

/**
 * Get grouped settings
 */
export function getGroupedSettings(): Record<string, Record<string, any>> {
  const settings = getAllSettings()
  const grouped: Record<string, Record<string, any>> = {}

  for (const setting of settings) {
    // Extract group from key (e.g., "site_name" -> "site", "social_twitter" -> "social")
    const parts = setting.setting_key.split('_')
    const group = parts[0]
    const key = parts.slice(1).join('_')

    if (!grouped[group]) {
      grouped[group] = {}
    }

    let value: any = setting.setting_value

    // Parse value based on type
    if (setting.setting_type === 'boolean') {
      value = setting.setting_value === 'true'
    } else if (setting.setting_type === 'number') {
      value = setting.setting_value ? parseFloat(setting.setting_value) : null
    } else if (setting.setting_type === 'json') {
      try {
        value = setting.setting_value ? JSON.parse(setting.setting_value) : null
      } catch {
        value = null
      }
    }

    grouped[group][key] = value
  }

  return grouped
}

