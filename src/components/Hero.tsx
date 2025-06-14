
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Perfect Stay
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Discover unique accommodations around the world with StayHere
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/search" className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Start Exploring</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-[#FF5A5F]" asChild>
            <Link to="/host">Become a Host</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
