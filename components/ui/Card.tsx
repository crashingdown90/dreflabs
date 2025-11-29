import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl glass-card',
        hover && 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/10',
        glow && 'shadow-lg shadow-white/5 border-white/20',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>
}
