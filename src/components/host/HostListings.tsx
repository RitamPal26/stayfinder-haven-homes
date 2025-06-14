
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Home } from "lucide-react";
import { AddListingModal } from "./AddListingModal";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: string;
  title: string;
  location: string;
  price_per_night: number;
  images: string[];
  is_available: boolean;
  property_type: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
}

export function HostListings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('host_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load your listings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleListingAvailability = async (listingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_available: !currentStatus })
        .eq('id', listingId)
        .eq('host_id', user?.id);

      if (error) throw error;

      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, is_available: !currentStatus }
          : listing
      ));

      toast({
        title: "Success",
        description: `Listing ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling listing availability:', error);
      toast({
        title: "Error",
        description: "Failed to update listing availability.",
        variant: "destructive"
      });
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('host_id', user?.id);

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== listingId));

      toast({
        title: "Success",
        description: "Listing deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-4">Start earning by adding your first property listing.</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={listing.images?.[0] || '/placeholder.svg'} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={listing.is_available ? "default" : "secondary"}>
                    {listing.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{listing.location}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">${listing.price_per_night}/night</span>
                    <span className="text-sm text-muted-foreground">
                      {listing.max_guests} guests • {listing.bedrooms} bed • {listing.bathrooms} bath
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteListing(listing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleListingAvailability(listing.id, listing.is_available)}
                    >
                      {listing.is_available ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddListingModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onListingAdded={fetchListings}
      />
    </div>
  );
}
