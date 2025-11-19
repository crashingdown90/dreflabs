/**
 * Security utilities for input sanitization, rate limiting, and CSRF protection
 */

import { randomBytes } from 'crypto'

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '')
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  
  // Remove object and embed tags
  sanitized = sanitized.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
  
  return sanitized.trim()
}

/**
 * Sanitize plain text input
 * Escapes HTML entities
 */
export function sanitizeText(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return ''
  
  // Remove any HTML tags
  let sanitized = email.replace(/<[^>]*>/g, '')
  
  // Remove whitespace
  sanitized = sanitized.trim().toLowerCase()
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format')
  }
  
  return sanitized
}

/**
 * Sanitize name (allows letters, spaces, hyphens, apostrophes)
 */
export function sanitizeName(name: string): string {
  if (!name) return ''
  
  // Remove HTML tags
  let sanitized = name.replace(/<[^>]*>/g, '')
  
  // Allow only letters, spaces, hyphens, apostrophes, and common international characters
  sanitized = sanitized.replace(/[^a-zA-Z\s\-'À-ÿ]/g, '')
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ')
  
  return sanitized.trim()
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ''
  
  // Remove whitespace
  let sanitized = url.trim()
  
  // Only allow http and https protocols
  if (!sanitized.match(/^https?:\/\//i)) {
    throw new Error('Invalid URL protocol')
  }
  
  // Remove javascript: and data: protocols
  if (sanitized.match(/^(javascript|data):/i)) {
    throw new Error('Invalid URL protocol')
  }
  
  return sanitized
}

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
  blockUntil?: number
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blocked || (entry.blockUntil && entry.blockUntil < now))) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  blockDurationMs?: number // How long to block after exceeding limit
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked?: boolean
  blockUntil?: number
}

/**
 * Check rate limit for an identifier (IP address, user ID, etc.)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  let entry = rateLimitStore.get(key)
  
  // Check if blocked
  if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      blocked: true,
      blockUntil: entry.blockUntil,
    }
  }
  
  // Reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
      blocked: false,
    }
  }
  
  // Increment count
  entry.count++
  
  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    if (config.blockDurationMs) {
      entry.blocked = true
      entry.blockUntil = now + config.blockDurationMs
    }
    
    rateLimitStore.set(key, entry)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      blocked: entry.blocked,
      blockUntil: entry.blockUntil,
    }
  }
  
  rateLimitStore.set(key, entry)
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback to a generic identifier
  return 'unknown'
}

// ============================================
// CSRF PROTECTION
// ============================================

const CSRF_TOKEN_HEADER = 'x-csrf-token'
const CSRF_TOKEN_COOKIE = 'csrf-token'

/**
 * Generate a CSRF token using crypto-secure random bytes
 */
export function generateCsrfToken(): string {
  // Generate a cryptographically secure random token
  return randomBytes(32).toString('hex')
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(request: Request): boolean {
  // Skip CSRF for GET, HEAD, OPTIONS
  const method = request.method.toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true
  }
  
  // Get token from header
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER)
  
  // Get token from cookie
  const cookieHeader = request.headers.get('cookie')
  let cookieToken: string | undefined
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const csrfCookie = cookies.find(c => c.startsWith(`${CSRF_TOKEN_COOKIE}=`))
    if (csrfCookie) {
      cookieToken = csrfCookie.split('=')[1]
    }
  }
  
  // Validate tokens match
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return false
  }
  
  return true
}

// ============================================
// SECURITY HEADERS
// ============================================

export interface SecurityHeaders {
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
  'Content-Security-Policy': string
  'Strict-Transport-Security'?: string
}

/**
 * Get security headers for API responses
 */
export function getSecurityHeaders(isProduction: boolean = false): SecurityHeaders {
  // Build Content Security Policy
  // In development, allow unsafe-inline and unsafe-eval for Next.js hot reloading
  // In production, use stricter CSP for better security
  const cspDirectives = [
    "default-src 'self'",
    isProduction
      ? "script-src 'self' https://cdn.jsdelivr.net"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net", // Allow inline scripts in dev
    isProduction
      ? "style-src 'self' https://cdn.jsdelivr.net"
      : "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net", // Allow inline styles in dev
    "img-src 'self' data: https: blob:", // Allow images from self, data URIs, https, and blob
    "font-src 'self' data:", // Allow fonts from self and data URIs
    "connect-src 'self'", // API connections only to self
    "frame-ancestors 'none'", // Prevent embedding
    "base-uri 'self'", // Prevent base tag injection
    "form-action 'self'", // Forms can only submit to self
    "object-src 'none'", // Prevent plugins
  ]

  // Only add upgrade-insecure-requests in production
  if (isProduction) {
    cspDirectives.push("upgrade-insecure-requests")
  }

  const headers: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
    'Content-Security-Policy': cspDirectives.join('; '),
  }

  // Add HSTS in production - ensure it's always added
  if (isProduction) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  }

  return headers
}

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(response: Response): Response {
  const headers = getSecurityHeaders(process.env.NODE_ENV === 'production')
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

