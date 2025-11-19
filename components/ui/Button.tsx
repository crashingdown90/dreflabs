import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg'

  const variants = {
    primary:
      'bg-gradient-primary text-dark-bg hover:shadow-lg hover:shadow-white/30 hover:scale-105',
    secondary:
      'bg-dark-secondary text-white border border-dark-border hover:border-white/50 hover:shadow-lg hover:shadow-white/20',
    outline:
      'border-2 border-white text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/20',
    ghost:
      'text-gray-300 hover:text-white hover:bg-dark-secondary',
  }

  const sizes = {
    sm: 'px-4 py-3 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
