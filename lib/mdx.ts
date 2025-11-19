import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost } from '@/types'
import { calculateReadTime, generateExcerpt } from './utils'

const contentDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(contentDirectory)
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith('.mdx'))

  const allPosts = mdxFiles.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '')
    const fullPath = path.join(contentDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || generateExcerpt(content),
      content,
      coverImage: data.coverImage || '/blog/default-cover.jpg',
      date: data.date || new Date().toISOString(),
      readTime: data.readTime || calculateReadTime(content),
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      author: data.author || {
        name: 'Drefan Mardiawan',
        title: 'IT Expert | Big Data & AI Specialist',
        image: '/images/profile.jpg',
        bio: 'IT Expert with 17+ years of experience in Big Data, AI, and E-Government solutions.',
      },
    }
  })

  // Sort posts by date (newest first)
  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || 'Untitled',
    excerpt: data.excerpt || generateExcerpt(content),
    content,
    coverImage: data.coverImage || '/blog/default-cover.jpg',
    date: data.date || new Date().toISOString(),
    readTime: data.readTime || calculateReadTime(content),
    category: data.category || 'Uncategorized',
    tags: data.tags || [],
    author: data.author || {
      name: 'Drefan Mardiawan',
      title: 'IT Expert | Big Data & AI Specialist',
      image: '/images/profile.jpg',
      bio: 'IT Expert with 17+ years of experience in Big Data, AI, and E-Government solutions.',
    },
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
}

export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = new Set(allPosts.map((post) => post.category))
  return Array.from(categories).sort()
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts()
  const tags = new Set(allPosts.flatMap((post) => post.tags))
  return Array.from(tags).sort()
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []

  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug)

  // Score posts based on shared category and tags
  const scoredPosts = allPosts.map((post) => {
    let score = 0

    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 10
    }

    // Shared tags
    const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag))
    score += sharedTags.length * 2

    return { post, score }
  })

  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}
