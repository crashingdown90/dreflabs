'use client'

import ScrollReveal from '@/components/animations/ScrollReveal'
import Card, { CardContent } from '@/components/ui/Card'
import { Database, Brain, Shield, BarChart3, MessageSquare, Building2, FileText, Cloud } from 'lucide-react'
import expertiseData from '@/content/data/expertise.json'

const iconMap = {
  'database': Database,
  'brain': Brain,
  'shield': Shield,
  'chart': BarChart3,
  'message-square': MessageSquare,
  'building': Building2,
  'file-text': FileText,
  'cloud': Cloud,
}

export default function Expertise() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Core Expertise
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Comprehensive technology expertise spanning data, AI, security, and digital transformation
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseData.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            return (
              <ScrollReveal key={item.id} delay={index * 0.1}>
                <Card hover glow className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-primary mb-4">
                      <Icon className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 rounded bg-dark-tertiary text-white border border-dark-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
