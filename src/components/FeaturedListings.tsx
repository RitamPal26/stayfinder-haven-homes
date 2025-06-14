
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockListings = [
  {
    id: '1',
    title: 'Cozy Downtown Apartment',
    location: 'New York, NY',
    price: 150,
    rating: 4.8,
    reviews: 124,
    image: '/placeholder.svg',
    type: 'Apartment'
  },
  {
    id: '2',
    title: 'Beachfront Villa',
    location: 'Miami, FL',
    price: 350,
    rating: 4.9,
    reviews: 89,
    image: '/placeholder.svg',
    type: 'Villa'
  },
  {
    id: '3',
    title: 'Mountain Cabin Retreat',
    location: 'Aspen, CO',
    price: 200,
    rating: 4.7,
    reviews: 56,
    image: '/placeholder.svg',
    type: 'Cabin'
  },
  {
    id: '4',
    title: 'Modern City Loft',
    location: 'San Francisco, CA',
    price: 180,
    rating: 4.6,
    reviews: 203,
    image: '/placeholder.svg',
    type: 'Loft'
  },
];

export const FeaturedListings = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Stays</h2>
        <p className="text-lg text-gray-600">Discover our most popular accommodations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockListings.map((listing) => (
          <Card key={listing.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-white text-gray-900">
                  {listing.type}
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                <p className="text-sm text-gray-500 mb-3">{listing.reviews} reviews</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold">${listing.price}</span>
                    <span className="text-gray-600 text-sm"> / night</span>
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/property/${listing.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" size="lg" asChild>
          <Link to="/search">View All Properties</Link>
        </Button>
      </div>
    </section>
  );
};
