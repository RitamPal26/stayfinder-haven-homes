import { useState } from "react";
import { Search, Heart, Star, Users, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const properties = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Goa, India",
    price: 8500,
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Modern City Apartment",
    location: "Mumbai, India",
    price: 4200,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Cozy Mountain Retreat",
    location: "Manali, India",
    price: 3800,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Tech Hub Studio",
    location: "Bangalore, India",
    price: 3200,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Heritage Haveli",
    location: "Jaipur, India",
    price: 5600,
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Backwater Bungalow",
    location: "Kerala, India",
    price: 4800,
    rating: 4.9,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Desert Camp Experience",
    location: "Rajasthan, India",
    price: 6200,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Hill Station Cottage",
    location: "Shimla, India",
    price: 3600,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=500&h=300&fit=crop"
  }
];

const Index = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#FF5A5F]">StayFinder</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find your perfect
              <span className="text-[#FF5A5F]"> stay</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover unique accommodations around the world. Book memorable experiences with local hosts.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <div className="p-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Where
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search destinations"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="border-0 pl-6 text-sm font-medium placeholder:text-gray-400 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Check in
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="border-0 pl-6 text-sm font-medium focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Check out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="border-0 pl-6 text-sm font-medium focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Who
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1">
                        <Users className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Add guests"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="border-0 pl-6 text-sm font-medium placeholder:text-gray-400 focus-visible:ring-0"
                        />
                      </div>
                      <Button className="ml-4 bg-[#FF5A5F] hover:bg-[#E04E53] text-white rounded-full h-12 w-12 p-0">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured stays
            </h3>
            <p className="text-lg text-gray-600">
              Handpicked properties loved by travelers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Link to={`/property/${property.id}`} key={property.id}>
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(property.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(property.id) 
                            ? 'fill-[#FF5A5F] text-[#FF5A5F]' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {property.title}
                      </h4>
                      <div className="flex items-center ml-2">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span className="text-xs font-medium text-gray-700 ml-1">
                          {property.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">{property.location}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm"> night</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {property.reviews} reviews
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Safety information</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Cancellation options</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Report concerns</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Community</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">StayFinder.org</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Diversity & belonging</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Frontline stays</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Hosting</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Become a Host</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Host your home</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Host resources</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Community forum</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">StayFinder</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Newsroom</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Learn about new features</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#FF5A5F] transition-colors">Investors</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2024 StayFinder, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#FF5A5F] transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF5A5F] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF5A5F] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
