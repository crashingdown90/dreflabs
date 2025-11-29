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
      'bg-gradient-to-r from-gray-200 via-white to-gray-400 text-dark-bg hover:from-accent-blue hover:to-accent-cyan hover:text-white hover:shadow-lg hover:shadow-accent-blue/20 hover:scale-105 active:scale-95 border border-transparent',
    secondary:
      'bg-dark-secondary text-white border border-white/20 hover:border-white/50 hover:shadow-lg hover:shadow-white/10 hover:bg-white/5',
    outline:
      'border border-white/30 text-white hover:bg-white/10 hover:border-white/60 hover:shadow-lg hover:shadow-white/10',
    ghost:
      'text-gray-400 hover:text-white hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
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
