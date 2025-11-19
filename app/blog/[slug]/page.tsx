import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { getPostBySlug } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

// Temporarily disabled for deployment - js-yaml version conflict
// export async function generateStaticParams() {
//   const posts = getAllPosts()
//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Dref Labs`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
          </div>

          {/* Header */}
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeHighlight, rehypeSlug],
                },
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-dark-border">
              <h3 className="text-white font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          <div className="mt-12 p-6 rounded-xl border border-dark-border bg-dark-secondary/30">
            <div className="flex items-center gap-4">
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="text-white font-heading font-semibold">{post.author.name}</h3>
                <p className="text-gray-400 text-sm">{post.author.title}</p>
              </div>
            </div>
            <p className="text-gray-400 mt-4">{post.author.bio}</p>
            <Link href="/contact" className="inline-block mt-4">
              <span className="text-white hover:underline">Get in Touch →</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
