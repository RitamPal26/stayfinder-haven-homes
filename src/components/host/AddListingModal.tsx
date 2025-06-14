
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";

interface AddListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const amenityOptions = [
  'WiFi', 'Kitchen', 'Parking', 'Pool', 'Hot Tub', 'Air Conditioning',
  'Heating', 'Washer', 'Dryer', 'TV', 'Workspace', 'Gym'
];

export function AddListingModal({ open, onOpenChange }: AddListingModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    cleaningFee: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    houseRules: '',
    images: [] as string[]
  });

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.filter(a => a !== amenity)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In real implementation, this would save to Supabase
    console.log('Creating listing:', formData);
    
    toast({
      title: "Listing Created!",
      description: "Your property has been added successfully.",
    });
    
    onOpenChange(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      pricePerNight: '',
      cleaningFee: '',
      maxGuests: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      houseRules: '',
      images: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Pricing and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="pricePerNight">Price per Night ($)</Label>
              <Input
                id="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cleaningFee">Cleaning Fee ($)</Label>
              <Input
                id="cleaningFee"
                type="number"
                value={formData.cleaningFee}
                onChange={(e) => setFormData(prev => ({ ...prev, cleaningFee: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="maxGuests">Max Guests</Label>
              <Input
                id="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Property Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload photos or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {amenityOptions.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div>
            <Label htmlFor="houseRules">House Rules</Label>
            <Textarea
              id="houseRules"
              value={formData.houseRules}
              onChange={(e) => setFormData(prev => ({ ...prev, houseRules: e.target.value }))}
              rows={3}
              placeholder="e.g., No smoking, No pets, Check-in after 3 PM..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Listing
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
