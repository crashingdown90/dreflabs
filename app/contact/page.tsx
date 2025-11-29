'use client'

import { useState } from 'react'
import { Mail, Linkedin, Send } from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import LetterPullUp from '@/components/animations/LetterPullUp'
import Aurora from '@/components/animations/Aurora'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceInterest: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setFormData({ name: '', email: '', company: '', serviceInterest: '', message: '' })
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong')
      }
    } catch (_error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20 relative overflow-hidden">
      {/* Aurora Background */}
      <Aurora
        className="fixed inset-0 z-0"
        colors={['#00E5FF', '#007AFF', '#C0C0C0']}
        speed={15}
        blur={150}
        opacity={0.15}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              <LetterPullUp text="Get in Touch" staggerChildren={0.05} />
            </h1>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Interested in discussing a project or collaboration? Fill out the form below or reach out through email or LinkedIn.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <ScrollReveal direction="left">
              <Card className="p-8">
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name *"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your name"
                      />
                      <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Company / Organization"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Optional"
                      />
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Service Interest
                        </label>
                        <select
                          value={formData.serviceInterest}
                          onChange={(e) =>
                            setFormData({ ...formData, serviceInterest: e.target.value })
                          }
                          className="w-full rounded-lg border border-dark-border bg-dark-secondary px-4 py-3 text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                          <option value="">Select a service</option>
                          <option value="big-data">Big Data & Analytics</option>
                          <option value="ai-ml">AI & Machine Learning</option>
                          <option value="cyber-security">Cyber Security</option>
                          <option value="e-government">E-Government Solutions</option>
                          <option value="consulting">General Consulting</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <Textarea
                      label="Message *"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Tell me about your project or inquiry..."
                    />

                    {status === 'error' && (
                      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    {status === 'success' && (
                      <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400 text-sm">
                        Thank you for your message! I'll get back to you soon.
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === 'loading'}
                      className="w-full md:w-auto"
                    >
                      {status === 'loading' ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send size={20} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <ScrollReveal direction="right">
              <Card hover glow className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white">Email</h3>
                      <p className="text-gray-400 text-sm">Direct communication</p>
                    </div>
                  </div>
                  <a
                    href="mailto:contact@dreflabs.com"
                    className="text-white hover:underline"
                  >
                    contact@dreflabs.com
                  </a>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <Card hover glow className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Linkedin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white">LinkedIn</h3>
                      <p className="text-gray-400 text-sm">Professional network</p>
                    </div>
                  </div>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    Connect on LinkedIn
                  </a>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <Card className="p-6 bg-dark-tertiary/30">
                <CardContent className="p-0">
                  <h3 className="font-heading font-semibold text-white mb-3">
                    Response Time
                  </h3>
                  <p className="text-gray-400 text-sm">
                    I typically respond to inquiries within 24-48 hours on business days.
                    For urgent matters, please mention it in your message.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
