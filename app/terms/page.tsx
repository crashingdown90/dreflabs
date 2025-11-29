import { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card from '@/components/ui/Card'
import { FileText, CheckCircle, AlertTriangle, Scale, Copyright, Gavel } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Dref Labs',
  description: 'Terms of Service for Dref Labs - Read our terms and conditions for using our website and services.',
}

const sections = [
  {
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using this website, you accept and agree to be bound by these Terms of Service',
      'If you do not agree to these terms, please do not use our website or services',
      'We reserve the right to modify these terms at any time without prior notice',
    ],
  },
  {
    icon: FileText,
    title: 'Use of Services',
    content: [
      'Our website and services are intended for informational and professional purposes',
      'You agree to use our services only for lawful purposes',
      'You must not misuse our website by introducing viruses or other malicious code',
      'You are responsible for maintaining the confidentiality of any account credentials',
    ],
  },
  {
    icon: Copyright,
    title: 'Intellectual Property',
    content: [
      'All content on this website, including text, graphics, logos, and software, is our property',
      'You may not reproduce, distribute, or create derivative works without written permission',
      'Our trademarks and brand elements may not be used without prior authorization',
      'Blog articles may be shared with proper attribution and link back to the original',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Disclaimer',
    content: [
      'Information provided on this website is for general informational purposes only',
      'We make no warranties about the accuracy or completeness of the content',
      'Professional advice should be sought for specific technical implementations',
      'We are not liable for any decisions made based on information from this website',
    ],
  },
  {
    icon: Scale,
    title: 'Limitation of Liability',
    content: [
      'We shall not be liable for any indirect, incidental, or consequential damages',
      'Our total liability is limited to the amount paid for our services, if applicable',
      'We are not responsible for third-party websites linked from our site',
      'Force majeure events release us from our obligations under these terms',
    ],
  },
  {
    icon: Gavel,
    title: 'Governing Law',
    content: [
      'These terms are governed by the laws of the Republic of Indonesia',
      'Any disputes shall be resolved through negotiation or mediation first',
      'If necessary, disputes will be submitted to the competent courts in Indonesia',
      'These terms constitute the entire agreement between you and Dref Labs',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-300">Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              Terms of Service
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
                Welcome to Dref Labs. These Terms of Service govern your use of our website and services.
                By accessing or using our website, you agree to comply with and be bound by these terms.
                Please read them carefully before using our services.
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
            <Card className="p-8 mt-8 bg-gradient-to-br from-dark-secondary/50 to-dark-primary/30 border-primary/20">
              <div className="text-center">
                <h3 className="text-xl font-heading font-bold text-white mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-gray-400 mb-6">
                  If you have any questions about these Terms of Service, please don&apos;t hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-dark-bg font-medium rounded-lg hover:shadow-lg hover:shadow-white/20 transition-all"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
