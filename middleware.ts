import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from './lib/auth-edge'  // Use edge-safe version
import { getSecurityHeaders } from './lib/security'

// Define protected routes
const PROTECTED_ROUTES = ['/admin']
const AUTH_ROUTES = ['/admin/login']

/**
 * Apply security headers to response
 */
function applySecurityHeadersToResponse(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders(process.env.NODE_ENV === 'production')

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value

  // If accessing a protected route
  if (isProtectedRoute && !isAuthRoute) {
    // No token found, redirect to login
    if (!accessToken) {
      const loginUrl = new URL('/admin/login', request.url)
      // SECURITY: Validate redirect URL to prevent open redirect
      if (pathname.startsWith('/admin')) {
        loginUrl.searchParams.set('redirect', pathname)
      }
      const response = NextResponse.redirect(loginUrl)
      return applySecurityHeadersToResponse(response)
    }

    // Verify token
    const payload = await verifyAccessToken(accessToken)

    // Invalid token, redirect to login
    if (!payload) {
      const loginUrl = new URL('/admin/login', request.url)
      // SECURITY: Validate redirect URL to prevent open redirect
      if (pathname.startsWith('/admin')) {
        loginUrl.searchParams.set('redirect', pathname)
      }

      const response = NextResponse.redirect(loginUrl)

      // Clear invalid cookies
      response.cookies.set('accessToken', '', { maxAge: 0 })
      response.cookies.set('refreshToken', '', { maxAge: 0 })

      return applySecurityHeadersToResponse(response)
    }

    // Token is valid, allow access
    // Add user info to request headers for use in server components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId.toString())
    requestHeaders.set('x-user-role', payload.role)
    requestHeaders.set('x-user-username', payload.username)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return applySecurityHeadersToResponse(response)
  }

  // If accessing auth routes (login) while already authenticated
  if (isAuthRoute && accessToken) {
    const payload = await verifyAccessToken(accessToken)

    // If token is valid, redirect to admin dashboard
    if (payload) {
      const response = NextResponse.redirect(new URL('/admin', request.url))
      return applySecurityHeadersToResponse(response)
    }
  }

  // Allow access to non-protected routes
  const response = NextResponse.next()
  return applySecurityHeadersToResponse(response)
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (they handle auth internally)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    '/admin/:path*',
  ],
}
