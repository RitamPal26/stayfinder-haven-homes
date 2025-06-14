
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { AddListingModal } from "./AddListingModal";

export function HostListings() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock data - in real app this would come from Supabase
  const listings = [
    {
      id: '1',
      title: 'Cozy Mountain Cabin',
      location: 'Aspen, Colorado',
      pricePerNight: 200,
      images: ['/placeholder.svg'],
      isAvailable: true,
      bookings: 12
    },
    {
      id: '2',
      title: 'Beach House Paradise',
      location: 'Malibu, California',
      pricePerNight: 350,
      images: ['/placeholder.svg'],
      isAvailable: true,
      bookings: 8
    },
    {
      id: '3',
      title: 'Urban Loft Downtown',
      location: 'New York, NY',
      pricePerNight: 180,
      images: ['/placeholder.svg'],
      isAvailable: false,
      bookings: 15
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src={listing.images[0]} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={listing.isAvailable ? "default" : "secondary"}>
                  {listing.isAvailable ? "Available" : "Unavailable"}
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
                  <span className="text-lg font-semibold">${listing.pricePerNight}/night</span>
                  <span className="text-sm text-muted-foreground">{listing.bookings} bookings</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    {listing.isAvailable ? (
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

      <AddListingModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
