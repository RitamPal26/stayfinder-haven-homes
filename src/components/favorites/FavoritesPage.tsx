
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function FavoritesPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample favorites data for demonstration
  const sampleFavorites = [
    {
      id: '1',
      title: 'Luxury Beachfront Villa',
      location: 'Goa, India',
      price_per_night: 450,
      images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'],
      rating: 4.9,
      reviews: 127,
      property_type: 'villa'
    },
    {
      id: '2',
      title: 'Modern Downtown Apartment',
      location: 'Mumbai, India',
      price_per_night: 180,
      images: ['https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop'],
      rating: 4.7,
      reviews: 89,
      property_type: 'apartment'
    }
  ];

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // For demo, using sample data
      // In production: const { data } = await supabase.from('favorites').select('*, listings(*)').eq('user_id', user.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFavorites(sampleFavorites);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load favorites.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      // In production: await supabase.from('favorites').delete().eq('listing_id', propertyId).eq('user_id', user.id);
      setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
      toast({
        title: "Removed from Favorites",
        description: "Property has been removed from your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove favorite.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200"></div>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-gray-600">{favorites.length} saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring and save properties you love</p>
            <Link to="/search">
              <Button>Explore Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-200">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <Link to={`/property/${property.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>

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

                  <Link to={`/property/${property.id}`}>
                    <Button className="w-full mt-3">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
