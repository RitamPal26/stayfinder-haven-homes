
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Users, Calendar } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FF5A5F] via-[#FF385C] to-[#E91E63] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop)'
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>
      
      <div className="relative container mx-auto px-4 py-24 text-center min-h-screen flex flex-col justify-center">
        {/* Animated Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
              Perfect Stay
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Discover unique accommodations around the world with StayHere. 
            <span className="block mt-2 text-lg opacity-75">Book your dream vacation today!</span>
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 animate-scale-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Check-in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Check-out"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Guests"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <Button size="lg" className="w-full bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] hover:from-[#FF385C] hover:to-[#E91E63] shadow-lg transform hover:scale-105 transition-all duration-200" asChild>
              <Link to="/search" className="flex items-center justify-center space-x-2">
                <Search className="h-5 w-5" />
                <span className="font-semibold">Search Amazing Places</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
          <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transform hover:scale-105 transition-all duration-200 shadow-lg" asChild>
            <Link to="/search" className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span className="font-semibold">Explore Now</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#FF5A5F] transform hover:scale-105 transition-all duration-200 shadow-lg" asChild>
            <Link to="/host" className="font-semibold">Become a Host</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm opacity-75 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>1M+ Happy Guests</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>50K+ Properties</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>4.8★ Average Rating</span>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 animate-bounce">
        <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-20 right-10 animate-bounce delay-1000">
        <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
