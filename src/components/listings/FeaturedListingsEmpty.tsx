
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const FeaturedListingsEmpty = () => {
  return (
    <div className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Featured Listings</h2>
      <p className="text-gray-600 mb-6">No properties available at the moment.</p>
      <Button asChild>
        <Link to="/host">List Your Property</Link>
      </Button>
    </div>
  );
};
