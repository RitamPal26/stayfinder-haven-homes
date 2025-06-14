
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onListingAdded?: () => void;
}

const amenityOptions = [
  'WiFi', 'Kitchen', 'Parking', 'Pool', 'Hot Tub', 'Air Conditioning',
  'Heating', 'Washer', 'Dryer', 'TV', 'Workspace', 'Gym'
];

const propertyTypes = [
  'apartment', 'house', 'villa', 'cabin', 'loft', 'condo', 'studio'
];

export function AddListingModal({ open, onOpenChange, onListingAdded }: AddListingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    property_type: 'apartment',
    price_per_night: '',
    cleaning_fee: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    house_rules: '',
    images: ['/placeholder.svg'] as string[]
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
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('listings')
        .insert({
          host_id: user.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          property_type: formData.property_type,
          price_per_night: parseFloat(formData.price_per_night),
          cleaning_fee: formData.cleaning_fee ? parseFloat(formData.cleaning_fee) : 0,
          max_guests: parseInt(formData.max_guests),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          amenities: formData.amenities,
          house_rules: formData.house_rules,
          images: formData.images,
          is_available: true,
          instant_book: false
        });

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your property listing has been created successfully.",
      });
      
      onOpenChange(false);
      onListingAdded?.();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        property_type: 'apartment',
        price_per_night: '',
        cleaning_fee: '',
        max_guests: '',
        bedrooms: '',
        bathrooms: '',
        amenities: [],
        house_rules: '',
        images: ['/placeholder.svg']
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Beautiful downtown apartment"
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
                placeholder="New York, NY"
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
              placeholder="Describe your property..."
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max_guests">Max Guests *</Label>
              <Input
                id="max_guests"
                type="number"
                min="1"
                value={formData.max_guests}
                onChange={(e) => setFormData(prev => ({ ...prev, max_guests: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price_per_night">Price per Night ($) *</Label>
              <Input
                id="price_per_night"
                type="number"
                min="1"
                step="0.01"
                value={formData.price_per_night}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cleaning_fee">Cleaning Fee ($)</Label>
              <Input
                id="cleaning_fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.cleaning_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, cleaning_fee: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                required
              />
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
            <Label htmlFor="house_rules">House Rules</Label>
            <Textarea
              id="house_rules"
              value={formData.house_rules}
              onChange={(e) => setFormData(prev => ({ ...prev, house_rules: e.target.value }))}
              rows={3}
              placeholder="e.g., No smoking, No pets, Check-in after 3 PM..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
