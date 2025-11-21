import { getAllPosts } from '@/lib/mdx'
import BlogList from '@/components/blog/BlogList'

export const metadata = {
  title: 'Blog | Dref Labs',
  description: 'Articles on Big Data, AI, Cyber Security, and E-Government',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-4">
            Blog
          </h1>
          <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Insights on Big Data, AI, Cyber Security, and Digital Transformation
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <BlogList posts={posts} />
        )}
      </div>
    </div>
  )
}
