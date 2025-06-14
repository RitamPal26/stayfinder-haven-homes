import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, MessageSquare, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  listing_id: string;
  user_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
  listings?: {
    title: string;
  };
  profiles?: {
    username: string;
    email?: string;
  };
}

export function HostBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      // First get all listings for this host
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id')
        .eq('host_id', user?.id);

      if (listingsError) throw listingsError;

      if (!listings || listings.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // Then get all bookings for those listings with proper joins
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          listings(title),
          profiles(username)
        `)
        .in('listing_id', listings.map(l => l.id))
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Transform the data to match our interface
      const transformedBookings: Booking[] = (bookingsData || []).map(booking => ({
        ...booking,
        listings: booking.listings ? { title: booking.listings.title } : undefined,
        profiles: booking.profiles ? { 
          username: booking.profiles.username,
          email: booking.profiles.username // Using username as fallback for email
        } : undefined
      }));

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed' }
          : booking
      ));

      toast({
        title: "Booking Accepted",
        description: "The booking has been confirmed and the guest has been notified.",
      });
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast({
        title: "Error",
        description: "Failed to accept booking.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));

      toast({
        title: "Booking Declined",
        description: "The booking has been declined and the guest has been notified.",
      });
    } catch (error) {
      console.error('Error declining booking:', error);
      toast({
        title: "Error",
        description: "Failed to decline booking.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('host_messages')
        .insert({
          booking_id: selectedBooking.id,
          sender_id: user?.id,
          message: message
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the guest.",
      });
      
      setMessage('');
      setShowMessageModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking Management</h1>

      {bookings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-gray-600">Your bookings will appear here once guests start booking your properties.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.listings?.title || 'Unknown Property'}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Guest: {booking.profiles?.username || 'Unknown Guest'} ({booking.profiles?.email || 'No email'})
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{booking.guests} guests</span>
                  </div>
                  <div>
                    <span className="text-lg font-semibold">${booking.total_price}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeclineBooking(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowMessageModal(true);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message Guest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Message {selectedBooking?.profiles?.username || 'Guest'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Booking: {selectedBooking?.listings?.title || 'Unknown Property'}
              </p>
            </div>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
