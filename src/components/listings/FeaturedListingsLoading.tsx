
import React from 'react';
import { PropertyCardSkeleton } from '@/components/ui/loading-skeleton';

export const FeaturedListingsLoading = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
