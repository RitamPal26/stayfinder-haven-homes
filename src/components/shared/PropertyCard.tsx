
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Users, Wifi, Car, Coffee } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

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
  rating?: number;
  reviews?: number;
  is_favorited?: boolean;
}

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (propertyId: string) => void;
  onAddToComparison?: (propertyId: string) => void;
  comparisonList?: string[];
  showCompareButton?: boolean;
  className?: string;
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case "wifi": return <Wifi className="w-3 h-3" />;
    case "parking": return <Car className="w-3 h-3" />;
    case "kitchen": return <Coffee className="w-3 h-3" />;
    default: return <Wifi className="w-3 h-3" />;
  }
};

export const PropertyCard = ({ 
  property, 
  onToggleFavorite, 
  onAddToComparison,
  comparisonList = [],
  showCompareButton = false,
  className = ""
}: PropertyCardProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col ${className}`}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <OptimizedImage 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {property.instant_book && (
            <Badge className="bg-green-600 text-white text-xs">Instant Book</Badge>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 ${property.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          {/* Title and Location */}
          <div>
            <Link to={`/property/${property.id}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                {truncateText(property.title, 60)}
              </h3>
            </Link>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center text-sm text-gray-600 flex-wrap gap-x-2 gap-y-1">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
              {property.property_type}
            </span>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{property.max_guests}</span>
            </div>
            <span>•</span>
            <span>{property.bedrooms} bed</span>
            <span>•</span>
            <span>{property.bathrooms} bath</span>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-3 overflow-hidden">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center text-gray-500 text-xs">
                {getAmenityIcon(amenity)}
                <span className="ml-1 hidden sm:inline">{amenity}</span>
              </div>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{property.amenities.length - 3}</span>
            )}
          </div>

          {/* Rating and Price */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{property.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-sm text-gray-500 ml-1">({property.reviews || 0})</span>
            </div>
            
            <div className="text-right">
              <span className="text-xl font-bold">${property.price_per_night}</span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 mt-auto">
          {showCompareButton && onAddToComparison && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => onAddToComparison(property.id)}
              disabled={comparisonList.includes(property.id)}
            >
              {comparisonList.includes(property.id) ? 'Added' : 'Compare'}
            </Button>
          )}
          <Link to={`/property/${property.id}`} className="flex-1">
            <Button size="sm" className="w-full text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
