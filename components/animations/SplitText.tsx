'use client'

import { m } from 'framer-motion'
import { useMemo } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  staggerChildren?: number
  animation?: 'fadeUp' | 'fadeDown' | 'fadeIn' | 'scale' | 'rotate'
  once?: boolean
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
  },
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.03,
  animation = 'fadeUp',
  once = true,
}: SplitTextProps) {
  const characters = useMemo(() => text.split(''), [text])
  const selectedAnimation = animations[animation]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const characterVariants = {
    hidden: selectedAnimation.hidden,
    visible: {
      ...selectedAnimation.visible,
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  return (
    <m.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {characters.map((char, index) => (
        <m.span
          key={`${char}-${index}`}
          variants={characterVariants}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </m.span>
      ))}
    </m.span>
  )
}
