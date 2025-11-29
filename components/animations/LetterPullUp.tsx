'use client'

import { m } from 'framer-motion'
import { useMemo } from 'react'

interface LetterPullUpProps {
  text: string
  className?: string
  delay?: number
  staggerChildren?: number
  once?: boolean
}

export default function LetterPullUp({
  text,
  className = '',
  delay = 0,
  staggerChildren = 0.05,
  once = true,
}: LetterPullUpProps) {
  const letters = useMemo(() => text.split(''), [text])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const letterVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  }

  return (
    <m.span
      className={`inline-flex overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {letters.map((letter, index) => (
        <m.span
          key={`${letter}-${index}`}
          variants={letterVariants}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </m.span>
      ))}
    </m.span>
  )
}
