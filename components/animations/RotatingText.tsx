'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'

interface RotatingTextProps {
  texts: string[]
  className?: string
  duration?: number
  animation?: 'slide' | 'fade' | 'scale' | 'blur'
}

const animations = {
  slide: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
  blur: {
    initial: { filter: 'blur(10px)', opacity: 0 },
    animate: { filter: 'blur(0px)', opacity: 1 },
    exit: { filter: 'blur(10px)', opacity: 0 },
  },
}

export default function RotatingText({
  texts,
  className = '',
  duration = 3000,
  animation = 'slide',
}: RotatingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, duration)

    return () => clearInterval(interval)
  }, [texts.length, duration])

  const currentAnimation = animations[animation]

  return (
    <span className={`inline-block relative ${className}`}>
      <AnimatePresence mode="wait">
        <m.span
          key={index}
          initial={currentAnimation.initial}
          animate={currentAnimation.animate}
          exit={currentAnimation.exit}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="inline-block"
        >
          {texts[index]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
