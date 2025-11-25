'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Loading'
import { Plus, Edit, Trash2, Eye, Calendar, Tag, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { log } from '@/lib/logger'

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category: string
  tags: string | null
  read_time: number
  status: 'draft' | 'published'
  author_id: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([])

  const fetchPosts = useCallback(async () => {
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
      if (filter !== 'all') {
        params.append('status', filter)
      }

      // Fetch posts from API
      const response = await fetch(`/api/admin/blog?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch posts')
      }

      const result = await response.json()
      setPosts(result.data.posts)
      setCategories(result.data.categories || [])
      setLoading(false)
    } catch (error) {
      log.error('Error fetching posts:', error)
      setLoading(false)
    }
  }, [filter, router])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      alert('Blog post deleted successfully!')
      fetchPosts() // Refresh list
    } catch (error) {
      log.error('Error deleting post:', error)
      alert('Error deleting post. Please try again.')
    }
  }

  const filterCategories = ['all', 'draft', 'published', ...categories.map(c => c.category)]
  const filteredPosts = filter === 'all'
    ? posts
    : (filter === 'draft' || filter === 'published')
      ? posts.filter(p => p.status === filter)
      : posts.filter(p => p.category === filter)

  const publishedCount = posts.filter(p => p.status === 'published').length
  const draftCount = posts.filter(p => p.status === 'draft').length

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Blog Posts</h2>
          <p className="text-gray-400">Manage your blog articles and content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus size={20} className="mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Posts</p>
          <p className="text-white text-3xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Published</p>
          <p className="text-white text-3xl font-bold">{publishedCount}</p>
        </div>
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Drafts</p>
          <p className="text-white text-3xl font-bold">{draftCount}</p>
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
              {cat === 'all' ? 'All Posts' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-dark-secondary/50 border border-dark-border rounded-xl">
            <p className="text-gray-400 mb-4">No blog posts found</p>
            <Link href="/admin/blog/new">
              <Button>
                <Plus size={20} className="mr-2" />
                Create Your First Post
              </Button>
            </Link>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : []
            return (
              <div
                key={post.id}
                className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Cover Image */}
                  {post.cover_image && (
                    <div className="lg:w-48 h-32 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized={post.cover_image.startsWith('/uploads')}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-heading font-bold text-white line-clamp-2">
                            {post.title}
                          </h3>
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            post.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          )}>
                            {post.status}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span>{post.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-dark-bg border border-dark-border rounded-full text-xs text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > 3 && (
                          <span className="px-3 py-1 bg-dark-bg border border-dark-border rounded-full text-xs text-gray-400">
                            +{tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {post.status === 'published' && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye size={16} className="mr-2" />
                            View
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>
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

