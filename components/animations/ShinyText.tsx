'use client'

import { CSSProperties } from 'react'

interface ShinyTextProps {
  text: string
  className?: string
  shimmerWidth?: number
  duration?: number
  color?: string
  shimmerColor?: string
}

export default function ShinyText({
  text,
  className = '',
  shimmerWidth = 100,
  duration = 3,
  color = '#a1a1aa',
  shimmerColor = '#ffffff',
}: ShinyTextProps) {
  const style: CSSProperties = {
    '--shimmer-width': `${shimmerWidth}px`,
    '--duration': `${duration}s`,
    '--color': color,
    '--shimmer-color': shimmerColor,
    backgroundImage: `linear-gradient(
      90deg,
      var(--color) 0%,
      var(--shimmer-color) 50%,
      var(--color) 100%
    )`,
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    animation: `shimmer var(--duration) linear infinite`,
  } as CSSProperties

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
      <span className={className} style={style}>
        {text}
      </span>
    </>
  )
}
