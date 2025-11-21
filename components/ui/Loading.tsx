import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  fullScreen?: boolean
}

/**
 * Loading spinner component with optional text
 * @param size - Size of the spinner (sm: 16px, md: 24px, lg: 32px)
 * @param text - Optional loading text to display
 * @param className - Additional CSS classes
 * @param fullScreen - Whether to display as full-screen overlay
 */
export default function Loading({
  size = 'md',
  text,
  className,
  fullScreen = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const spinnerSize = {
    sm: 16,
    md: 24,
    lg: 32,
  }

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen ? 'min-h-screen' : 'py-12',
      className
    )}>
      <Loader2
        size={spinnerSize[size]}
        className={cn(
          sizeClasses[size],
          'animate-spin text-white/60'
        )}
      />
      {text && (
        <p className="text-gray-400 text-sm animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-bg/95 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

/**
 * Skeleton loading component for content placeholders
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-dark-secondary/50 rounded-lg',
        className
      )}
    />
  )
}

/**
 * Card skeleton for list views
 */
export function CardSkeleton() {
  return (
    <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
