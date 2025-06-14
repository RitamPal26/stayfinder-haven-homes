
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  listing_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createBooking = useCallback(async (bookingData: BookingData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      console.log('Creating booking with data:', bookingData);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Booking creation error:', error);
        throw error;
      }

      console.log('Booking created successfully:', data);
      
      toast({
        title: "Booking Requested",
        description: "Your booking request has been submitted and is pending host approval.",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      let errorMessage = "Failed to create booking. Please try again.";
      if (error.message?.includes('foreign key')) {
        errorMessage = "Profile setup required. Please refresh the page and try again.";
      }
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  return { createBooking, loading };
};
