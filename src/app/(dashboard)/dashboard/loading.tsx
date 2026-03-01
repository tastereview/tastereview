import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Score card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-2 pb-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </CardContent>
        </Card>

        {/* Summary card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-2 pb-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
            <div className="border-t" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-6 w-8" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-8 ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2 pb-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                {i > 1 && <div className="border-t mb-4" />}
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-16 flex-1" />
                  <Skeleton className="h-8 w-10" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feedback list placeholder */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
