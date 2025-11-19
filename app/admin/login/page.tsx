'use client'

import { useState, useEffect, FormEvent, Suspense } from 'react'
import { log } from '@/lib/logger'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import RobotWolfLogo from '@/components/ui/RobotWolfLogo'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [csrfToken, setCsrfToken] = useState('')

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/auth/csrf')
        const data = await response.json()
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken)
        }
      } catch (error) {
        log.error('Failed to fetch CSRF token:', error)
      }
    }
    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken, // Include CSRF token in header
        },
        body: JSON.stringify({
          username,
          password,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to admin dashboard or intended page
        router.push(redirect)
        router.refresh()
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      log.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-dark-secondary/50 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-6">
              <RobotWolfLogo size="lg" />
            </Link>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={cn(
                    'w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg',
                    'text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30',
                    'transition-all duration-200'
                  )}
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn(
                    'w-full pl-10 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg',
                    'text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30',
                    'transition-all duration-200'
                  )}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={cn(
                  'w-4 h-4 rounded border-dark-border bg-dark-bg',
                  'text-white focus:ring-2 focus:ring-white/20',
                  'cursor-pointer'
                )}
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            This is a secure area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
