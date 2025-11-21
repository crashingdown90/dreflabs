'use client'

import { useState, FormEvent } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface NewsletterFormProps {
  variant?: 'inline' | 'card'
  className?: string
}

export default function NewsletterForm({ variant = 'inline', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setMessage('Successfully subscribed! Check your email for confirmation.')
      setEmail('')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  if (variant === 'card') {
    return (
      <div className={`p-8 rounded-xl border border-dark-border bg-dark-secondary/30 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Mail className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-white">Subscribe to Newsletter</h3>
            <p className="text-sm text-gray-400">Get the latest insights delivered to your inbox</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full"
          >
            {status === 'loading' && (
              <>
                <Loader2 className="animate-spin" size={18} />
                Subscribing...
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle size={18} />
                Subscribed!
              </>
            )}
            {(status === 'idle' || status === 'error') && (
              <>
                <Mail size={18} />
                Subscribe
              </>
            )}
          </Button>

          {message && (
            <div
              className={`text-sm p-3 rounded-lg ${
                status === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message}
            </div>
          )}
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By subscribing, you agree to receive email updates. You can unsubscribe at any time.
        </p>
      </div>
    )
  }

  // Inline variant (for footer)
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-2.5 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            required
          />
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="whitespace-nowrap"
          >
            {status === 'loading' && (
              <>
                <Loader2 className="animate-spin" size={16} />
                Subscribing...
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle size={16} />
                Subscribed!
              </>
            )}
            {(status === 'idle' || status === 'error') && 'Subscribe'}
          </Button>
        </div>

        {message && (
          <div
            className={`text-xs p-2 rounded ${
              status === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
