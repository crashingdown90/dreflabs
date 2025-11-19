import Link from 'next/link'
import { Database, Brain, Shield, Building2, FileText, CheckCircle } from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import servicesData from '@/content/data/services.json'

const iconMap = {
  'database': Database,
  'brain': Brain,
  'shield': Shield,
  'building': Building2,
  'file-text': FileText,
}

export const metadata = {
  title: 'Services | Dref Labs',
  description: 'Professional services in Big Data, AI, Cyber Security, and E-Government',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              Services
            </h1>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive technology consulting and implementation services for government and enterprise
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto space-y-8">
          {servicesData.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return (
              <ScrollReveal key={service.id} delay={index * 0.1}>
                <Card hover glow className="p-8">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <Icon className="text-white" size={32} />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h2 className="text-2xl font-heading font-bold text-white mb-3">
                          {service.title}
                        </h2>
                        <p className="text-gray-300 mb-6">{service.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h3 className="text-white font-semibold mb-3">Deliverables:</h3>
                            <ul className="space-y-2">
                              {service.deliverables.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                                  <CheckCircle size={16} className="text-white flex-shrink-0 mt-1" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-white font-semibold mb-3">Industries Served:</h3>
                            <div className="flex flex-wrap gap-2">
                              {service.industries.map((industry) => (
                                <span
                                  key={industry}
                                  className="text-xs px-3 py-1 rounded-full bg-dark-tertiary text-gray-300 border border-dark-border"
                                >
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm">
                          <span className="font-semibold text-white">Pricing:</span> {service.pricing}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal>
          <div className="mt-16 text-center p-12 rounded-xl border border-dark-border bg-dark-secondary/30">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help transform your organization with cutting-edge technology solutions.
            </p>
            <Link href="/contact">
              <Button size="lg">Schedule a Consultation</Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
