'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  Download,
  MessageSquare,
  Calendar,
  Code2,
  Github,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Package,
  Terminal,
  Shield,
} from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ScrollReveal from '@/components/animations/ScrollReveal'
import CommentSection from '@/components/blog/CommentSection'

interface Repository {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  category: string
  tags: string[]
  language: string
  stars: number
  downloads: number
  comments: number
  license: string
  version: string
  lastUpdated: string
  createdDate: string
  githubUrl: string
  demoUrl: string | null
  downloadUrl: string
  coverImage: string
  screenshots?: string[]
  features: string[]
  techStack: Array<{ name: string; purpose: string }>
  installation: string
  usage: string
  documentation: string
  codePreview: {
    file: string
    language: string
    code: string
  }
}

interface Props {
  repository: Repository
}

export default function RepositoryDetail({ repository }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'installation'>('overview')
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedUsage, setCopiedUsage] = useState(false)

  const copyToClipboard = (text: string, type: 'install' | 'usage') => {
    navigator.clipboard.writeText(text)
    if (type === 'install') {
      setCopiedInstall(true)
      setTimeout(() => setCopiedInstall(false), 2000)
    } else {
      setCopiedUsage(true)
      setTimeout(() => setCopiedUsage(false), 2000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-dark-bg py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <ScrollReveal>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/opensource" className="hover:text-primary transition-colors">
              Open Source
            </Link>
            <span>/</span>
            <span className="text-white">{repository.name}</span>
          </div>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal>
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                  {repository.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-6">
                  {repository.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
                    {repository.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">
                    {repository.language}
                  </span>
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {repository.license}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
                    v{repository.version}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-white">{repository.stars}</span>
                    <span className="text-sm">stars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-white">
                      {repository.downloads.toLocaleString()}
                    </span>
                    <span className="text-sm">downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-white">{repository.comments}</span>
                    <span className="text-sm">comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">Updated {formatDate(repository.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <a href={repository.downloadUrl} download>
                <Button variant="primary" className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download ZIP
                </Button>
              </a>
              {repository.githubUrl && (
                <a href={repository.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    View on GitHub
                  </Button>
                </a>
              )}
              {repository.demoUrl && (
                <a href={repository.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </Button>
                </a>
              )}
              <a href={repository.documentation} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Documentation
                </Button>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal>
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'code', label: 'Code Preview', icon: Code2 },
              { id: 'installation', label: 'Installation', icon: Terminal },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'code' | 'installation')}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <ScrollReveal>
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {repository.longDescription}
                    </p>

                    <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                    <ul className="space-y-3 mb-6">
                      {repository.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-300">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-bold text-white mb-4">Technology Stack</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {repository.techStack.map((tech, index) => (
                        <div
                          key={index}
                          className="p-4 bg-dark-bg border border-gray-700 rounded-lg"
                        >
                          <div className="font-semibold text-white mb-1">{tech.name}</div>
                          <div className="text-sm text-gray-400">{tech.purpose}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Code Preview Tab */}
            {activeTab === 'code' && (
              <ScrollReveal>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">Code Preview</h2>
                      <span className="text-sm text-gray-400">{repository.codePreview.file}</span>
                    </div>
                    <div className="bg-dark-bg border border-gray-700 rounded-lg overflow-hidden">
                      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {repository.codePreview.language}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(repository.codePreview.code, 'install')
                          }
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedInstall ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-gray-300 font-mono">
                          {repository.codePreview.code}
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Installation Tab */}
            {activeTab === 'installation' && (
              <ScrollReveal>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Installation Guide</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          Installation
                        </h3>
                        <div className="bg-dark-bg border border-gray-700 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                            <span className="text-sm text-gray-400">bash</span>
                            <button
                              onClick={() => copyToClipboard(repository.installation, 'install')}
                              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                              {copiedInstall ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm text-green-400 font-mono">
                              {repository.installation}
                            </code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-primary" />
                          Usage
                        </h3>
                        <div className="bg-dark-bg border border-gray-700 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                            <span className="text-sm text-gray-400">bash</span>
                            <button
                              onClick={() => copyToClipboard(repository.usage, 'usage')}
                              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                              {copiedUsage ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-sm text-green-400 font-mono">
                              {repository.usage}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Comments Section */}
            <ScrollReveal>
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Comments & Discussion</h2>
                <CommentSection postSlug={repository.slug} />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Tags */}
              <ScrollReveal>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {repository.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-dark-bg border border-gray-700 rounded-full text-sm text-gray-300 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Repository Info */}
              <ScrollReveal>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Repository Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Version</span>
                        <span className="text-white font-semibold">{repository.version}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">License</span>
                        <span className="text-white">{repository.license}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Language</span>
                        <span className="text-white">{repository.language}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Created</span>
                        <span className="text-white">{formatDate(repository.createdDate)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white">{formatDate(repository.lastUpdated)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Quick Links */}
              <ScrollReveal>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                    <div className="space-y-2">
                      <a
                        href={repository.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Documentation
                      </a>
                      {repository.githubUrl && (
                        <a
                          href={repository.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub Repository
                        </a>
                      )}
                      {repository.demoUrl && (
                        <a
                          href={repository.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

