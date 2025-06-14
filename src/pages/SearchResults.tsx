
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchFilters, SearchFilters as SearchFiltersType } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter, Map, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/Footer";

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

  useEffect(() => {
    searchProperties();
  }, [filters]);

  const searchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('is_available', true);

      // Apply location filter
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply guest filter
      if (filters.guests > 1) {
        query = query.gte('max_guests', filters.guests);
      }

      // Apply price range filter
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        query = query
          .gte('price_per_night', filters.priceRange[0])
          .lte('price_per_night', filters.priceRange[1]);
      }

      // Apply property types filter
      if (filters.propertyTypes.length > 0) {
        query = query.in('property_type', filters.propertyTypes);
      }

      // Apply instant book filter
      if (filters.instantBook) {
        query = query.eq('instant_book', true);
      }

      const { data, error, count } = await query.limit(20);

      if (error) throw error;

      setProperties(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error searching properties:', error);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to add favorites.",
          variant: "destructive"
        });
        return;
      }

      // Check if already favorited
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', propertyId)
        .single();

      if (existingFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', propertyId);
        
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, is_favorited: false } : p
        ));
        
        toast({
          title: "Removed from Favorites",
          description: "Property has been removed from your favorites.",
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: propertyId
          });
        
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, is_favorited: true } : p
        ));
        
        toast({
          title: "Added to Favorites",
          description: "Property has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
      <Header />

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
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
