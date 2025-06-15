
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Coffee,
  Star,
  Heart,
  Share2
} from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { PropertyBooking } from "@/components/PropertyBooking";
import { supabase } from '@/integrations/supabase/client';

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  cleaning_fee: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  host_id: string;
  instant_book?: boolean | null;
  profiles?: {
    username: string;
  };
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            profiles(username)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching listing:', error);
        } else {
          setListing(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (!id) {
    return <Navigate to="/search" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center'];

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Coffee,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden">
              <OptimizedImage
                src={images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{listing.max_guests} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{listing.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{listing.bathrooms} bathrooms</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Hosted by {listing.profiles?.username || 'Host'}</h3>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.8 · 127 reviews</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">
                {listing.description || 'This beautiful property offers a comfortable and memorable stay.'}
              </p>
            </div>

            {listing.amenities && listing.amenities.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Coffee;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <PropertyBooking
            listingId={listing.id}
            pricePerNight={listing.price_per_night}
            cleaningFee={listing.cleaning_fee}
            maxGuests={listing.max_guests}
            instantBook={listing.instant_book ?? false}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
