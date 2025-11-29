'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card, { CardContent } from '@/components/ui/Card'
import TextReveal from '@/components/animations/TextReveal'

const stats = [
  { label: 'Years Experience', value: 17, suffix: '+' },
  { label: 'Projects Delivered', value: 50, suffix: '+' },
  { label: 'Government Clients', value: 20, suffix: '+' },
  { label: 'Articles Published', value: 100, suffix: '+' },
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
      {count}
      {suffix}
    </span>
  )
}

export default function About() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <ScrollReveal direction="left">
            <div className="prose prose-invert max-w-none">
              <TextReveal
                text="With over 17 years of experience in IT, I specialize in transforming complex data challenges into actionable insights and building innovative digital government solutions. My journey began in 2008 with ethical hacking and security, evolving through enterprise infrastructure and cyber security, big data analytics, and now focusing on AI/ML and e-government transformation."
                className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6"
              />
              <TextReveal
                text="Throughout my career, I've had the privilege of working with government institutions and enterprises, implementing large-scale big data solutions, developing AI-powered analytics platforms, and architecting secure digital transformation initiatives."
                className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6"
              />
              <TextReveal
                text="My mission is to leverage cutting-edge technology to solve real-world problems, particularly in the public sector, where data-driven decision making can have profound impacts on society."
                className="text-base sm:text-lg text-gray-300 leading-relaxed"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 glass-card" hover glow>
                  <CardContent className="p-0">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <p className="text-gray-400 mt-2 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
