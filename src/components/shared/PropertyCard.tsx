
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Users, Wifi, Car, Coffee, Eye } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card 
      className={`group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col bg-white border-0 shadow-lg hover:-translate-y-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Image Container with Gradient Overlay */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <OptimizedImage 
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'} 
            alt={property.title}
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* View Details Button - Appears on Hover */}
          <Link 
            to={`/property/${property.id}`}
            className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-4'}`}
          >
            <Button 
              size="sm" 
              className="bg-white/90 backdrop-blur-md text-gray-800 hover:bg-white shadow-lg border-0 transform hover:scale-105 transition-all duration-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </Link>
        </div>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.instant_book && (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 shadow-lg animate-pulse">
              ⚡ Instant Book
            </Badge>
          )}
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1 shadow-lg capitalize">
            {property.property_type}
          </Badge>
        </div>
        
        {/* Enhanced Favorite Button */}
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-3 right-3 p-3 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-all duration-300 shadow-lg group/heart"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
              property.is_favorited 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-gray-600 group-hover/heart:text-red-500 group-hover/heart:scale-110'
            }`} 
          />
        </button>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col relative">
        {/* Price Badge */}
        <div className="absolute -top-4 right-4 bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] text-white px-4 py-2 rounded-full shadow-lg">
          <span className="text-lg font-bold">${property.price_per_night}</span>
          <span className="text-sm opacity-90"> / night</span>
        </div>

        <div className="flex-1 space-y-4 pt-2">
          {/* Title and Location */}
          <div>
            <Link to={`/property/${property.id}`}>
              <h3 className="font-bold text-xl leading-tight hover:text-[#FF5A5F] transition-colors line-clamp-2 mb-2">
                {truncateText(property.title, 60)}
              </h3>
            </Link>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-[#FF5A5F]" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>

          {/* Property Details with Icons */}
          <div className="flex items-center text-sm text-gray-600 flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <Users className="w-4 h-4 mr-1 text-[#FF5A5F]" />
              <span className="font-medium">{property.max_guests} guests</span>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <span className="font-medium">{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <span className="font-medium">{property.bathrooms} bath</span>
            </div>
          </div>

          {/* Enhanced Amenities */}
          <div className="flex items-center gap-3 overflow-hidden">
            {property.amenities?.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full">
                {getAmenityIcon(amenity)}
                <span className="ml-1 hidden sm:inline capitalize font-medium">{amenity}</span>
              </div>
            ))}
            {property.amenities && property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          {/* Enhanced Rating */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-bold text-gray-800">{property.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-sm text-gray-500 ml-1">({property.reviews || 0})</span>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Starting from</div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3 pt-4 mt-auto">
          {showCompareButton && onAddToComparison && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white transition-all duration-200 transform hover:scale-105"
              onClick={() => onAddToComparison(property.id)}
              disabled={comparisonList.includes(property.id)}
            >
              {comparisonList.includes(property.id) ? '✓ Added' : '⚖️ Compare'}
            </Button>
          )}
          <Link to={`/property/${property.id}`} className="flex-1">
            <Button 
              size="sm" 
              className="w-full text-xs bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] hover:from-[#FF385C] hover:to-[#E91E63] shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
