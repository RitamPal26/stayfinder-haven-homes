
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar as CalendarIcon, Users, Sparkles } from "lucide-react";
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
    <div className="relative">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A5F]/20 to-[#FF385C]/20 rounded-2xl blur-xl"></div>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-[#FF5A5F] animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] bg-clip-text text-transparent">
              Find Your Perfect Stay
            </h2>
            <Sparkles className="w-6 h-6 text-[#FF5A5F] animate-pulse" />
          </div>
          <p className="text-gray-600">Search from thousands of amazing properties worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF5A5F]" />
              Where
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#FF5A5F] transition-colors" />
              <Input
                placeholder="Search destinations..."
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="pl-12 h-12 border-2 border-gray-200 focus:border-[#FF5A5F] rounded-xl text-base transition-all duration-200 hover:border-gray-300"
              />
            </div>
          </div>

          {/* Check-in */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#FF5A5F]" />
              Check-in
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-start text-left font-normal border-2 border-gray-200 hover:border-[#FF5A5F] focus:border-[#FF5A5F] rounded-xl transition-all duration-200"
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                  <span className={searchData.checkIn ? "text-gray-900" : "text-gray-500"}>
                    {searchData.checkIn ? format(searchData.checkIn, "MMM dd, yyyy") : "Select date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-2xl border-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.checkIn}
                  onSelect={(date) => setSearchData({ ...searchData, checkIn: date })}
                  disabled={(date) => date < new Date()}
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#FF5A5F]" />
              Check-out
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-start text-left font-normal border-2 border-gray-200 hover:border-[#FF5A5F] focus:border-[#FF5A5F] rounded-xl transition-all duration-200"
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                  <span className={searchData.checkOut ? "text-gray-900" : "text-gray-500"}>
                    {searchData.checkOut ? format(searchData.checkOut, "MMM dd, yyyy") : "Select date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-2xl border-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.checkOut}
                  onSelect={(date) => setSearchData({ ...searchData, checkOut: date })}
                  disabled={(date) => date < new Date() || (searchData.checkIn && date <= searchData.checkIn)}
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF5A5F]" />
              Guests
            </label>
            <div className="relative group">
              <Users className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#FF5A5F] transition-colors" />
              <Select value={searchData.guests.toString()} onValueChange={(value) => setSearchData({ ...searchData, guests: parseInt(value) })}>
                <SelectTrigger className="pl-12 h-12 border-2 border-gray-200 focus:border-[#FF5A5F] rounded-xl transition-all duration-200 hover:border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-2xl border-0">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()} className="rounded-lg">
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Enhanced Search Button */}
        <div className="mt-8">
          <Button 
            onClick={handleSearch} 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] hover:from-[#FF385C] hover:to-[#E91E63] shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl"
            size="lg"
          >
            <Search className="w-6 h-6 mr-3" />
            Search Amazing Places
            <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['New York', 'Paris', 'Tokyo', 'London', 'Dubai'].map((city) => (
              <button 
                key={city}
                onClick={() => setSearchData({ ...searchData, location: city })}
                className="px-4 py-2 bg-gray-100 hover:bg-[#FF5A5F] hover:text-white rounded-full text-sm transition-all duration-200 transform hover:scale-105"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
