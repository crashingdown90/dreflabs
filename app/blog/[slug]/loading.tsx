export default function BlogPostLoading() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-32 bg-dark-tertiary rounded animate-pulse mb-6" />
          <div className="h-12 w-full bg-dark-tertiary rounded animate-pulse mb-4" />
          <div className="h-6 w-3/4 bg-dark-tertiary rounded animate-pulse mb-6" />
          <div className="flex gap-4 mb-6">
            <div className="h-5 w-32 bg-dark-tertiary rounded animate-pulse" />
            <div className="h-5 w-32 bg-dark-tertiary rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Featured image skeleton */}
        <div className="aspect-video bg-dark-tertiary rounded-xl animate-pulse mb-12" />

        {/* Content skeleton */}
        <div className="prose prose-invert max-w-none space-y-4">
          <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
          <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-dark-tertiary rounded animate-pulse" />
          <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-dark-tertiary rounded animate-pulse" />
          <div className="h-32 w-full bg-dark-tertiary rounded-lg animate-pulse my-8" />
          <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
          <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-dark-tertiary rounded animate-pulse" />
        </div>
      </article>
    </div>
  )
}
