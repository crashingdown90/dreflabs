'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Loading'
import { Plus, Edit, Trash2, Tag, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { log } from '@/lib/logger'

interface Project {
  id: number
  slug: string
  title: string
  description: string
  category: string
  technologies: string // comma-separated in DB
  image_url?: string
  github_url?: string
  demo_url?: string
  status: string
  created_at: string
  updated_at: string
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([])

  useEffect(() => {
    fetchProjects()
  }, [filter])

  const fetchProjects = async () => {
    try {
      setLoading(true)

      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/admin/login')
        return
      }

      // Build query params
      const params = new URLSearchParams()
      if (filter !== 'all' && filter !== 'active' && filter !== 'completed' && filter !== 'archived') {
        params.append('category', filter)
      } else if (filter !== 'all') {
        params.append('status', filter)
      }

      // Fetch projects from API
      const response = await fetch(`/api/admin/projects?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch projects')
      }

      const result = await response.json()
      setProjects(result.data.projects)
      setCategories(result.data.categories || [])
      setLoading(false)
    } catch (error) {
      log.error('Error fetching projects:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      alert('Project deleted successfully!')
      fetchProjects() // Refresh list
    } catch (error) {
      log.error('Error deleting project:', error)
      alert('Error deleting project. Please try again.')
    }
  }

  const filterCategories = ['all', 'active', 'completed', 'archived', ...categories.map(c => c.category)]
  const filteredProjects = filter === 'all'
    ? projects
    : (filter === 'active' || filter === 'completed' || filter === 'archived')
      ? projects.filter(p => p.status === filter)
      : projects.filter(p => p.category === filter)

  const activeCount = projects.filter(p => p.status === 'active').length
  const completedCount = projects.filter(p => p.status === 'completed').length

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Tech Projects</h2>
          <p className="text-gray-400">Manage your technology projects portfolio</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Projects</p>
          <p className="text-white text-3xl font-bold">{projects.length}</p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-white text-3xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-white text-3xl font-bold">{completedCount}</p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Categories</p>
          <p className="text-white text-3xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                filter === cat
                  ? 'bg-white text-dark-bg'
                  : 'bg-dark-bg text-gray-400 hover:text-white border border-dark-border hover:border-white/30'
              )}
            >
              {cat === 'all' ? 'All Projects' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-dark-secondary/50 border border-dark-border rounded-xl">
            <p className="text-gray-400 mb-4">No projects found</p>
            <Link href="/admin/projects/new">
              <Button>
                <Plus size={20} className="mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const technologies = project.technologies ? project.technologies.split(',').map(t => t.trim()) : []
            return (
              <div
                key={project.id}
                className="bg-dark-secondary/50 border border-dark-border rounded-xl overflow-hidden hover:border-white/30 transition-all duration-200"
              >
                {/* Project Image */}
                {project.image_url && (
                  <div className="h-48 bg-dark-bg overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-heading font-bold text-white line-clamp-2">
                      {project.title}
                    </h3>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      project.status === 'active' && 'bg-green-500/20 text-green-400',
                      project.status === 'completed' && 'bg-blue-500/20 text-blue-400',
                      project.status === 'archived' && 'bg-gray-500/20 text-gray-400',
                      project.status === 'in_progress' && 'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={16} className="text-gray-500" />
                    <span className="text-gray-400 text-sm">{project.category}</span>
                  </div>

                  {/* Technologies */}
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-dark-bg border border-dark-border rounded-full text-xs text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {technologies.length > 3 && (
                        <span className="px-3 py-1 bg-dark-bg border border-dark-border rounded-full text-xs text-gray-400">
                          +{technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <ExternalLink size={16} className="mr-2" />
                          Demo
                        </Button>
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <ExternalLink size={16} className="mr-2" />
                          GitHub
                        </Button>
                      </a>
                    )}
                    <Link href={`/admin/projects/edit/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </AdminLayout>
  )
}

