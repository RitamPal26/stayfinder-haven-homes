
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface SearchData {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
}

export function EnhancedSearchBar() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<SearchData>({
    location: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 1
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.set('location', searchData.location);
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn.toISOString());
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut.toISOString());
    if (searchData.guests > 1) params.set('guests', searchData.guests.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Where</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search destinations"
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchData.checkIn ? format(searchData.checkIn, "MMM dd") : "Add dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchData.checkIn}
                onSelect={(date) => setSearchData({ ...searchData, checkIn: date })}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchData.checkOut ? format(searchData.checkOut, "MMM dd") : "Add dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchData.checkOut}
                onSelect={(date) => setSearchData({ ...searchData, checkOut: date })}
                disabled={(date) => date < new Date() || (searchData.checkIn && date <= searchData.checkIn)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Select value={searchData.guests.toString()} onValueChange={(value) => setSearchData({ ...searchData, guests: parseInt(value) })}>
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
      </div>

      <Button onClick={handleSearch} className="w-full mt-6" size="lg">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
