'use client'

import { m } from 'framer-motion'
import { useMemo } from 'react'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  staggerChildren?: number
  blur?: number
  once?: boolean
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function BlurText({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.04,
  blur = 10,
  once = true,
  direction = 'up',
}: BlurTextProps) {
  const words = useMemo(() => text.split(' '), [text])

  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 20 }
      case 'down':
        return { y: -20 }
      case 'left':
        return { x: 20 }
      case 'right':
        return { x: -20 }
      default:
        return { y: 20 }
    }
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      ...getDirectionOffset(),
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  return (
    <m.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <m.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </m.span>
      ))}
    </m.span>
  )
}
