'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { Save, ArrowLeft, Eye, Upload } from 'lucide-react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Artificial Intelligence',
    tags: '',
    coverImage: '',
    readTime: 5,
    status: 'draft'
  })

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    setFormData({ ...formData, title, slug })
  }

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true)

    try {
      const postData = {
        slug: formData.slug,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        cover_image: formData.coverImage,
        read_time: formData.readTime,
        status,
      }

      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        alert('Session expired. Please login again.')
        router.push('/admin/login')
        return
      }

      // Call API to create blog post
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save blog post')
      }

      alert(`Blog post ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`)
      router.push('/admin/blog')
    } catch (error: any) {
      console.error('Error saving post:', error)
      alert(error.message || 'Error saving post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">New Blog Post</h2>
            <p className="text-gray-400">Create a new article for your blog</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving || !formData.title}
          >
            <Save size={20} className="mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={saving || !formData.title || !formData.content}
          >
            <Eye size={20} className="mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-url-slug"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              URL: /blog/{formData.slug || 'post-url-slug'}
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the post..."
              rows={3}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Content *
            </label>
            <div className="bg-white rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={modules}
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Big Data">Big Data</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="E-Government">E-Government</option>
              <option value="Digital Transformation">Digital Transformation</option>
              <option value="Political Strategy">Political Strategy</option>
            </select>
          </div>

          {/* Tags */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="AI, Machine Learning, NLP"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">
              Separate tags with commas
            </p>
          </div>

          {/* Read Time */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Read Time (minutes)
            </label>
            <input
              type="number"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
              min="1"
              max="60"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Cover Image */}
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Cover Image
            </label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="/blog/image.png"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors mb-3"
            />
            <Button variant="outline" size="sm" className="w-full">
              <Upload size={16} className="mr-2" />
              Upload Image
            </Button>
            {formData.coverImage && (
              <div className="mt-4 rounded-lg overflow-hidden relative h-32">
                <Image
                  src={formData.coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  unoptimized={formData.coverImage.startsWith('/uploads')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

