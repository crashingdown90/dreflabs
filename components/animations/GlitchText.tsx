'use client'

import { CSSProperties } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  speed?: number
  color?: string
  glitchColor1?: string
  glitchColor2?: string
}

export default function GlitchText({
  text,
  className = '',
  speed = 0.3,
  color = '#ffffff',
  glitchColor1 = '#00E5FF',
  glitchColor2 = '#ff0080',
}: GlitchTextProps) {
  const style: CSSProperties = {
    '--glitch-color-1': glitchColor1,
    '--glitch-color-2': glitchColor2,
    '--glitch-speed': `${speed}s`,
    position: 'relative',
    display: 'inline-block',
    color,
  } as CSSProperties

  return (
    <>
      <style jsx global>{`
        @keyframes glitch-anim-1 {
          0%, 100% {
            clip-path: inset(40% 0 61% 0);
            transform: translate(-2px, 2px);
          }
          20% {
            clip-path: inset(92% 0 1% 0);
            transform: translate(1px, -1px);
          }
          40% {
            clip-path: inset(43% 0 1% 0);
            transform: translate(-1px, 2px);
          }
          60% {
            clip-path: inset(25% 0 58% 0);
            transform: translate(2px, 1px);
          }
          80% {
            clip-path: inset(54% 0 7% 0);
            transform: translate(-2px, -1px);
          }
        }
        @keyframes glitch-anim-2 {
          0%, 100% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(2px, -2px);
          }
          20% {
            clip-path: inset(15% 0 65% 0);
            transform: translate(-2px, 2px);
          }
          40% {
            clip-path: inset(70% 0 12% 0);
            transform: translate(1px, -1px);
          }
          60% {
            clip-path: inset(5% 0 85% 0);
            transform: translate(-1px, 1px);
          }
          80% {
            clip-path: inset(35% 0 50% 0);
            transform: translate(2px, 2px);
          }
        }
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          color: var(--glitch-color-1);
          animation: glitch-anim-1 var(--glitch-speed) infinite linear alternate-reverse;
        }
        .glitch-text::after {
          color: var(--glitch-color-2);
          animation: glitch-anim-2 var(--glitch-speed) infinite linear alternate-reverse;
        }
        .glitch-text:hover::before,
        .glitch-text:hover::after {
          animation-duration: 0.1s;
        }
      `}</style>
      <span className={`glitch-text ${className}`} style={style} data-text={text}>
        {text}
      </span>
    </>
  )
}
