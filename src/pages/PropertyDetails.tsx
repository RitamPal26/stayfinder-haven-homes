import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Star, Users, Heart, Wifi, Car, Tv, Coffee, Bath, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/SEOHead";
import { PropertyDetailsSkeleton } from "@/components/ui/loading-skeleton";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { useAsyncError } from "@/hooks/useAsyncError";
import ErrorBoundary from "@/components/ui/error-boundary";

interface Listing {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  location: string;
  amenities: string[];
  images: string[];
  host_id: string;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { executeAsync, loading: asyncLoading } = useAsyncError();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sample listing data for demo
  const sampleListing: Listing = {
    id: "1",
    title: "Luxury Beachfront Villa with Infinity Pool",
    description: "Experience paradise in this stunning beachfront villa featuring panoramic ocean views, an infinity pool, and direct beach access. This architectural masterpiece combines modern luxury with tropical charm, offering the perfect escape for your dream vacation.",
    price_per_night: 450,
    location: "Goa, India",
    amenities: ["WiFi", "Pool", "Beach Access", "Kitchen", "Air Conditioning", "Parking", "TV", "Coffee Machine", "Bathroom Amenities", "Ocean View"],
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop"
    ],
    host_id: "host-1",
    created_at: new Date().toISOString()
  };

  const sampleReviews: Review[] = [
    {
      id: "1",
      rating: 5,
      comment: "Absolutely stunning property! The ocean views were breathtaking and the pool was perfect. Highly recommend!",
      created_at: "2024-05-15",
      user_id: "user-1"
    },
    {
      id: "2",
      rating: 5,
      comment: "Perfect getaway spot. The villa exceeded our expectations in every way. Will definitely be back!",
      created_at: "2024-05-10",
      user_id: "user-2"
    },
    {
      id: "3",
      rating: 4,
      comment: "Beautiful location and great amenities. Only minor issue was check-in timing, but overall excellent stay.",
      created_at: "2024-05-05",
      user_id: "user-3"
    }
  ];

  useEffect(() => {
    const loadProperty = async () => {
      setIsLoading(true);
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      setListing(sampleListing);
      setReviews(sampleReviews);
      setIsLoading(false);
    };

    loadProperty();
  }, [id]);

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      "WiFi": Wifi,
      "Parking": Car,
      "TV": Tv,
      "Coffee Machine": Coffee,
      "Bathroom Amenities": Bath,
      "Kitchen": Home,
      "Pool": Users,
      "Beach Access": MapPin,
      "Air Conditioning": CheckCircle,
      "Ocean View": Star
    };
    
    const IconComponent = iconMap[amenity] || CheckCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const subtotal = nights * (listing?.price_per_night || 0);
    const serviceFee = Math.round(subtotal * 0.14);
    const taxes = Math.round(subtotal * 0.12);
    return {
      nights,
      subtotal,
      serviceFee,
      taxes,
      total: subtotal + serviceFee + taxes
    };
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }

    const result = await executeAsync(
      async () => {
        setIsBooking(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
      },
      {
        successMessage: "Your reservation has been submitted successfully!",
        errorMessage: "Authentication required. Please sign in to book this property."
      }
    );

    setIsBooking(false);
    
    if (result) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <>
        <SEOHead title="Loading Property..." />
        <PropertyDetailsSkeleton />
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <SEOHead title="Property Not Found" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h1>
            <p className="text-gray-600">The property you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  const { nights, subtotal, serviceFee, taxes, total } = calculateTotal();

  return (
    <ErrorBoundary>
      <SEOHead 
        title={listing.title}
        description={listing.description}
        image={listing.images[0]}
        keywords={`${listing.location}, accommodation, booking, ${listing.amenities.join(', ')}`}
      />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 sticky top-0 bg-white z-50" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-[#FF5A5F]">StayFinder</h1>
              </div>
              <nav className="flex items-center space-x-4" role="navigation" aria-label="Main navigation">
                <Button variant="ghost" className="text-gray-700 hover:text-[#FF5A5F]">
                  Become a Host
                </Button>
                <Button variant="outline" className="border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white">
                  Sign Up
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
          {/* Property Title and Location */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center" role="img" aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}>
                <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="mx-1">·</span>
                <span>{reviews.length} reviews</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <section className="mb-8" aria-label="Property photos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <OptimizedImage 
                  src={listing.images[currentImageIndex]} 
                  alt={`${listing.title} - Main view`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {listing.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden">
                    <OptimizedImage 
                      src={image} 
                      alt={`${listing.title} - View ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Host Info */}
              <section className="flex items-center space-x-4 pb-6 border-b" aria-label="Host information">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hosted by Sarah</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                    <span>4.9 · 127 reviews · Superhost</span>
                  </div>
                </div>
              </section>

              {/* Description */}
              <section aria-label="Property description">
                <h2 className="text-xl font-semibold mb-4">About this place</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </section>

              {/* Amenities */}
              <section aria-label="Property amenities">
                <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4" role="list">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3" role="listitem">
                      {getAmenityIcon(amenity)}
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section aria-label="Guest reviews">
                <div className="flex items-center space-x-4 mb-6">
                  <Star className="h-6 w-6 fill-current text-yellow-400" />
                  <h3 className="text-xl font-semibold">
                    {averageRating.toFixed(1)} · {reviews.length} reviews
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Guest</p>
                          <p className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Booking Sidebar */}
            <aside className="lg:col-span-1" aria-label="Booking information">
              <Card className="sticky top-24 border shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold">₹{listing.price_per_night.toLocaleString()}</span>
                      <span className="text-gray-600"> night</span>
                    </div>
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current text-[#FF5A5F]' : 'text-gray-600'}`} />
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                    {/* Date Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="checkin" className="block text-xs font-semibold text-gray-700 mb-1">CHECK-IN</label>
                        <Input
                          id="checkin"
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="text-sm"
                          required
                          aria-describedby="checkin-help"
                        />
                      </div>
                      <div>
                        <label htmlFor="checkout" className="block text-xs font-semibold text-gray-700 mb-1">CHECK-OUT</label>
                        <Input
                          id="checkout"
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="text-sm"
                          required
                          aria-describedby="checkout-help"
                        />
                      </div>
                    </div>

                    {/* Guest Counter */}
                    <fieldset>
                      <legend className="block text-xs font-semibold text-gray-700 mb-2">GUESTS</legend>
                      <div className="space-y-3 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Adults</span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400"
                            >
                              -
                            </button>
                            <span className="font-medium">{adults}</span>
                            <button
                              onClick={() => setAdults(adults + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Children</span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400"
                            >
                              -
                            </button>
                            <span className="font-medium">{children}</span>
                            <button
                              onClick={() => setChildren(children + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Infants</span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setInfants(Math.max(0, infants - 1))}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400"
                            >
                              -
                            </button>
                            <span className="font-medium">{infants}</span>
                            <button
                              onClick={() => setInfants(infants + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    {/* Reserve Button */}
                    <Button
                      type="submit"
                      disabled={isBooking || !checkIn || !checkOut}
                      className="w-full bg-[#FF5A5F] hover:bg-[#E04E53] text-white py-3 font-semibold text-lg"
                      aria-describedby="booking-help"
                    >
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "Reserve"
                      )}
                    </Button>

                    {/* Price Breakdown */}
                    {nights > 0 && (
                      <div className="space-y-3 pt-4 border-t" aria-label="Price breakdown">
                        <div className="flex justify-between text-sm">
                          <span>₹{listing.price_per_night.toLocaleString()} x {nights} nights</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Service fee</span>
                          <span>₹{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxes</span>
                          <span>₹{taxes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base pt-3 border-t">
                          <span>Total</span>
                          <span>₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </aside>
          </div>
        </main>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-slide-in-right">
            <SuccessAnimation />
            <span className="text-green-700 font-medium">Booking confirmed!</span>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default PropertyDetails;
