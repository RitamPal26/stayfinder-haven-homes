
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Users, X } from "lucide-react";
import { format } from "date-fns";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export interface SearchFilters {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  instantBook: boolean;
}

const propertyTypes = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'condo', label: 'Condo' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'studio', label: 'Studio' }
];

const amenitiesList = [
  'WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'TV', 
  'Washing Machine', 'Gym', 'Beach Access', 'Pet Friendly', 
  'Hot Tub', 'Fireplace', 'Balcony', 'Garden'
];

export function SearchFilters({ filters, onFiltersChange, onSearch }: SearchFiltersProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const togglePropertyType = (type: string) => {
    const updated = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    updateFilters({ propertyTypes: updated });
  };

  const toggleAmenity = (amenity: string) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilters({ amenities: updated });
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      checkIn: undefined,
      checkOut: undefined,
      guests: 1,
      priceRange: [0, 1000],
      propertyTypes: [],
      amenities: [],
      instantBook: false
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Search & Filters</CardTitle>
          <Button variant="ghost" onClick={clearFilters} size="sm">
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-2">
          <Label>Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Where are you going?"
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.checkIn ? format(filters.checkIn, "MMM dd") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.checkIn}
                  onSelect={(date) => updateFilters({ checkIn: date })}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.checkOut ? format(filters.checkOut, "MMM dd") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.checkOut}
                  onSelect={(date) => updateFilters({ checkOut: date })}
                  disabled={(date) => date < new Date() || (filters.checkIn && date <= filters.checkIn)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label>Guests</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Select value={filters.guests.toString()} onValueChange={(value) => updateFilters({ guests: parseInt(value) })}>
              <SelectTrigger className="pl-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range per night</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </div>

        {/* Property Types */}
        <div className="space-y-3">
          <Label>Property Type</Label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map(type => (
              <Badge
                key={type.id}
                variant={filters.propertyTypes.includes(type.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePropertyType(type.id)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label>Amenities</Label>
          <div className="space-y-2">
            {amenitiesList.slice(0, showAllAmenities ? amenitiesList.length : 6).map(amenity => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label htmlFor={amenity} className="text-sm font-normal">
                  {amenity}
                </Label>
              </div>
            ))}
            {amenitiesList.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllAmenities(!showAllAmenities)}
              >
                {showAllAmenities ? 'Show Less' : `Show ${amenitiesList.length - 6} More`}
              </Button>
            )}
          </div>
        </div>

        {/* Instant Book */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="instantBook"
            checked={filters.instantBook}
            onCheckedChange={(checked) => updateFilters({ instantBook: checked as boolean })}
          />
          <Label htmlFor="instantBook" className="text-sm font-normal">
            Instant Book
          </Label>
        </div>

        {/* Search Button */}
        <Button onClick={onSearch} className="w-full" size="lg">
          Search Properties
        </Button>
      </CardContent>
    </Card>
  );
}
