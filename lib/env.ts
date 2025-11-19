/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

// Simple console logging to avoid loading Winston in edge runtime
const envLog = {
  info: (message: string) => console.log(message),
  warn: (message: string) => console.warn(message),
  error: (message: string) => console.error(message)
}

interface EnvConfig {
  // Database
  DATABASE_PATH: string

  // Admin Authentication
  JWT_SECRET: string
  REFRESH_TOKEN_SECRET: string
  INITIAL_ADMIN_USERNAME?: string
  INITIAL_ADMIN_PASSWORD?: string
  INITIAL_ADMIN_EMAIL?: string

  // Site Configuration
  NEXT_PUBLIC_SITE_URL?: string
  NEXT_PUBLIC_SITE_NAME?: string

  // Node Environment
  NODE_ENV: 'development' | 'production' | 'test'
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

/**
 * Validates that a required environment variable exists and is not empty
 */
function validateRequired(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new EnvironmentError(`Missing required environment variable: ${key}`)
  }
  return value
}

/**
 * Validates that a secret key meets minimum security requirements
 */
function validateSecret(key: string, value: string | undefined): string {
  const secret = validateRequired(key, value)

  // SECURITY: Increased minimum secret length from 32 to 64 characters
  if (secret.length < 64) {
    throw new EnvironmentError(
      `${key} must be at least 64 characters long for security. Current length: ${secret.length}`
    )
  }

  // Warn if using default/example values in production
  if (process.env.NODE_ENV === 'production') {
    const insecurePatterns = [
      'your-secret-key',
      'change-in-production',
      'changeme',
      'example',
      'default',
      'test'
    ]

    const lowerSecret = secret.toLowerCase()
    for (const pattern of insecurePatterns) {
      if (lowerSecret.includes(pattern)) {
        throw new EnvironmentError(
          `${key} contains insecure pattern "${pattern}". Please use a secure random value in production.`
        )
      }
    }
  }

  return secret
}

/**
 * Validates and returns environment configuration
 */
export function validateEnv(): EnvConfig {
  const env = process.env
  const isProduction = env.NODE_ENV === 'production'

  try {
    const config: EnvConfig = {
      // Database
      DATABASE_PATH: validateRequired('DATABASE_PATH', env.DATABASE_PATH),

      // Admin Authentication - Critical in production
      JWT_SECRET: isProduction
        ? validateSecret('JWT_SECRET', env.JWT_SECRET)
        : env.JWT_SECRET || 'dev-only-jwt-secret-min-64-characters-long-for-development-only-use',

      REFRESH_TOKEN_SECRET: isProduction
        ? validateSecret('REFRESH_TOKEN_SECRET', env.REFRESH_TOKEN_SECRET)
        : env.REFRESH_TOKEN_SECRET || 'dev-only-refresh-secret-min-64-characters-long-for-development-use',

      // Optional admin credentials (for initial setup)
      INITIAL_ADMIN_USERNAME: env.INITIAL_ADMIN_USERNAME,
      INITIAL_ADMIN_PASSWORD: env.INITIAL_ADMIN_PASSWORD,
      INITIAL_ADMIN_EMAIL: env.INITIAL_ADMIN_EMAIL,

      // Site Configuration
      NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SITE_NAME: env.NEXT_PUBLIC_SITE_NAME || 'Dref Labs',

      // Node Environment
      NODE_ENV: (env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development'
    }

    // Additional production validations
    if (isProduction) {
      // Ensure site URL is set in production
      if (!config.NEXT_PUBLIC_SITE_URL) {
        envLog.warn('WARNING: NEXT_PUBLIC_SITE_URL is not set in production')
      }

      // Warn about initial admin credentials in production
      if (config.INITIAL_ADMIN_PASSWORD === 'changeme123') {
        envLog.warn(
          'WARNING: Using default admin password in production! Change it immediately after first login.'
        )
      }
    }

    return config
  } catch (error) {
    if (error instanceof EnvironmentError) {
      envLog.error('\n🔴 Environment Configuration Error:')
      envLog.error(error.message)
      envLog.error('\nPlease check your .env.local file and ensure all required variables are set.')

      if (isProduction) {
        envLog.error('\n⚠️  CRITICAL: Application cannot start in production with missing/invalid environment variables.')
        process.exit(1)
      } else {
        envLog.error('\n⚠️  WARNING: Running in development mode with missing environment variables.')
      }
    }
    throw error
  }
}

/**
 * Validated environment configuration singleton
 */
let _env: EnvConfig | null = null

export function getEnv(): EnvConfig {
  if (!_env) {
    _env = validateEnv()
  }
  return _env
}

/**
 * Log environment status (without exposing secrets)
 */
export function logEnvStatus(): void {
  const env = getEnv()

  envLog.info('\n📋 Environment Configuration Status:')
  envLog.info('────────────────────────────────────')
  envLog.info(`✅ NODE_ENV: ${env.NODE_ENV}`)
  envLog.info(`✅ DATABASE_PATH: ${env.DATABASE_PATH}`)
  envLog.info(`✅ JWT_SECRET: [SET - ${env.JWT_SECRET.length} chars]`)
  envLog.info(`✅ REFRESH_TOKEN_SECRET: [SET - ${env.REFRESH_TOKEN_SECRET.length} chars]`)

  if (env.NEXT_PUBLIC_SITE_URL) {
    envLog.info(`✅ SITE_URL: ${env.NEXT_PUBLIC_SITE_URL}`)
  } else {
    envLog.info(`⚠️  SITE_URL: Not set`)
  }

  envLog.info('────────────────────────────────────\n')
}