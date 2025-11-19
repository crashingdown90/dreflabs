import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Card, { CardContent, CardFooter } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getAllPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'

export default function RecentPosts() {
  const recentPosts = getAllPosts().slice(0, 3)

  if (recentPosts.length === 0) {
    return null
  }

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Recent Articles
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Insights on big data, AI, cyber security, and digital transformation
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentPosts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 0.1}>
              <Link href={`/blog/${post.slug}`}>
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
                    <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3">{post.excerpt}</p>
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
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline">
                View All Articles
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
