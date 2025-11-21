import Card, { CardContent } from '@/components/ui/Card'

export default function AssessmentsLoading() {
  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-96 bg-dark-tertiary rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-dark-tertiary rounded animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Card key={i} className="p-4">
              <CardContent className="p-0">
                <div className="h-4 w-16 bg-dark-tertiary rounded animate-pulse mb-1" />
                <div className="h-8 w-12 bg-dark-tertiary rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assessments list skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-48 bg-dark-tertiary rounded animate-pulse" />
                      <div className="h-6 w-16 bg-dark-tertiary rounded-full animate-pulse" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 w-32 bg-dark-tertiary rounded animate-pulse" />
                      <div className="h-4 w-32 bg-dark-tertiary rounded animate-pulse" />
                      <div className="h-4 w-32 bg-dark-tertiary rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-full bg-dark-tertiary rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-dark-tertiary rounded animate-pulse" />
                    <div className="flex gap-3">
                      <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
                      <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
                      <div className="h-6 w-20 bg-dark-tertiary rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-dark-tertiary rounded animate-pulse" />
                    <div className="h-10 w-32 bg-dark-tertiary rounded-lg animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
