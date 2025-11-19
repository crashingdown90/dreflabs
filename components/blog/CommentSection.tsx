'use client'

import { useState } from 'react'
import { MessageSquare, Send, User, Calendar } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Comment {
  id: string
  author: string
  email: string
  content: string
  createdAt: string
}

interface Props {
  postSlug: string
}

export default function CommentSection({ postSlug: _postSlug }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: name,
        email,
        content,
        createdAt: new Date().toISOString(),
      }

      setComments([newComment, ...comments])
      setName('')
      setEmail('')
      setContent('')
      setIsSubmitting(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Leave a Comment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                Comment *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Share your thoughts..."
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-white">{comment.author}</span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Comments */}
      {comments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No comments yet</h3>
            <p className="text-gray-400">Be the first to share your thoughts!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

