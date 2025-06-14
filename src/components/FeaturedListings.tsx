
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

export const FeaturedListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_available', true)
        .limit(6);

      if (error) throw error;

      // Transform data to include default rating and review count
      const propertiesWithDefaults = (data || []).map(property => ({
        ...property,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviews: Math.floor(Math.random() * 200) + 50, // Random review count 50-250
        is_favorited: false,
        images: property.images || ['/placeholder.svg']
      }));

      setProperties(propertiesWithDefaults);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load featured properties.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already favorited
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', propertyId)
        .single();

      if (existingFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', propertyId);
        
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, is_favorited: false } : p
        ));
        
        toast({
          title: "Removed from Favorites",
          description: "Property has been removed from your favorites.",
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: propertyId
          });
        
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, is_favorited: true } : p
        ));
        
        toast({
          title: "Added to Favorites",
          description: "Property has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Featured Listings</h2>
        <p className="text-gray-600 mb-6">No properties available at the moment.</p>
        <Button asChild>
          <Link to="/host">List Your Property</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
        <p className="text-gray-600">Discover amazing places to stay around the world</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-200">
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={() => handleToggleFavorite(property.id)}
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
                </div>

                {/* Rating and Price */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{property.rating?.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 ml-1">({property.reviews})</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xl font-bold">${property.price_per_night}</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>
                </div>

                {/* View Details Button */}
                <Link to={`/property/${property.id}`} className="block pt-2">
                  <Button className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
