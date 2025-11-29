'use client'

import { motion } from 'framer-motion'

interface MarqueeProps {
    items: string[]
    direction?: 'left' | 'right'
    speed?: number
}

export default function Marquee({ items, direction = 'left', speed = 20 }: MarqueeProps) {
    return (
        <div className="relative flex overflow-hidden py-10 bg-dark-bg border-y border-white/5">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-dark-bg via-transparent to-dark-bg" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
                }}
                transition={{
                    duration: speed,
                    ease: 'linear',
                    repeat: Infinity,
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, index) => (
                    <span
                        key={index}
                        className="mx-8 text-6xl sm:text-8xl font-heading font-bold text-transparent stroke-text opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-default"
                        style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)' }}
                    >
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}
