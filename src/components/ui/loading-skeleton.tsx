
import { Skeleton } from "@/components/ui/skeleton";

export const PropertyCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
);

export const PropertyDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-6 space-y-2">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
      <div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SearchResultsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(9)].map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
);
