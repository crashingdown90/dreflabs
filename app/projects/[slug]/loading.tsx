import Card from '@/components/ui/Card'

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-32 bg-dark-tertiary rounded animate-pulse mb-6" />
          <div className="h-12 w-full bg-dark-tertiary rounded animate-pulse mb-4" />
          <div className="h-6 w-3/4 bg-dark-tertiary rounded animate-pulse mb-6" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Featured image skeleton */}
        <div className="aspect-video bg-dark-tertiary rounded-xl animate-pulse mb-12" />

        {/* Project details skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6">
            <div className="h-4 w-16 bg-dark-tertiary rounded animate-pulse mb-2" />
            <div className="h-6 w-24 bg-dark-tertiary rounded animate-pulse" />
          </Card>
          <Card className="p-6">
            <div className="h-4 w-16 bg-dark-tertiary rounded animate-pulse mb-2" />
            <div className="h-6 w-24 bg-dark-tertiary rounded animate-pulse" />
          </Card>
          <Card className="p-6">
            <div className="h-4 w-16 bg-dark-tertiary rounded animate-pulse mb-2" />
            <div className="h-6 w-24 bg-dark-tertiary rounded animate-pulse" />
          </Card>
        </div>

        {/* Content skeleton */}
        <Card className="p-8">
          <div className="space-y-4">
            <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
            <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-dark-tertiary rounded animate-pulse" />
            <div className="h-32 w-full bg-dark-tertiary rounded-lg animate-pulse my-8" />
            <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-dark-tertiary rounded animate-pulse" />
          </div>
        </Card>
      </div>
    </div>
  )
}
