'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import ParticleBackground from '@/components/animations/ParticleBackground'
import HeroScene from '@/components/3d/HeroScene'
import { motion } from 'framer-motion'

const titles = [
  'Big Data Expert',
  'AI Specialist',
  'E-Government Architect',
  'Cyber Security Expert',
  'Data Science Leader',
]

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentTitle = titles[titleIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentTitle.length) {
            setDisplayText(currentTitle.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setTitleIndex((prev) => (prev + 1) % titles.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, titleIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroScene />
      <ParticleBackground />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-white via-gray-400 to-gray-800 animate-gradient">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-black shadow-2xl shadow-white/20">
                <Image
                  src="/images/Drefan.png"
                  alt="Drefan Mardiawan"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4"
          >
            Drefan Mardiawan
          </motion.h1>

          {/* Animated Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-12 sm:h-14 md:h-16 mb-6"
          >
            <p className="text-xl sm:text-2xl md:text-3xl gradient-text font-semibold">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mb-12"
          >
            Transforming Data into Insights, Building Digital Government Solutions
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/projects">
              <Button size="lg">View Projects</Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline">
                Read Articles
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Get in Touch
              </Button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center text-gray-400 hover:text-white active:scale-90 cursor-pointer transition-all duration-200"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth',
                })
              }}
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
