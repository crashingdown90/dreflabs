'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { FileText, Folder, Code2, MessageSquare, Mail, Users, TrendingUp, Eye, Clock } from 'lucide-react'

interface DashboardStats {
  blogPosts: number
  techProjects: number
  webPortfolio: number
  openSource: number
  politicalConsulting: number
  comments: number
  messages: number
  newsletter: number
}

export default function AdminDashboardPage() {
  const [stats] = useState<DashboardStats>({
    blogPosts: 3,
    techProjects: 4,
    webPortfolio: 5,
    openSource: 3,
    politicalConsulting: 3,
    comments: 0,
    messages: 0,
    newsletter: 0,
  })

  useEffect(() => {
    // TODO: Fetch real stats from API
  }, [])

  const totalContent = stats.blogPosts + stats.techProjects + stats.webPortfolio + stats.openSource + stats.politicalConsulting

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Content */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="text-blue-400" size={24} />
            </div>
            <span className="text-xs text-blue-400 font-medium">Total</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Content</p>
          <p className="text-white text-3xl font-bold">{totalContent}</p>
        </div>

        {/* Blog Posts */}
        <Link href="/admin/blog" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FileText className="text-purple-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Blog Posts</p>
            <p className="text-white text-3xl font-bold">{stats.blogPosts}</p>
          </div>
        </Link>

        {/* Projects */}
        <Link href="/admin/projects" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Folder className="text-green-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Tech Projects</p>
            <p className="text-white text-3xl font-bold">{stats.techProjects}</p>
          </div>
        </Link>

        {/* Web Portfolio */}
        <Link href="/admin/web-portfolio" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Code2 className="text-cyan-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Web Portfolio</p>
            <p className="text-white text-3xl font-bold">{stats.webPortfolio}</p>
          </div>
        </Link>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Open Source */}
        <Link href="/admin/opensource" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Code2 className="text-orange-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Open Source</p>
            <p className="text-white text-3xl font-bold">{stats.openSource}</p>
          </div>
        </Link>

        {/* Political Consulting */}
        <Link href="/admin/political-consulting" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Users className="text-red-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Political Cases</p>
            <p className="text-white text-3xl font-bold">{stats.politicalConsulting}</p>
          </div>
        </Link>

        {/* Comments */}
        <Link href="/admin/comments" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <MessageSquare className="text-pink-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Comments</p>
            <p className="text-white text-3xl font-bold">{stats.comments}</p>
          </div>
        </Link>

        {/* Newsletter */}
        <Link href="/admin/newsletter" className="block group">
          <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6 hover:border-white/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Mail className="text-yellow-400" size={24} />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">View →</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Subscribers</p>
            <p className="text-white text-3xl font-bold">{stats.newsletter}</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Management */}
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Content Management</h3>
          <div className="space-y-3">
            <Link
              href="/admin/blog"
              className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-white/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-purple-400" size={20} />
                <span className="text-white font-medium">Manage Blog Posts</span>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400">→</span>
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-white/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Folder className="text-green-400" size={20} />
                <span className="text-white font-medium">Manage Projects</span>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400">→</span>
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-white/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Eye className="text-cyan-400" size={20} />
                <span className="text-white font-medium">Media Library</span>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* System & Analytics */}
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">System & Analytics</h3>
          <div className="space-y-3">
            <Link
              href="/admin/analytics"
              className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-white/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-400" size={20} />
                <span className="text-white font-medium">View Analytics</span>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400">→</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-white/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Clock className="text-orange-400" size={20} />
                <span className="text-white font-medium">Site Settings</span>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400">→</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-white/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Eye className="text-green-400" size={20} />
                <span className="text-white font-medium">View Live Site</span>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
