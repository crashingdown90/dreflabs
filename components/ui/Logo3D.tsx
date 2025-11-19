'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Logo3DProps {
  className?: string
}

export default function Logo3D({ className }: Logo3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn('relative inline-flex items-center gap-3', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Geometric Icon */}
      <div className="relative w-10 h-10 md:w-12 md:h-12">
        {/* Outer rotating hexagon */}
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-700 ease-out',
            isHovered ? 'rotate-180 scale-110' : 'rotate-0'
          )}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' }}
          >
            {/* Outer hexagon with 3D effect */}
            <defs>
              <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#C0C0C0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#808080" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0E0E0" />
                <stop offset="100%" stopColor="#A0A0A0" />
              </linearGradient>
            </defs>

            {/* Outer hexagon frame */}
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="url(#hexGradient)"
              strokeWidth="2.5"
              className="animate-pulse-slow"
            />

            {/* Middle layer hexagon */}
            <polygon
              points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
              fill="none"
              stroke="url(#hexGradient)"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Center cube/diamond with rotation */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500',
            isHovered ? 'scale-125 rotate-45' : 'scale-100 rotate-0'
          )}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-5 h-5 md:w-6 md:h-6 relative">
            {/* 3D cube effect with multiple layers */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-white via-metallic-silver to-metallic-dark-silver rounded-sm"
              style={{
                transform: 'translateZ(2px)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-metallic-chrome to-primary rounded-sm opacity-80"
              style={{
                transform: 'translateZ(1px) translateX(1px) translateY(1px)',
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary to-dark-bg rounded-sm opacity-60"
              style={{
                transform: 'translateZ(0px) translateX(2px) translateY(2px)',
              }}
            />
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-1 h-1 bg-white rounded-full',
                isHovered ? 'animate-particle' : 'opacity-0'
              )}
              style={{
                top: `${30 + i * 20}%`,
                left: `${20 + i * 30}%`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Text Logo with 3D effect */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading font-bold text-xl md:text-2xl transition-all duration-500',
            'bg-gradient-to-r from-white via-metallic-chrome to-metallic-silver bg-clip-text text-transparent',
            isHovered && 'tracking-wider'
          )}
          style={{
            textShadow: isHovered
              ? '2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.5)'
              : '1px 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          DREF
        </span>
        <span
          className={cn(
            'font-heading font-medium text-xs md:text-sm transition-all duration-500',
            'text-gray-400',
            isHovered && 'text-white tracking-widest'
          )}
          style={{
            textShadow: isHovered ? '0 0 8px rgba(255, 255, 255, 0.4)' : 'none',
          }}
        >
          LABS
        </span>
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <div
          className="absolute -inset-2 bg-white/5 rounded-lg blur-xl -z-10 animate-pulse"
          style={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
          }}
        />
      )}
    </div>
  )
}
