import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-dark-tertiary text-gray-300 border-dark-border',
    primary: 'bg-gradient-primary text-dark-bg',
    secondary: 'bg-white/10 text-white border-white/30',
    outline: 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        'transition-all duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
