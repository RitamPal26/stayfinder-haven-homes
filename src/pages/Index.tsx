
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Wifi, Car, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { EnhancedSearchBar } from "@/components/search/EnhancedSearchBar";

const Index = () => {
  const featuredProperties = [
    {
      id: 1,
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      price: 200,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg",
      amenities: ["Wifi", "Kitchen", "Parking"]
    },
    {
      id: 2,
      title: "Beach House Paradise",
      location: "Malibu, California",
      price: 350,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg",
      amenities: ["Wifi", "Kitchen", "Pool"]
    },
    {
      id: 3,
      title: "Urban Loft Downtown",
      location: "New York, NY",
      price: 180,
      rating: 4.7,
      reviews: 203,
      image: "/placeholder.svg",
      amenities: ["Wifi", "Gym", "Workspace"]
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "Wifi": return <Wifi className="w-4 h-4" />;
      case "Parking": return <Car className="w-4 h-4" />;
      case "Kitchen": return <Coffee className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">StayFinder</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/favorites">
                <Button variant="ghost">Favorites</Button>
              </Link>
              <Link to="/host">
                <Button variant="ghost">Become a Host</Button>
              </Link>
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find your perfect stay
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Discover unique places to stay around the world
          </p>
          
          {/* Enhanced Search Form */}
          <EnhancedSearchBar />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Properties
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] bg-gray-200">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{property.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({property.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-gray-500">
                          {getAmenityIcon(amenity)}
                          <span className="text-xs ml-1">{amenity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">${property.price}</span>
                      <span className="text-gray-500">per night</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">StayFinder</h4>
              <p className="text-gray-400">Find your perfect stay anywhere in the world.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Hosting</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/host" className="hover:text-white">Become a Host</Link>
                </li>
                <li>Host Resources</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StayFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
