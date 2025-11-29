'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
  className?: string
  once?: boolean
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  once = true,
}: CountUpProps) {
  const [count, setCount] = useState(start)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once })

  useEffect(() => {
    if (!isInView || (once && hasAnimated)) return

    const startTime = Date.now() + delay * 1000
    const endTime = startTime + duration * 1000

    const animate = () => {
      const now = Date.now()

      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      if (now >= endTime) {
        setCount(end)
        setHasAnimated(true)
        return
      }

      const progress = (now - startTime) / (duration * 1000)
      const easedProgress = easeOutExpo(progress)
      const currentCount = start + (end - start) * easedProgress

      setCount(currentCount)
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, start, end, duration, delay, once, hasAnimated])

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals)
    const [integer, decimal] = fixed.split('.')
    const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return decimal ? `${formatted}.${decimal}` : formatted
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
