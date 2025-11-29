'use client'

import { CSSProperties, useMemo } from 'react'

interface AuroraProps {
  className?: string
  colors?: string[]
  speed?: number
  blur?: number
  opacity?: number
}

export default function Aurora({
  className = '',
  colors = ['#00E5FF', '#007AFF', '#C0C0C0', '#E0E0E0'],
  speed = 10,
  blur = 100,
  opacity = 0.3,
}: AuroraProps) {
  const gradients = useMemo(() => {
    return colors.map((color, index) => {
      const angle = (360 / colors.length) * index
      const delay = (speed / colors.length) * index
      return {
        color,
        angle,
        delay,
      }
    })
  }, [colors, speed])

  const containerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  }

  const auroraStyle: CSSProperties = {
    position: 'absolute',
    inset: `-${blur}px`,
    filter: `blur(${blur}px)`,
    opacity,
  }

  return (
    <div className={className} style={containerStyle}>
      <style jsx global>{`
        @keyframes aurora-float {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(5%, -5%) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translate(-5%, 5%) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(-10%, -5%) rotate(270deg) scale(1.05);
          }
        }
      `}</style>
      <div style={auroraStyle}>
        {gradients.map((gradient, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${gradient.color} 0%, transparent 70%)`,
              left: `${25 + Math.cos((gradient.angle * Math.PI) / 180) * 25}%`,
              top: `${25 + Math.sin((gradient.angle * Math.PI) / 180) * 25}%`,
              animation: `aurora-float ${speed}s ease-in-out infinite`,
              animationDelay: `${gradient.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
