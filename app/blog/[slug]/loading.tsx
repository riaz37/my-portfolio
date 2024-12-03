import { Skeleton } from "@/components/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="relative w-full h-[60vh] bg-muted/20">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        <div className="container relative h-full">
          <div className="absolute bottom-8 w-full max-w-3xl space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container px-4 -mt-20">
        <div className="relative max-w-3xl mx-auto">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-64 w-full" />
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i + 6} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
