import { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card from '@/components/ui/Card'
import { Shield, Eye, Database, Lock, Mail, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Dref Labs',
  description: 'Privacy Policy for Dref Labs - Learn how we collect, use, and protect your personal information.',
}

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      'Personal information you provide (name, email) when contacting us or subscribing to our newsletter',
      'Usage data collected automatically (IP address, browser type, pages visited)',
      'Cookies and similar tracking technologies for analytics and preferences',
    ],
  },
  {
    icon: Database,
    title: 'How We Use Your Information',
    content: [
      'To respond to your inquiries and provide requested services',
      'To send newsletters and updates (with your consent)',
      'To improve our website and user experience',
      'To analyze website traffic and usage patterns',
    ],
  },
  {
    icon: Shield,
    title: 'Data Protection',
    content: [
      'We implement industry-standard security measures to protect your data',
      'Your personal information is stored securely and accessed only when necessary',
      'We do not sell, trade, or rent your personal information to third parties',
    ],
  },
  {
    icon: Lock,
    title: 'Your Rights',
    content: [
      'Right to access your personal data we hold',
      'Right to request correction of inaccurate data',
      'Right to request deletion of your data',
      'Right to withdraw consent for data processing',
      'Right to opt-out of marketing communications',
    ],
  },
  {
    icon: Globe,
    title: 'Cookies Policy',
    content: [
      'We use essential cookies for website functionality',
      'Analytics cookies help us understand how visitors use our site',
      'You can control cookie preferences through your browser settings',
    ],
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: [
      'If you have questions about this Privacy Policy, please contact us at:',
      'Email: privacy@dreflabs.com',
      'We will respond to your inquiry within 30 business days',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-300">Your Privacy Matters</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <Card className="p-8 mb-8">
              <p className="text-gray-300 leading-relaxed">
                At Dref Labs, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                or use our services. Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </Card>
          </ScrollReveal>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-heading font-bold text-white mb-4">
                          {section.title}
                        </h2>
                        <ul className="space-y-2">
                          {section.content.map((item, i) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <span className="text-primary mt-1.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>

          <ScrollReveal>
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                By using our website, you consent to this Privacy Policy.
              </p>
              <Link
                href="/contact"
                className="text-primary hover:text-white transition-colors underline"
              >
                Contact us if you have any questions
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
