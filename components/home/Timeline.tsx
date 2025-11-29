'use client'

import ScrollReveal from '@/components/animations/ScrollReveal'
import { Shield, Server, Database, Brain, Building2 } from 'lucide-react'
import type { TimelineEvent } from '@/types'

const timelineEvents: TimelineEvent[] = [
  {
    year: '2008',
    title: 'Ethical Hacking & Security',
    description: 'Started journey in IT with focus on ethical hacking and cyber security',
    icon: 'Shield',
    color: 'from-gray-700 to-gray-600',
  },
  {
    year: '2010-2015',
    title: 'Enterprise IT & Cyber Security',
    description: 'Led enterprise IT infrastructure and security projects',
    icon: 'Server',
    color: 'from-gray-600 to-gray-500',
  },
  {
    year: '2015-2020',
    title: 'Big Data & Analytics',
    description: 'Implemented large-scale big data and analytics solutions',
    icon: 'Database',
    color: 'from-gray-500 to-gray-400',
  },
  {
    year: '2020-2023',
    title: 'AI & Machine Learning',
    description: 'Developed AI/ML powered analytics and decision support systems',
    icon: 'Brain',
    color: 'from-gray-400 to-gray-300',
  },
  {
    year: '2023-Present',
    title: 'E-Government & Digital Transformation',
    description: 'Leading digital transformation initiatives and e-government solutions',
    icon: 'Building2',
    color: 'from-gray-300 to-gray-200',
  },
]

const iconMap = {
  Shield,
  Server,
  Database,
  Brain,
  Building2,
}

export default function Timeline() {
  return (
    <section className="relative py-20 md:py-32 bg-dark-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              My Journey
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              17+ years of continuous learning and innovation in technology
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

            {/* Events */}
            <div className="grid grid-cols-5 gap-4 relative">
              {timelineEvents.map((event, index) => {
                const Icon = iconMap[event.icon as keyof typeof iconMap]
                return (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center mb-4 shadow-lg shadow-white/10 border border-white/20`}
                      >
                        <Icon className="text-white drop-shadow-md" size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm sm:text-base text-white font-bold mb-2">{event.year}</p>
                        <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{event.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{event.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-700 via-gray-500 to-gray-200"></div>

            {/* Events */}
            <div className="space-y-8">
              {timelineEvents.map((event, index) => {
                const Icon = iconMap[event.icon as keyof typeof iconMap]
                return (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="flex items-start gap-6">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-sm sm:text-base text-white font-bold mb-1">{event.year}</p>
                        <h3 className="text-base sm:text-lg text-white font-semibold mb-2">{event.title}</h3>
                        <p className="text-gray-400 text-sm sm:text-base">{event.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
