'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    category: 'Web Development',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    status: 'active',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.slug || !formData.title || !formData.description) {
        alert('Please fill in all required fields (slug, title, description)')
        setSaving(false)
        return
      }

      const projectData = {
        slug: formData.slug,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        image_url: formData.imageUrl || null,
        github_url: formData.githubUrl || null,
        demo_url: formData.demoUrl || null,
        status: formData.status,
      }

      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        alert('Session expired. Please login again.')
        router.push('/admin/login')
        return
      }

      // Call API to create project
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          alert('Session expired. Please login again.')
          router.push('/admin/login')
          return
        }
        throw new Error(result.message || 'Failed to save project')
      }

      alert('Project created successfully!')
      router.push('/admin/projects')
    } catch (error: any) {
      console.error('Error saving project:', error)
      alert(error.message || 'Error saving project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">New Project</h2>
            <p className="text-gray-400">Create a new technology project</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="my-awesome-project"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (e.g., my-project)</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Awesome Project"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-white/50"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
              <option value="Blockchain">Blockchain</option>
              <option value="IoT">IoT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status <span className="text-red-400">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-white/50"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Technologies */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, TypeScript, PostgreSQL"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of technologies</p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your project..."
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50 resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="/images/projects/my-project.png"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Demo URL
            </label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              placeholder="https://demo.example.com"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

