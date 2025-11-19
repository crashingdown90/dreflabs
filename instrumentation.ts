/**
 * Instrumentation file - runs once when the server starts
 * Used for environment validation and initialization
 */

import { logEnvStatus } from './lib/env'

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('\n🚀 Starting DREFLABS Application...\n')

    // Validate environment variables
    try {
      logEnvStatus()
      console.log('✅ Environment validation successful\n')
    } catch (error) {
      console.error('❌ Environment validation failed:', error)
      // In production, the app will exit if critical env vars are missing
    }
  }
}