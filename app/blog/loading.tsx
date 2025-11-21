import Card from '@/components/ui/Card'

export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-12 w-48 bg-dark-tertiary rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-dark-tertiary rounded-lg mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-dark-tertiary animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-4 w-20 bg-dark-tertiary rounded animate-pulse" />
                <div className="h-6 w-full bg-dark-tertiary rounded animate-pulse" />
                <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-dark-tertiary rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-dark-tertiary rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-dark-tertiary rounded-full animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
