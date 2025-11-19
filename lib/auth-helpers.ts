import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from './auth'

export type UserRole = 'superadmin' | 'admin' | 'editor'

export interface AuthPayload {
  userId: number
  username: string
  email: string
  role: UserRole
}

/**
 * Permission levels for different roles
 */
const ROLE_PERMISSIONS = {
  superadmin: [
    'users:read', 'users:create', 'users:update', 'users:delete',
    'blog:read', 'blog:create', 'blog:update', 'blog:delete', 'blog:publish',
    'projects:read', 'projects:create', 'projects:update', 'projects:delete',
    'media:read', 'media:upload', 'media:delete',
    'settings:read', 'settings:update',
    'analytics:read',
    'contact:read', 'contact:delete',
  ],
  admin: [
    'users:read', 'users:update',
    'blog:read', 'blog:create', 'blog:update', 'blog:delete', 'blog:publish',
    'projects:read', 'projects:create', 'projects:update', 'projects:delete',
    'media:read', 'media:upload', 'media:delete',
    'settings:read',
    'analytics:read',
    'contact:read',
  ],
  editor: [
    'blog:read', 'blog:create', 'blog:update',
    'projects:read', 'projects:create', 'projects:update',
    'media:read', 'media:upload',
    'analytics:read',
    'contact:read',
  ],
} as const

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.includes(permission as any) : false
}

/**
 * Check if user can perform action on a resource they own
 */
export function canEditOwnResource(
  role: UserRole,
  resourceOwnerId: number,
  userId: number,
  permission: string
): boolean {
  // Superadmins and admins can edit any resource
  if (role === 'superadmin' || role === 'admin') {
    return hasPermission(role, permission)
  }

  // Editors can only edit their own resources
  if (role === 'editor') {
    return resourceOwnerId === userId && hasPermission(role, permission)
  }

  return false
}

/**
 * Authorize request with role checking
 */
export async function authorizeRequest(
  request: NextRequest,
  requiredPermission: string
): Promise<{ authorized: boolean; payload?: AuthPayload; response?: NextResponse }> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Missing authorization header' },
        { status: 401 }
      ),
    }
  }

  try {
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        ),
      }
    }

    // Check if user has required permission
    if (!hasPermission(payload.role as UserRole, requiredPermission)) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            message: 'Insufficient permissions',
            required: requiredPermission,
            userRole: payload.role
          },
          { status: 403 }
        ),
      }
    }

    return {
      authorized: true,
      payload: payload as AuthPayload,
    }
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Authorization failed' },
        { status: 401 }
      ),
    }
  }
}

/**
 * Authorize request for own resource editing
 */
export async function authorizeOwnResource(
  request: NextRequest,
  requiredPermission: string,
  resourceOwnerId: number
): Promise<{ authorized: boolean; payload?: AuthPayload; response?: NextResponse }> {
  const authResult = await authorizeRequest(request, requiredPermission)

  if (!authResult.authorized || !authResult.payload) {
    return authResult
  }

  const canEdit = canEditOwnResource(
    authResult.payload.role,
    resourceOwnerId,
    authResult.payload.userId,
    requiredPermission
  )

  if (!canEdit) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: 'You can only edit your own resources',
          userRole: authResult.payload.role
        },
        { status: 403 }
      ),
    }
  }

  return {
    authorized: true,
    payload: authResult.payload,
  }
}

/**
 * Middleware to check multiple permissions (OR logic)
 */
export async function authorizeAnyPermission(
  request: NextRequest,
  permissions: string[]
): Promise<{ authorized: boolean; payload?: AuthPayload; response?: NextResponse }> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Missing authorization header' },
        { status: 401 }
      ),
    }
  }

  try {
    const payload = await verifyAuth(authHeader, request)

    if (!payload) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        ),
      }
    }

    // Check if user has any of the required permissions
    const hasAnyPermission = permissions.some(permission =>
      hasPermission(payload.role as UserRole, permission)
    )

    if (!hasAnyPermission) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            message: 'Insufficient permissions',
            requiredOneOf: permissions,
            userRole: payload.role
          },
          { status: 403 }
        ),
      }
    }

    return {
      authorized: true,
      payload: payload as AuthPayload,
    }
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Authorization failed' },
        { status: 401 }
      ),
    }
  }
}

/**
 * Check if user is admin or superadmin
 */
export function isAdminOrHigher(role: UserRole): boolean {
  return role === 'superadmin' || role === 'admin'
}

/**
 * Check if user is superadmin
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'superadmin'
}