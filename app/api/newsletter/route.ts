import { NextRequest, NextResponse } from 'next/server'
import { addSubscriber, isSubscribed } from '@/lib/newsletter-db'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      maxAttempts: 5,
      windowMs: 60000, // 1 minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = body

    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if already subscribed
    if (isSubscribed(email)) {
      return NextResponse.json({ error: 'This email is already subscribed' }, { status: 409 })
    }

    // Add subscriber
    const subscriber = addSubscriber(email)

    // TODO: Send welcome email (optional)
    // await sendWelcomeEmail(email)

    logger.info('New newsletter subscriber', { email })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Newsletter subscription error', error)

    if (error.message === 'This email is already subscribed') {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}
