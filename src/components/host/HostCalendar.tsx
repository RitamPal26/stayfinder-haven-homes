
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { parseISO } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  listings: { title: string } | null;
  profiles: { username: string } | null;
}

export function HostCalendar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHostBookings = useCallback(async () => {
    if (!user) return;
    try {
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id')
        .eq('host_id', user.id);
      
      if (listingsError) throw listingsError;
      const listingIds = listings.map(l => l.id);
      if (listingIds.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          listings ( title ),
          profiles ( username )
        `)
        .in('listing_id', listingIds)
        .eq('status', 'confirmed')
        .order('check_in_date', { ascending: true });
      
      if (bookingsError) throw bookingsError;

      setBookings(bookingsData as Booking[] || []);
    } catch (error) {
      console.error('Error fetching host bookings:', error);
      toast({ title: "Error", description: "Could not load booking data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchHostBookings();
  }, [fetchHostBookings]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('host-calendar-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
        console.log('Booking change detected, refetching calendar data.', payload);
        toast({ title: "Calendar Sync", description: "Your calendar is being updated." });
        fetchHostBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchHostBookings, toast]);

  const bookedDays = useMemo(() => {
    return bookings.map(b => ({
      from: parseISO(b.check_in_date),
      to: parseISO(b.check_out_date)
    }));
  }, [bookings]);
  
  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookings.filter(b => parseISO(b.check_in_date) >= today);
  }, [bookings]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar & Availability</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={bookedDays}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{booking.listings?.title || 'Listing'}</h4>
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">Confirmed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.profiles?.username || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.check_in_date).toLocaleDateString()} to {new Date(booking.check_out_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
