
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MapPin, Star, Users, Wifi, Car, Coffee, Home, CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/Footer';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
      checkIfFavorited();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Add default data for demo
      const propertyWithDefaults = {
        ...data,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 200) + 50,
        images: data.images || ['/placeholder.svg'],
        amenities: data.amenities || ['WiFi', 'Kitchen', 'Parking']
      };

      setProperty(propertyWithDefaults);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorited = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();

      setIsFavorited(!!data);
    } catch (error) {
      // Not favorited
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        
        setIsFavorited(false);
        toast({
          title: "Removed from Favorites",
          description: "Property has been removed from your favorites.",
        });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: id
          });
        
        setIsFavorited(true);
        toast({
          title: "Added to Favorites",
          description: "Property has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite.",
        variant: "destructive"
      });
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive"
      });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing Information",
        description: "Please select check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }

    setBookingLoading(true);
    try {
      const totalPrice = property.price_per_night * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          listing_id: id,
          check_in_date: format(checkIn, 'yyyy-MM-dd'),
          check_out_date: format(checkOut, 'yyyy-MM-dd'),
          guests,
          total_price: totalPrice,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Successful!",
        description: "Your booking request has been submitted.",
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi": return <Wifi className="w-5 h-5" />;
      case "Parking": return <Car className="w-5 h-5" />;
      case "Kitchen": return <Coffee className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !property) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.price_per_night;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <Button asChild>
              <Link to="/search">Back to Search</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/search">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </Button>

        {/* Property Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{property.rating?.toFixed(1)}</span>
                <span className="ml-1">({property.reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1" />
                {property.location}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className="flex items-center space-x-2"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>

        {/* Property Image */}
        <div className="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-8">
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{property.max_guests} guests</span>
                </div>
                <div>{property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''}</div>
                <div>{property.bathrooms} bathroom{property.bathrooms > 1 ? 's' : ''}</div>
                <div className="capitalize">{property.property_type}</div>
              </div>
              
              {property.instant_book && (
                <Badge className="bg-green-600">Instant Book</Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">About this place</h3>
              <p className="text-gray-700">
                {property.description || 'Welcome to this beautiful property! Enjoy your stay in this comfortable and well-equipped space.'}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            {property.house_rules && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-3">House Rules</h3>
                  <p className="text-gray-700">{property.house_rules}</p>
                </div>
              </>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-2xl font-bold mb-4">
                  ${property.price_per_night} <span className="text-base font-normal text-gray-600">/ night</span>
                </div>

                <div className="space-y-4">
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Check-in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "MMM dd") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Check-out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, "MMM dd") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guest Selection */}
                  <div>
                    <label className="text-sm font-medium">Guests</label>
                    <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(property.max_guests)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Breakdown */}
                  {checkIn && checkOut && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>${property.price_per_night} x {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                      {property.cleaning_fee > 0 && (
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>${property.cleaning_fee}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${calculateTotalPrice() + (property.cleaning_fee || 0)}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleBooking} 
                    className="w-full"
                    disabled={bookingLoading || !checkIn || !checkOut}
                  >
                    {bookingLoading ? 'Booking...' : 'Reserve'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
