'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { FileX, RefreshCw, ArrowLeft } from 'lucide-react'

export default function BlogAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin blog error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card className="p-8 md:p-12 text-center">
          <CardContent className="p-0">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto mb-6">
              <FileX className="text-red-400" size={40} />
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Blog Management Error
            </h1>

            <p className="text-gray-400 text-lg mb-8">
              Unable to load blog management interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin">
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <ArrowLeft size={18} />
                  Back to Dashboard
                </Button>
              </Link>

              <Button
                onClick={reset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
