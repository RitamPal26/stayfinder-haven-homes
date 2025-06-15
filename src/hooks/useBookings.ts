
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type BookingData = Omit<Database['public']['Tables']['bookings']['Insert'], 'id' | 'created_at' | 'user_id' | 'status' | 'is_instant'>;
type NewBooking = Database['public']['Tables']['bookings']['Row'];

interface CreateBookingArgs {
  bookingData: BookingData;
  isInstant: boolean;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createBooking = useCallback(async ({ bookingData, isInstant }: CreateBookingArgs): Promise<NewBooking | null> => {
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
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          status: isInstant ? 'confirmed' : 'pending',
          is_instant: isInstant
        })
        .select()
        .single();

      if (error) {
        console.error('Booking creation error:', error);
        throw error;
      }
      
      toast({
        title: isInstant ? "Booking Confirmed!" : "Booking Requested",
        description: isInstant 
          ? "Your booking is confirmed. Get ready for your trip!"
          : "Your booking request has been submitted and is pending host approval.",
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
