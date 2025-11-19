import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full rounded-lg border border-dark-border bg-dark-secondary px-4 py-3 text-white',
          'focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50',
          'transition-all duration-200',
          'placeholder:text-gray-500',
          error && 'border-white focus:border-white focus:ring-white/50',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-white">{error}</p>}
    </div>
  )
}

export function Textarea({
  label,
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full rounded-lg border border-dark-border bg-dark-secondary px-4 py-3 text-white',
          'focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50',
          'transition-all duration-200',
          'placeholder:text-gray-500',
          'min-h-[120px] resize-y',
          error && 'border-white focus:border-white focus:ring-white/50',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-white">{error}</p>}
    </div>
  )
}
