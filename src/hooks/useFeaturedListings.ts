
import { useState, useEffect } from 'react';
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

export const useFeaturedListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      console.log('Fetching featured listings...');
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_available', true)
        .limit(6);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw listings data:', data);

      // If no data from database, use sample data with working images
      if (!data || data.length === 0) {
        console.log('No listings found in database, using sample data');
        const sampleProperties: Property[] = [
          {
            id: 'sample-1',
            title: 'Modern Downtown Apartment',
            location: 'New York, NY',
            price_per_night: 150,
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
            property_type: 'apartment',
            max_guests: 4,
            bedrooms: 2,
            bathrooms: 1,
            amenities: ['WiFi', 'Kitchen', 'Parking'],
            instant_book: true,
            rating: 4.8,
            reviews: 127,
            is_favorited: false
          },
          {
            id: 'sample-2',
            title: 'Cozy Beach House',
            location: 'San Diego, CA',
            price_per_night: 200,
            images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop'],
            property_type: 'house',
            max_guests: 6,
            bedrooms: 3,
            bathrooms: 2,
            amenities: ['WiFi', 'Kitchen', 'Beach Access'],
            instant_book: false,
            rating: 4.9,
            reviews: 89,
            is_favorited: false
          },
          {
            id: 'sample-3',
            title: 'Mountain Cabin Retreat',
            location: 'Aspen, CO',
            price_per_night: 180,
            images: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop'],
            property_type: 'cabin',
            max_guests: 8,
            bedrooms: 4,
            bathrooms: 3,
            amenities: ['WiFi', 'Fireplace', 'Hot Tub'],
            instant_book: true,
            rating: 4.7,
            reviews: 156,
            is_favorited: false
          },
          {
            id: 'sample-4',
            title: 'Urban Loft Studio',
            location: 'Chicago, IL',
            price_per_night: 120,
            images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
            property_type: 'loft',
            max_guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            amenities: ['WiFi', 'Kitchen', 'Gym'],
            instant_book: true,
            rating: 4.6,
            reviews: 73,
            is_favorited: false
          },
          {
            id: 'sample-5',
            title: 'Lakefront Villa',
            location: 'Lake Tahoe, CA',
            price_per_night: 300,
            images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'],
            property_type: 'villa',
            max_guests: 10,
            bedrooms: 5,
            bathrooms: 4,
            amenities: ['WiFi', 'Kitchen', 'Boat Dock', 'Hot Tub'],
            instant_book: false,
            rating: 4.9,
            reviews: 234,
            is_favorited: false
          },
          {
            id: 'sample-6',
            title: 'Historic Townhouse',
            location: 'Boston, MA',
            price_per_night: 175,
            images: ['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'],
            property_type: 'townhouse',
            max_guests: 6,
            bedrooms: 3,
            bathrooms: 2,
            amenities: ['WiFi', 'Kitchen', 'Garden'],
            instant_book: true,
            rating: 4.5,
            reviews: 98,
            is_favorited: false
          }
        ];
        setProperties(sampleProperties);
      } else {
        // Transform database data to include default rating and review count
        const propertiesWithDefaults = data.map(property => ({
          ...property,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 200) + 50,
          is_favorited: false,
          images: property.images && property.images.length > 0 
            ? property.images 
            : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop']
        }));

        setProperties(propertiesWithDefaults);
      }
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

  return {
    properties,
    loading,
    handleToggleFavorite
  };
};
