'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Star, Download, MessageSquare, Calendar, Code2, Filter, Github } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ScrollReveal from '@/components/animations/ScrollReveal'
import repositories from '@/content/data/repositories.json'

const categories = ['All', 'Artificial Intelligence', 'Big Data', 'Cyber Security', 'E-Government']
const languages = ['All', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Go']

export default function OpenSourcePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [sortBy, setSortBy] = useState<'stars' | 'downloads' | 'updated'>('stars')

  const filteredRepos = useMemo(() => {
    const filtered = repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || repo.category === selectedCategory
      const matchesLanguage = selectedLanguage === 'All' || repo.language === selectedLanguage

      return matchesSearch && matchesCategory && matchesLanguage
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars
      if (sortBy === 'downloads') return b.downloads - a.downloads
      if (sortBy === 'updated')
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      return 0
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedLanguage, sortBy])

  const totalStats = useMemo(() => {
    return {
      repositories: repositories.length,
      stars: repositories.reduce((sum, repo) => sum + repo.stars, 0),
      downloads: repositories.reduce((sum, repo) => sum + repo.downloads, 0),
      contributors: 15, // Static for now
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Open Source Projects</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              Code for <span className="gradient-text">Public Good</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Professional open source projects dedicated to government digital transformation,
              data analytics, and cyber security. Free to use, modify, and distribute.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Repositories', value: totalStats.repositories, icon: Code2 },
                { label: 'Total Stars', value: totalStats.stars, icon: Star },
                { label: 'Downloads', value: totalStats.downloads.toLocaleString(), icon: Download },
                { label: 'Contributors', value: totalStats.contributors, icon: Github },
              ].map((stat, index) => (
                <Card key={index} hover glow>
                  <CardContent className="text-center py-6">
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal>
          <Card className="mb-12">
            <CardContent className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search repositories, tags, or technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Category & Language Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Filter className="inline w-4 h-4 mr-1" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Code2 className="inline w-4 h-4 mr-1" />
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'stars' | 'downloads' | 'updated')}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="stars">Most Stars</option>
                    <option value="downloads">Most Downloads</option>
                    <option value="updated">Recently Updated</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-400">
                Showing {filteredRepos.length} of {repositories.length} repositories
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRepos.map((repo, index) => (
            <ScrollReveal key={repo.id} delay={index * 0.1}>
              <Card hover glow className="h-full">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        href={`/opensource/${repo.slug}`}
                        className="text-xl font-bold text-white hover:text-primary transition-colors"
                      >
                        {repo.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary">
                          {repo.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                          {repo.language}
                        </span>
                        <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
                          {repo.license}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 line-clamp-2">{repo.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                    {repo.tags.length > 5 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{repo.tags.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{repo.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{repo.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>v{repo.version}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href={`/opensource/${repo.slug}`} className="flex-1">
                      <Button variant="primary" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {repo.githubUrl && (
                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Button variant="outline" className="px-4">
                          <Github className="w-5 h-5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* No results */}
        {filteredRepos.length === 0 && (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No repositories found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

