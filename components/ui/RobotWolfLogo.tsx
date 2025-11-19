'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface RobotWolfLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function RobotWolfLogo({ size = 'xl', className }: RobotWolfLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizes = {
    sm: 'w-4 h-4',   // 16px - Favicon
    md: 'w-6 h-6',   // 24px - Mobile
    lg: 'w-9 h-9',   // 36px - Tablet
    xl: 'w-12 h-12', // 48px - Desktop
  }

  const textSizes = {
    sm: 'text-sm',   // 14px
    md: 'text-base', // 16px
    lg: 'text-lg',   // 18px
    xl: 'text-2xl',  // 24px
  }

  // Show simplified details based on size
  const showFullDetails = size === 'xl'
  const showMediumDetails = size === 'lg' || size === 'xl'
  const showBasicDetails = size !== 'sm'

  return (
    <div
      className={cn('relative inline-flex items-center gap-3 md:gap-4', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Robot Wolf Head Icon */}
      <div className={cn('relative flex-shrink-0', sizes[size])}>
        <svg
          viewBox="0 0 100 100"
          className={cn(
            'w-full h-full transition-all duration-500 ease-out',
            isHovered && 'scale-110 rotate-3'
          )}
          style={{
            filter: isHovered
              ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))'
              : 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.2))',
          }}
        >
          <defs>
            {/* Metallic gradients */}
            <linearGradient id="wolfHeadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0E0E0" />
              <stop offset="50%" stopColor="#C0C0C0" />
              <stop offset="100%" stopColor="#A0A0A0" />
            </linearGradient>

            <linearGradient id="wolfSnoutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C0C0C0" />
              <stop offset="100%" stopColor="#808080" />
            </linearGradient>

            <linearGradient id="wolfEarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#808080" />
              <stop offset="50%" stopColor="#C0C0C0" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            <linearGradient id="wolfNeckGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#808080" />
              <stop offset="100%" stopColor="#606060" />
            </linearGradient>

            {/* Eye glow filter */}
            <filter id="eyeGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense eye glow for hover */}
            <filter id="eyeGlowIntense">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Neck/Base */}
          <g id="neck">
            <path
              d="M 35 85 L 35 95 L 65 95 L 65 85 Z"
              fill="url(#wolfNeckGradient)"
              stroke="#000000"
              strokeWidth="0.5"
            />
            {showMediumDetails && (
              <>
                <line x1="35" y1="90" x2="65" y2="90" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
                <line x1="35" y1="87" x2="65" y2="87" stroke="#303030" strokeWidth="0.3" />
              </>
            )}
          </g>

          {/* Main Head/Skull - Angular geometric shape */}
          <g id="head">
            {/* Base skull shape */}
            <path
              d="M 50 15 L 70 30 L 75 50 L 70 70 L 50 80 L 30 70 L 25 50 L 30 30 Z"
              fill="url(#wolfHeadGradient)"
              stroke="#000000"
              strokeWidth="1"
            />

            {/* Cheekbone facets */}
            {showFullDetails && (
              <>
                <path d="M 30 45 L 25 50 L 30 60 L 35 55 Z" fill="#B0B0B0" stroke="#FFFFFF" strokeWidth="0.5" />
                <path d="M 70 45 L 75 50 L 70 60 L 65 55 Z" fill="#B0B0B0" stroke="#FFFFFF" strokeWidth="0.5" />
              </>
            )}

            {/* Forehead panels */}
            {showMediumDetails && (
              <>
                <path d="M 40 20 L 50 15 L 60 20 L 55 28 L 45 28 Z" fill="#D0D0D0" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.8" />
                <line x1="45" y1="25" x2="55" y2="25" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4" />
              </>
            )}
          </g>

          {/* Ears - Triangular, Alert Position */}
          <g id="ears">
            {/* Left Ear */}
            <path
              d="M 30 30 L 20 10 L 35 25 Z"
              fill="url(#wolfEarGradient)"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            {showBasicDetails && (
              <>
                <path d="M 25 20 L 22 15 L 28 22 Z" fill="#606060" stroke="#303030" strokeWidth="0.5" />
                <line x1="30" y1="30" x2="20" y2="10" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
              </>
            )}

            {/* Right Ear */}
            <path
              d="M 70 30 L 80 10 L 65 25 Z"
              fill="url(#wolfEarGradient)"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            {showBasicDetails && (
              <>
                <path d="M 75 20 L 78 15 L 72 22 Z" fill="#606060" stroke="#303030" strokeWidth="0.5" />
                <line x1="70" y1="30" x2="80" y2="10" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
              </>
            )}
          </g>

          {/* Snout/Muzzle - Angular geometric form */}
          <g id="snout">
            {/* Main snout shape */}
            <path
              d="M 50 60 L 38 70 L 40 78 L 50 82 L 60 78 L 62 70 Z"
              fill="url(#wolfSnoutGradient)"
              stroke="#000000"
              strokeWidth="1"
            />

            {/* Bridge/ridge line */}
            <line x1="50" y1="60" x2="50" y2="82" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />

            {/* Snout segments */}
            {showMediumDetails && (
              <>
                <line x1="40" y1="74" x2="60" y2="74" stroke="#303030" strokeWidth="0.5" />
                <line x1="42" y1="70" x2="58" y2="70" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.4" />
              </>
            )}

            {/* Nostrils - geometric vents */}
            {showBasicDetails && (
              <>
                <ellipse cx="45" cy="80" rx="2" ry="3" fill="#000000" />
                <ellipse cx="55" cy="80" rx="2" ry="3" fill="#000000" />
              </>
            )}
          </g>

          {/* Jaw/Mouth Area */}
          <g id="jaw">
            <path
              d="M 40 78 L 35 82 L 50 88 L 65 82 L 60 78"
              fill="#909090"
              stroke="#000000"
              strokeWidth="0.8"
            />
            {/* Jaw hinge lines */}
            {showMediumDetails && (
              <>
                <line x1="35" y1="75" x2="35" y2="82" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
                <line x1="65" y1="75" x2="65" y2="82" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
              </>
            )}
          </g>

          {/* Eyes - GLOWING WHITE (Main Focus) */}
          <g id="eyes">
            {/* Left Eye */}
            <ellipse
              cx="38"
              cy="45"
              rx={isHovered ? "5" : "4"}
              ry={isHovered ? "7" : "6"}
              fill="#FFFFFF"
              filter={isHovered ? "url(#eyeGlowIntense)" : "url(#eyeGlow)"}
              className="animate-eye-pulse"
            />
            {showBasicDetails && (
              <ellipse cx="38" cy="45" rx="5.5" ry="7.5" fill="none" stroke="#C0C0C0" strokeWidth="0.5" />
            )}

            {/* Right Eye */}
            <ellipse
              cx="62"
              cy="45"
              rx={isHovered ? "5" : "4"}
              ry={isHovered ? "7" : "6"}
              fill="#FFFFFF"
              filter={isHovered ? "url(#eyeGlowIntense)" : "url(#eyeGlow)"}
              className="animate-eye-pulse"
            />
            {showBasicDetails && (
              <ellipse cx="62" cy="45" rx="5.5" ry="7.5" fill="none" stroke="#C0C0C0" strokeWidth="0.5" />
            )}
          </g>

          {/* Tech Details - Mechanical Elements */}
          {showFullDetails && (
            <g id="techDetails">
              {/* Vents on cheeks */}
              <g id="vents">
                <rect x="28" y="52" width="4" height="1.5" fill="#000000" opacity="0.8" />
                <rect x="28" y="55" width="4" height="1.5" fill="#000000" opacity="0.8" />
                <rect x="68" y="52" width="4" height="1.5" fill="#000000" opacity="0.8" />
                <rect x="68" y="55" width="4" height="1.5" fill="#000000" opacity="0.8" />
              </g>

              {/* Rivets/bolts on panels */}
              <g id="rivets">
                <circle cx="32" cy="35" r="0.8" fill="#A0A0A0" stroke="#FFFFFF" strokeWidth="0.3" />
                <circle cx="68" cy="35" r="0.8" fill="#A0A0A0" stroke="#FFFFFF" strokeWidth="0.3" />
                <circle cx="35" cy="65" r="0.8" fill="#A0A0A0" stroke="#FFFFFF" strokeWidth="0.3" />
                <circle cx="65" cy="65" r="0.8" fill="#A0A0A0" stroke="#FFFFFF" strokeWidth="0.3" />
              </g>

              {/* LED indicators on temple */}
              <g id="leds">
                <circle cx="32" cy="40" r="1" fill="#C0C0C0" opacity="0.7" />
                <circle cx="68" cy="40" r="1" fill="#C0C0C0" opacity="0.7" />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* DREFLABS Text */}
      {size !== 'sm' && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading font-bold tracking-wider transition-all duration-500',
              'text-white',
              textSizes[size],
              isHovered && 'tracking-widest'
            )}
            style={{
              textShadow: isHovered
                ? '0 0 20px rgba(255, 255, 255, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.3)'
                : '0 0 10px rgba(255, 255, 255, 0.2), 1px 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            DREFLABS
          </span>
        </div>
      )}

      {/* Glow effect on hover */}
      {isHovered && (
        <div
          className="absolute -inset-3 bg-white/5 rounded-lg blur-xl -z-10 animate-pulse"
          style={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
          }}
        />
      )}
    </div>
  )
}
