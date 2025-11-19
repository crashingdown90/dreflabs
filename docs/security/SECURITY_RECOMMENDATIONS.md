# 🔐 SECURITY RECOMMENDATIONS & IMPLEMENTATION GUIDE
## DrefLabs Website - Priority Security Fixes

**Date:** November 15, 2025  
**Status:** Action Required  
**Priority:** HIGH

---

## 🎯 QUICK WINS (Implement First)

### 1. Add Input Sanitization to API Endpoints

**Risk:** HIGH - XSS vulnerabilities  
**Effort:** 2-4 hours  
**Impact:** Prevents cross-site scripting attacks

**Implementation:**

```typescript
// app/api/admin/blog/route.ts
import { sanitizeHtml, sanitizeText } from '@/lib/security'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const payload = await verifyAuth(authHeader, request)
  
  if (!payload) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const body = await request.json()
  
  // ✅ ADD SANITIZATION HERE
  const sanitizedData = {
    slug: sanitizeText(body.slug),
    title: sanitizeText(body.title),
    excerpt: sanitizeText(body.excerpt || ''),
    content: sanitizeHtml(body.content), // Allow some HTML but sanitize
    category: sanitizeText(body.category),
    tags: Array.isArray(body.tags) 
      ? body.tags.map(tag => sanitizeText(tag))
      : [],
    cover_image: body.cover_image ? sanitizeUrl(body.cover_image) : null,
    read_time: parseInt(body.read_time) || 5,
    status: ['draft', 'published'].includes(body.status) ? body.status : 'draft',
    author_id: payload.userId
  }
  
  // Validate required fields
  if (!sanitizedData.title || !sanitizedData.content || !sanitizedData.slug || !sanitizedData.category) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields' },
      { status: 400 }
    )
  }
  
  const post = createBlogPost(sanitizedData)
  // ... rest of code
}
```

**Apply to all endpoints:**
- ✅ `/api/admin/blog` (POST, PUT)
- ✅ `/api/admin/projects` (POST, PUT)
- ✅ `/api/admin/settings` (PUT)
- ✅ `/api/contact` (POST)

---

### 2. Enforce CSRF Validation

**Risk:** MEDIUM - CSRF attacks  
**Effort:** 2-3 hours  
**Impact:** Prevents cross-site request forgery

**Implementation:**

```typescript
// lib/security.ts - Update validateCsrfToken function
export function validateCsrfToken(request: Request): boolean {
  const method = request.method.toUpperCase()
  
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true
  }
  
  // Get token from header
  const headerToken = request.headers.get('x-csrf-token')
  
  // Get token from cookie
  const cookieHeader = request.headers.get('cookie')
  let cookieToken: string | undefined
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const csrfCookie = cookies.find(c => c.startsWith('csrf-token='))
    if (csrfCookie) {
      cookieToken = csrfCookie.split('=')[1]
    }
  }
  
  // Validate tokens match
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    console.warn('CSRF validation failed:', { headerToken: !!headerToken, cookieToken: !!cookieToken })
    return false
  }
  
  return true
}
```

**Add to all state-changing endpoints:**

```typescript
// app/api/admin/blog/route.ts
import { validateCsrfToken } from '@/lib/security'

export async function POST(request: NextRequest) {
  // ✅ ADD CSRF VALIDATION
  if (!validateCsrfToken(request)) {
    return NextResponse.json(
      { success: false, message: 'Invalid CSRF token' },
      { status: 403 }
    )
  }
  
  // ... rest of code
}
```

**Update frontend to send CSRF token:**

```typescript
// app/admin/blog/new/page.tsx
const handleSave = async () => {
  // Get CSRF token
  const csrfResponse = await fetch('/api/csrf')
  const { token } = await csrfResponse.json()
  
  const response = await fetch('/api/admin/blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-CSRF-Token': token, // ✅ Add CSRF token
    },
    body: JSON.stringify(postData),
  })
}
```

---

### 3. Add Content Security Policy

**Risk:** MEDIUM - XSS, clickjacking  
**Effort:** 1-2 hours  
**Impact:** Additional layer of XSS protection

**Implementation:**

```typescript
// lib/security.ts
export function getSecurityHeaders(isProduction: boolean = false): SecurityHeaders {
  const headers: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    
    // ✅ ADD CSP
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
  
  if (isProduction) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  }
  
  return headers
}
```

**For stricter CSP (recommended for production):**

```typescript
// Use nonce-based CSP for better security
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'nonce-{RANDOM_NONCE}'",
  "style-src 'self' 'nonce-{RANDOM_NONCE}'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'"
].join('; ')
```

---

### 4. Update Vulnerable Dependencies

**Risk:** MEDIUM - Known vulnerabilities  
**Effort:** 1-2 hours  
**Impact:** Eliminates known security issues

**Commands:**

```bash
# Check current vulnerabilities
npm audit

# Fix automatically (may have breaking changes)
npm audit fix

# Or update individually
npm install js-yaml@latest
npm install nodemailer@latest
npm install quill@latest react-quill@latest

# Test after updates
npm run build
npm run test
```

**Vulnerabilities to fix:**
1. `js-yaml` - Prototype pollution
2. `nodemailer` - Email domain issue
3. `quill` - XSS vulnerability
4. `react-quill` - Depends on vulnerable quill

---

### 5. Improve Error Handling

**Risk:** LOW - Information disclosure  
**Effort:** 2-3 hours  
**Impact:** Prevents leaking sensitive information

**Implementation:**

```typescript
// lib/error-handler.ts (NEW FILE)
export interface ApiError {
  success: false
  message: string
  code?: string
}

export function handleApiError(error: any, isDevelopment: boolean = false): ApiError {
  // Log full error server-side
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })
  
  // Return sanitized error to client
  if (isDevelopment) {
    return {
      success: false,
      message: error.message,
      code: error.code
    }
  }
  
  // Production: Generic error messages
  const errorMessages: Record<string, string> = {
    'SQLITE_CONSTRAINT': 'A record with this information already exists',
    'SQLITE_ERROR': 'Database error occurred',
    'ENOENT': 'Resource not found',
    'EACCES': 'Permission denied'
  }
  
  return {
    success: false,
    message: errorMessages[error.code] || 'An error occurred. Please try again later.'
  }
}
```

**Usage:**

```typescript
// app/api/admin/blog/route.ts
import { handleApiError } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    // ... your code
  } catch (error: any) {
    const apiError = handleApiError(error, process.env.NODE_ENV === 'development')
    return NextResponse.json(apiError, { status: 500 })
  }
}
```

---

## 🔧 MEDIUM PRIORITY FIXES

### 6. Add Account Lockout

**Implementation:**

```typescript
// lib/admin-db.ts
export function shouldLockAccount(identifier: string): boolean {
  const rateLimit = getRateLimit(identifier)
  
  if (!rateLimit) return false
  
  // Lock after 5 failed attempts within 15 minutes
  const fifteenMinutesAgo = new Date()
  fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)
  
  const firstAttempt = new Date(rateLimit.first_attempt_at)
  
  return rateLimit.attempt_count >= 5 && firstAttempt > fifteenMinutesAgo
}

export function lockAccount(username: string, durationMinutes: number = 30): boolean {
  const db = getDb()
  const lockedUntil = new Date()
  lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes)
  
  const stmt = db.prepare(`
    UPDATE admin_users
    SET is_active = 0, locked_until = ?
    WHERE username = ?
  `)
  
  const result = stmt.run(lockedUntil.toISOString(), username)
  return result.changes > 0
}
```

---

### 7. Add Security Logging

**Implementation:**

```typescript
// lib/security-logger.ts (NEW FILE)
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_BLOCKED = 'LOGIN_BLOCKED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  CSRF_VIOLATION = 'CSRF_VIOLATION',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS'
}

export function logSecurityEvent(
  eventType: SecurityEventType,
  details: {
    userId?: number
    username?: string
    ip?: string
    userAgent?: string
    resource?: string
    additionalInfo?: any
  }
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: eventType,
    ...details
  }
  
  // Log to console (in production, send to logging service)
  console.warn('SECURITY EVENT:', logEntry)
  
  // Store in database
  createLog(
    details.userId || null,
    eventType,
    'security',
    details.resource || null,
    details.ip || 'unknown',
    details.userAgent
  )
  
  // In production: Send to SIEM/monitoring service
  // sendToMonitoring(logEntry)
}
```

---

### 8. Database Security Hardening

**File Permissions:**

```bash
# Restrict database file access
chmod 600 data/dreflabs.db
chown www-data:www-data data/dreflabs.db  # Adjust user as needed

# Restrict directory access
chmod 700 data/
```

**Backup Strategy:**

```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="data/dreflabs.db"
BACKUP_FILE="$BACKUP_DIR/dreflabs_$TIMESTAMP.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
sqlite3 $DB_FILE ".backup $BACKUP_FILE"

# Compress backup
gzip $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "dreflabs_*.db.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_FILE.gz"
```

**Add to crontab:**

```bash
# Run daily at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh
```

---

## 🚀 PRODUCTION DEPLOYMENT CHECKLIST

### Environment Variables

```bash
# .env.production
NODE_ENV=production
JWT_SECRET=<STRONG_RANDOM_SECRET_64_CHARS>
REFRESH_TOKEN_SECRET=<DIFFERENT_STRONG_SECRET_64_CHARS>
DATABASE_URL=postgresql://user:pass@host:5432/dreflabs  # Migrate from SQLite
REDIS_URL=redis://localhost:6379  # For rate limiting
```

### Security Headers (Production)

```typescript
// Enable all security headers in production
if (process.env.NODE_ENV === 'production') {
  headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  headers['Content-Security-Policy'] = strictCSP
  headers['X-Frame-Options'] = 'DENY'
}
```

### HTTPS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name dreflabs.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name dreflabs.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 TESTING & VALIDATION

### Security Testing Checklist

```bash
# 1. Run security audit
npm run security:audit

# 2. Check dependencies
npm audit

# 3. Run automated tests
npm test

# 4. Manual testing
# - Test login with invalid credentials (should block after 5 attempts)
# - Test XSS in blog post creation
# - Test SQL injection in search
# - Test CSRF protection
# - Verify security headers

# 5. Performance testing
npm run build
npm run start
# Load test with tools like Apache Bench or k6
```

### Penetration Testing

Consider hiring professional penetration testers to:
- Test for authentication bypass
- Attempt privilege escalation
- Test for business logic flaws
- Verify all OWASP Top 10 protections

---

## 📈 MONITORING & MAINTENANCE

### Security Monitoring

```typescript
// Implement security monitoring
// - Failed login attempts
// - Rate limit violations
// - CSRF violations
// - Unusual API access patterns
// - Database query anomalies

// Send alerts for:
// - Multiple failed logins from same IP
// - Account lockouts
// - Suspicious API activity
// - Database errors
```

### Regular Security Tasks

**Weekly:**
- Review security logs
- Check for failed login attempts
- Monitor rate limiting effectiveness

**Monthly:**
- Run `npm audit` and update dependencies
- Review and rotate JWT secrets
- Check database backups
- Review access logs

**Quarterly:**
- Full security audit
- Penetration testing
- Review and update security policies
- Update security documentation

---

## 🎓 SECURITY BEST PRACTICES

### Code Review Checklist

- [ ] All user inputs are validated and sanitized
- [ ] All database queries use parameterized statements
- [ ] Authentication is required for sensitive endpoints
- [ ] CSRF tokens are validated for state-changing operations
- [ ] Error messages don't leak sensitive information
- [ ] Passwords are hashed with bcrypt (10+ rounds)
- [ ] JWT tokens have appropriate expiration times
- [ ] Security headers are present on all responses
- [ ] Rate limiting is enforced on authentication endpoints
- [ ] Logging captures security-relevant events

### Development Guidelines

1. **Never trust user input** - Always validate and sanitize
2. **Use parameterized queries** - Prevent SQL injection
3. **Hash passwords** - Never store plain text
4. **Use HTTPS** - Encrypt data in transit
5. **Implement rate limiting** - Prevent brute force
6. **Log security events** - Enable incident response
7. **Keep dependencies updated** - Patch known vulnerabilities
8. **Follow principle of least privilege** - Minimize access rights
9. **Implement defense in depth** - Multiple layers of security
10. **Test security regularly** - Continuous validation

---

**Document Version:** 1.0  
**Last Updated:** November 15, 2025  
**Next Review:** December 15, 2025

