
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchFilters, SearchFilters as SearchFiltersType } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter, Map, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<SearchFiltersType>({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined,
    checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined,
    guests: parseInt(searchParams.get('guests') || '1'),
    priceRange: [0, 1000],
    propertyTypes: [],
    amenities: [],
    instantBook: false
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for demonstration
  const sampleProperties = [
    {
      id: '1',
      title: 'Luxury Beachfront Villa',
      location: 'Goa, India',
      price_per_night: 450,
      images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'],
      property_type: 'villa',
      max_guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen'],
      instant_book: true,
      rating: 4.9,
      reviews: 127,
      is_favorited: false
    },
    {
      id: '2',
      title: 'Modern Downtown Apartment',
      location: 'Mumbai, India',
      price_per_night: 180,
      images: ['https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop'],
      property_type: 'apartment',
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning'],
      instant_book: false,
      rating: 4.7,
      reviews: 89,
      is_favorited: true
    },
    {
      id: '3',
      title: 'Cozy Mountain Cottage',
      location: 'Manali, India',
      price_per_night: 120,
      images: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop'],
      property_type: 'house',
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Garden'],
      instant_book: true,
      rating: 4.8,
      reviews: 156,
      is_favorited: false
    }
  ];

  useEffect(() => {
    searchProperties();
  }, []);

  const searchProperties = async () => {
    setLoading(true);
    try {
      // For demo, using sample data
      // In production, this would query Supabase with filters
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setProperties(sampleProperties);
      setTotalCount(sampleProperties.length);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search properties. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.checkIn) params.set('checkIn', newFilters.checkIn.toISOString());
    if (newFilters.checkOut) params.set('checkOut', newFilters.checkOut.toISOString());
    if (newFilters.guests > 1) params.set('guests', newFilters.guests.toString());
    setSearchParams(params);
  };

  const handleSearch = () => {
    searchProperties();
    setShowFilters(false);
  };

  const handleToggleFavorite = async (propertyId: string) => {
    try {
      // In production, this would toggle favorite in Supabase
      setProperties(prev => prev.map(p => 
        p.id === propertyId ? { ...p, is_favorited: !p.is_favorited } : p
      ));
      
      toast({
        title: "Favorite Updated",
        description: "Property has been added to your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddToComparison = (propertyId: string) => {
    if (comparisonList.length >= 3) {
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 3 properties at a time.",
        variant: "destructive"
      });
      return;
    }

    if (!comparisonList.includes(propertyId)) {
      setComparisonList(prev => [...prev, propertyId]);
      toast({
        title: "Added to Comparison",
        description: "Property has been added to your comparison list.",
      });
    }
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonList(prev => prev.filter(id => id !== propertyId));
  };

  const activeFiltersCount = 
    (filters.propertyTypes.length > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.instantBook ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">StayFinder</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Controls */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 px-1 py-0 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <SearchFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onSearch={handleSearch}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline">
                <Map className="w-4 h-4 mr-2" />
                Map View
              </Button>
            </div>

            {/* Comparison Bar */}
            {comparisonList.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Compare Properties ({comparisonList.length}/3)</span>
                    <div className="flex space-x-2">
                      {comparisonList.map(id => (
                        <Badge key={id} variant="secondary" className="flex items-center">
                          Property {id}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => removeFromComparison(id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm">
                    Compare Now
                  </Button>
                </div>
              </div>
            )}

            {/* Search Results */}
            <SearchResults
              properties={properties}
              loading={loading}
              totalCount={totalCount}
              onToggleFavorite={handleToggleFavorite}
              onAddToComparison={handleAddToComparison}
              comparisonList={comparisonList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
