'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'
import Card, { CardContent, CardFooter } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SearchBar from '@/components/blog/SearchBar'
import CategoryFilter from '@/components/blog/CategoryFilter'
import { formatDate } from '@/lib/utils'

interface Post {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  date: string
  category: string
  tags: string[]
  readTime: number
}

interface BlogListProps {
  posts: Post[]
}

export default function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = posts.map(post => post.category)
    return Array.from(new Set(cats))
  }, [posts])

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Category filter
      if (selectedCategory && post.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = post.title.toLowerCase().includes(query)
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query)
        const matchesTags = post.tags?.some(tag => tag.toLowerCase().includes(query))
        const matchesCategory = post.category.toLowerCase().includes(query)

        return matchesTitle || matchesExcerpt || matchesTags || matchesCategory
      }

      return true
    })
  }, [posts, searchQuery, selectedCategory])

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-12 space-y-6">
        <SearchBar 
          onSearch={setSearchQuery} 
          placeholder="Search by title, content, or tags..."
        />
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory) && (
        <div className="mb-6">
          <p className="text-gray-400">
            Found <span className="text-white font-semibold">{filteredPosts.length}</span> article{filteredPosts.length !== 1 ? 's' : ''}
            {searchQuery && (
              <span> matching "<span className="text-white">{searchQuery}</span>"</span>
            )}
            {selectedCategory && (
              <span> in <span className="text-white">{selectedCategory}</span></span>
            )}
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No articles found</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card hover glow className="h-full group">
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-xl">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent opacity-60"></div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <span className="text-white text-sm font-medium group-hover:underline">
                    Read More →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
