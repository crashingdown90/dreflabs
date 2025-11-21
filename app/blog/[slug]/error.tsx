'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { FileQuestion, RefreshCw, ArrowLeft } from 'lucide-react'

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog post error:', error)
  }, [error])

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card className="p-8 md:p-12 text-center">
          <CardContent className="p-0">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="text-yellow-400" size={40} />
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Blog Post Not Found
            </h1>

            <p className="text-gray-400 text-lg mb-8">
              The blog post you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <ArrowLeft size={18} />
                  Back to Blog
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
