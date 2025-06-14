
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

  return {
    properties,
    loading,
    handleToggleFavorite
  };
};
