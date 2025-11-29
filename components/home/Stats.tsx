'use client'

import CountUp from '@/components/animations/CountUp'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { Code2, Award, Building2, Coffee } from 'lucide-react'

const stats = [
  {
    icon: Code2,
    value: 17,
    suffix: '+',
    label: 'Years Experience',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  {
    icon: Building2,
    value: 50,
    suffix: '+',
    label: 'Projects Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  {
    icon: Award,
    value: 30,
    suffix: '+',
    label: 'Government Clients',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  {
    icon: Coffee,
    value: 10000,
    suffix: '+',
    label: 'Cups of Coffee',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
]

export default function Stats() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-secondary/50 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="text-center group">
                <div className={`inline-flex p-4 rounded-2xl ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                    delay={0.5 + index * 0.2}
                  />
                </div>
                <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
