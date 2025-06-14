
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List } from "lucide-react";
import { PropertyCard } from '@/components/shared/PropertyCard';
import { PropertyCardSkeleton } from '@/components/ui/loading-skeleton';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_night: number;
  images: string[];
  property_type: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  instant_book: boolean;
  rating: number;
  reviews: number;
  is_favorited?: boolean;
}

interface SearchResultsProps {
  properties: Property[];
  loading: boolean;
  totalCount: number;
  onToggleFavorite: (propertyId: string) => void;
  onAddToComparison: (propertyId: string) => void;
  comparisonList: string[];
}

export function SearchResults({ 
  properties, 
  loading, 
  totalCount, 
  onToggleFavorite, 
  onAddToComparison,
  comparisonList 
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {totalCount} properties found
        </h2>
        
        <div className="flex items-center space-x-4">
          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "grid grid-cols-1 gap-4"
      }>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onToggleFavorite={onToggleFavorite}
            onAddToComparison={onAddToComparison}
            comparisonList={comparisonList}
            showCompareButton={true}
            className={viewMode === 'list' ? 'md:flex-row md:h-64' : ''}
          />
        ))}
      </div>

      {/* Load More */}
      {properties.length < totalCount && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  );
}
