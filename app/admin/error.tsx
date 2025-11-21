'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for monitoring
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 md:p-12">
        <CardContent className="p-0 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-400" size={40} />
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Admin Dashboard Error
          </h1>

          <p className="text-gray-400 text-lg mb-2">
            Something went wrong in the admin dashboard.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="bg-dark-tertiary border border-dark-border rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Error Details:</p>
              <p className="text-sm text-red-400 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </Button>

            <Link href="/admin">
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Home size={18} />
                Admin Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-dark-border">
            <p className="text-sm text-gray-500">
              If this problem persists, please contact the system administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
