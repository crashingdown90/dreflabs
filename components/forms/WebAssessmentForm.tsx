'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  description: string
}

export default function WebAssessmentForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err) {
      setError('Gagal mengirim form. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-dark-secondary/50 border border-green-500/30 rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Terima Kasih!
        </h3>
        <p className="text-gray-300">
          Form assessment Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda untuk follow up pesanan.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Nomor Telepon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            placeholder="+62 812 3456 7890"
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
            Nama Perusahaan/Organisasi
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            placeholder="PT. Example Indonesia"
          />
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
            Tipe Proyek <span className="text-red-500">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
          >
            <option value="">Pilih tipe proyek</option>
            <option value="company-profile">Company Profile</option>
            <option value="e-commerce">E-Commerce</option>
            <option value="web-app">Web Application</option>
            <option value="portfolio">Portfolio Website</option>
            <option value="landing-page">Landing Page</option>
            <option value="blog-cms">Blog/CMS</option>
            <option value="custom">Custom Project</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
            Budget <span className="text-red-500">*</span>
          </label>
          <select
            id="budget"
            name="budget"
            required
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
          >
            <option value="">Pilih budget</option>
            <option value="< 5jt">&lt; Rp 5.000.000</option>
            <option value="5-10jt">Rp 5.000.000 - Rp 10.000.000</option>
            <option value="10-25jt">Rp 10.000.000 - Rp 25.000.000</option>
            <option value="25-50jt">Rp 25.000.000 - Rp 50.000.000</option>
            <option value="> 50jt">&gt; Rp 50.000.000</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
            Timeline <span className="text-red-500">*</span>
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            value={formData.timeline}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
          >
            <option value="">Pilih timeline</option>
            <option value="urgent">&lt; 1 Bulan (Urgent)</option>
            <option value="1-2months">1-2 Bulan</option>
            <option value="2-3months">2-3 Bulan</option>
            <option value="3-6months">3-6 Bulan</option>
            <option value="flexible">Fleksibel</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Deskripsi Proyek <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-3 bg-dark-tertiary border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none"
          placeholder="Jelaskan detail proyek Anda, fitur yang diinginkan, target audience, dan informasi lain yang relevan..."
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Mengirim...
          </>
        ) : (
          <>
            <Send size={20} />
            Kirim Assessment
          </>
        )}
      </Button>

      <p className="text-sm text-gray-400">
        <span className="text-red-500">*</span> Wajib diisi. Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk follow up pesanan.
      </p>
    </form>
  )
}
