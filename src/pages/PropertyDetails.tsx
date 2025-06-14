
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Star, Users, Heart, Wifi, Car, Tv, Coffee, Bath, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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
    // For demo purposes, using sample data
    setListing(sampleListing);
    setReviews(sampleReviews);
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

    setIsBooking(true);
    try {
      // Simulate booking process - in real implementation this would save to database
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Booking Confirmed!",
        description: "Your reservation has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Authentication required. Please sign in to book this property.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const { nights, subtotal, serviceFee, taxes, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#FF5A5F]">StayFinder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-[#FF5A5F]">
                Become a Host
              </Button>
              <Button variant="outline" className="border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Title and Location */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
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
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img 
                src={listing.images[currentImageIndex]} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {listing.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${listing.title} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setCurrentImageIndex(index + 1)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Thumbnail Navigation */}
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {listing.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  currentImageIndex === index ? 'border-[#FF5A5F]' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center space-x-4 pb-6 border-b">
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
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
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
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
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
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current text-[#FF5A5F]' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Date Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CHECK-IN</label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CHECK-OUT</label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Guest Counter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">GUESTS</label>
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
                  </div>

                  {/* Reserve Button */}
                  <Button
                    onClick={handleBooking}
                    disabled={isBooking || !checkIn || !checkOut}
                    className="w-full bg-[#FF5A5F] hover:bg-[#E04E53] text-white py-3 font-semibold text-lg"
                  >
                    {isBooking ? "Processing..." : "Reserve"}
                  </Button>

                  {/* Price Breakdown */}
                  {nights > 0 && (
                    <div className="space-y-3 pt-4 border-t">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
