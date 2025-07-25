
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, DollarSign, Bolt } from "lucide-react";
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { BookingConfirmationModal } from './BookingConfirmationModal';
import { Database } from '@/integrations/supabase/types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface PropertyBookingProps {
  listingId: string;
  pricePerNight: number;
  cleaningFee?: number;
  maxGuests: number;
  instantBook: boolean;
}

export const PropertyBooking = ({ 
  listingId, 
  pricePerNight, 
  cleaningFee = 0, 
  maxGuests,
  instantBook,
}: PropertyBookingProps) => {
  const { user } = useAuth();
  const { createBooking, loading } = useBookings();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    return (pricePerNight * nights) + cleaningFee;
  };

  const handleBooking = async () => {
    if (!user) return;
    if (!checkIn || !checkOut || guests < 1) return;
    const total = calculateTotal();
    if (total <= 0) return;

    const bookingData = {
      listing_id: listingId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests,
      total_price: total
    };

    const newBooking = await createBooking({ bookingData, isInstant: instantBook });

    if (newBooking && instantBook) {
      setConfirmedBooking(newBooking);
      setShowConfirmationModal(true);
    }
  };

  const total = calculateTotal();
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <>
      <Card className="sticky top-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              ${pricePerNight} / night
            </CardTitle>
            {instantBook && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Bolt className="w-3 h-3 mr-1" />
                Instant Book
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="checkin">Check-in</Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guests
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={maxGuests}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            />
          </div>
          
          {total > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>${pricePerNight} × {nights} nights</span>
                <span>${pricePerNight * nights}</span>
              </div>
              {cleaningFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleBooking}
            disabled={loading || !user || !checkIn || !checkOut || total <= 0}
            className="w-full"
          >
            {loading ? 'Processing...' : !user ? 'Sign in to Book' : instantBook ? 'Book Instantly' : 'Request to Book'}
          </Button>
        </CardContent>
      </Card>
      <BookingConfirmationModal 
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
        booking={confirmedBooking}
      />
    </>
  );
};
