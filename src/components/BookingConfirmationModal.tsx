
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface BookingConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

export const BookingConfirmationModal = ({ open, onOpenChange, booking }: BookingConfirmationModalProps) => {
  if (!booking) return null;

  // Replace hyphens with slashes to avoid timezone issues with new Date()
  const checkIn = new Date(booking.check_in_date.replace(/-/g, '\/')).toDateString();
  const checkOut = new Date(booking.check_out_date.replace(/-/g, '\/')).toDateString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl font-bold">Booking Confirmed!</DialogTitle>
            <DialogDescription className="mt-2">
              Your trip is booked. Get ready for an amazing stay!
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex items-center text-sm"><Calendar className="w-4 h-4 mr-3" /> <span>{checkIn} - {checkOut}</span></div>
            <div className="flex items-center text-sm"><Users className="w-4 h-4 mr-3" /> <span>{booking.guests} Guests</span></div>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button asChild variant="outline">
            <Link to={`/property/${booking.listing_id}`}>View Property</Link>
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
