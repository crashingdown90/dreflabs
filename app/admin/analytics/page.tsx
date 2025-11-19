'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { TrendingUp, Users, Eye, Clock, MousePointer } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days')

  const stats = {
    totalVisitors: 12543,
    pageViews: 45678,
    avgSessionDuration: '3m 24s',
    bounceRate: '42.3%',
    newVisitors: 8234,
    returningVisitors: 4309,
  }

  const topPages = [
    { path: '/', title: 'Home', views: 8234, avgTime: '2m 15s' },
    { path: '/blog/ai-simple', title: 'AI-Powered Social Media Analytics', views: 5432, avgTime: '8m 42s' },
    { path: '/projects', title: 'Tech Projects', views: 3456, avgTime: '4m 18s' },
    { path: '/web-portfolio', title: 'Web Portfolio', views: 2876, avgTime: '5m 32s' },
    { path: '/about', title: 'About', views: 2345, avgTime: '3m 05s' },
  ]

  const topBlogPosts = [
    { title: 'AI-Powered Social Media Analytics for Government', views: 5432, engagement: '85%' },
    { title: 'Cyber Security Framework for E-Government', views: 4321, engagement: '78%' },
    { title: 'Big Data dalam Transformasi Pemerintahan Modern', views: 3876, engagement: '72%' },
  ]

  const trafficSources = [
    { source: 'Direct', visitors: 5234, percentage: 41.7 },
    { source: 'Organic Search', visitors: 4123, percentage: 32.9 },
    { source: 'Social Media', visitors: 2186, percentage: 17.4 },
    { source: 'Referral', visitors: 1000, percentage: 8.0 },
  ]

  const deviceStats = [
    { device: 'Desktop', visitors: 7526, percentage: 60.0 },
    { device: 'Mobile', visitors: 3761, percentage: 30.0 },
    { device: 'Tablet', visitors: 1256, percentage: 10.0 },
  ]

  const timeRanges = [
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ]

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Analytics Dashboard</h2>
          <p className="text-gray-400">Monitor your website traffic and user engagement</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-dark-secondary/50 border border-dark-border rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={cn(
                'px-4 py-2 rounded text-sm font-medium transition-all duration-200',
                timeRange === range.value
                  ? 'bg-white text-dark-bg'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="text-blue-400" size={24} />
            </div>
            <span className="text-green-400 text-sm font-medium">+12.5%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Visitors</p>
          <p className="text-white text-3xl font-bold">{stats.totalVisitors.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Eye className="text-purple-400" size={24} />
            </div>
            <span className="text-green-400 text-sm font-medium">+8.3%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Page Views</p>
          <p className="text-white text-3xl font-bold">{stats.pageViews.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Clock className="text-green-400" size={24} />
            </div>
            <span className="text-green-400 text-sm font-medium">+5.2%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Avg. Session</p>
          <p className="text-white text-3xl font-bold">{stats.avgSessionDuration}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <MousePointer className="text-orange-400" size={24} />
            </div>
            <span className="text-red-400 text-sm font-medium">-3.1%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Bounce Rate</p>
          <p className="text-white text-3xl font-bold">{stats.bounceRate}</p>
        </div>
      </div>

      {/* Visitor Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Visitor Types</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">New Visitors</span>
                <span className="text-white font-bold">{stats.newVisitors.toLocaleString()}</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(stats.newVisitors / stats.totalVisitors) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Returning Visitors</span>
                <span className="text-white font-bold">{stats.returningVisitors.toLocaleString()}</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.returningVisitors / stats.totalVisitors) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {deviceStats.map((device) => (
              <div key={device.device}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{device.device}</span>
                  <span className="text-white font-bold">{device.percentage}%</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center gap-4 p-4 bg-dark-bg border border-dark-border rounded-lg"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{page.title}</p>
                  <p className="text-gray-400 text-sm">{page.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{page.views.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{page.avgTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{source.source}</span>
                  <div className="text-right">
                    <span className="text-white font-bold mr-2">{source.visitors.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">{source.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Blog Posts */}
      <div className="bg-dark-secondary/50 border border-dark-border rounded-xl p-6">
        <h3 className="text-xl font-heading font-bold text-white mb-4">Top Blog Posts</h3>
        <div className="space-y-3">
          {topBlogPosts.map((post, index) => (
            <div
              key={post.title}
              className="flex items-center gap-4 p-4 bg-dark-bg border border-dark-border rounded-lg"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{post.title}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Eye size={14} />
                    {post.views.toLocaleString()} views
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <TrendingUp size={14} />
                    {post.engagement} engagement
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

