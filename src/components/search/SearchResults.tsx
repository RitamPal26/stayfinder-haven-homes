
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Grid3X3, List, MapPin, Star, Users, Wifi, Car, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi": return <Wifi className="w-4 h-4" />;
      case "Parking": return <Car className="w-4 h-4" />;
      case "Kitchen": return <Coffee className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
        : "space-y-4"
      }>
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className={`bg-gray-200 ${viewMode === 'grid' ? 'aspect-[4/3]' : 'aspect-[3/2] md:aspect-[4/3] lg:aspect-[3/2]'}`}>
                <img 
                  src={property.images[0] || '/placeholder.svg'} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {property.instant_book && (
                  <Badge className="bg-green-600">Instant Book</Badge>
                )}
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={() => onToggleFavorite(property.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 ${property.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                {/* Title and Location */}
                <div>
                  <Link to={`/property/${property.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                  </Link>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="capitalize">{property.property_type}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {property.max_guests} guests
                  </div>
                  <span>•</span>
                  <span>{property.bedrooms} bed</span>
                  <span>•</span>
                  <span>{property.bathrooms} bath</span>
                </div>

                {/* Amenities */}
                <div className="flex items-center space-x-3">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-500">
                      {getAmenityIcon(amenity)}
                      <span className="text-xs ml-1">{amenity}</span>
                    </div>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">+{property.amenities.length - 3} more</span>
                  )}
                </div>

                {/* Rating and Price */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{property.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({property.reviews})</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xl font-bold">${property.price_per_night}</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onAddToComparison(property.id)}
                    disabled={comparisonList.includes(property.id)}
                  >
                    {comparisonList.includes(property.id) ? 'Added to Compare' : 'Compare'}
                  </Button>
                  <Link to={`/property/${property.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
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
