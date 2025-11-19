export interface AdminUser {
  id: number
  username: string
  email: string
  password_hash: string
  role: 'superadmin' | 'admin' | 'editor'
  is_active: number
  created_at: string
  updated_at: string
}

export interface AdminSession {
  id: number
  admin_id: number
  refresh_token: string
  expires_at: string
  created_at: string
}

export interface AdminLog {
  id: number
  admin_id: number | null
  action: string
  resource_type?: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface RateLimit {
  id: number
  identifier: string
  attempt_count: number
  first_attempt_at: string
  last_attempt_at: string
  blocked_until?: string
}

export interface JWTPayload {
  userId: number
  username: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export interface AuthResponse {
  success: boolean
  message?: string
  accessToken?: string
  refreshToken?: string
  user?: {
    id: number
    username: string
    email: string
    role: string
  }
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RefreshTokenRequest {
  refreshToken: string
}
