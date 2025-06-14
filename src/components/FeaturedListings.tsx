
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { FeaturedListingsLoading } from '@/components/listings/FeaturedListingsLoading';
import { FeaturedListingsEmpty } from '@/components/listings/FeaturedListingsEmpty';
import { useFeaturedListings } from '@/hooks/useFeaturedListings';

export const FeaturedListings = () => {
  const { properties, loading, handleToggleFavorite } = useFeaturedListings();

  if (loading) {
    return <FeaturedListingsLoading />;
  }

  if (properties.length === 0) {
    return <FeaturedListingsEmpty />;
  }

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
        <p className="text-gray-600">Discover amazing places to stay around the world</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link to="/search">View All Properties</Link>
        </Button>
      </div>
    </div>
  );
};
