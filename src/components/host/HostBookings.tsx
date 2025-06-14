
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, MessageSquare, Calendar, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function HostBookings() {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  // Mock data - in real app this would come from Supabase
  const bookings = [
    {
      id: '1',
      listingTitle: 'Cozy Mountain Cabin',
      guestName: 'John Smith',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      guests: 4,
      totalPrice: 600,
      status: 'pending'
    },
    {
      id: '2',
      listingTitle: 'Beach House Paradise',
      guestName: 'Sarah Johnson',
      checkIn: '2024-01-20',
      checkOut: '2024-01-25',
      guests: 6,
      totalPrice: 1750,
      status: 'confirmed'
    },
    {
      id: '3',
      listingTitle: 'Urban Loft Downtown',
      guestName: 'Mike Wilson',
      checkIn: '2024-01-10',
      checkOut: '2024-01-12',
      guests: 2,
      totalPrice: 360,
      status: 'cancelled'
    }
  ];

  const handleAcceptBooking = (bookingId: string) => {
    toast({
      title: "Booking Accepted",
      description: "The booking has been confirmed and the guest has been notified.",
    });
  };

  const handleDeclineBooking = (bookingId: string) => {
    toast({
      title: "Booking Declined",
      description: "The booking has been declined and the guest has been notified.",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the guest.",
    });
    setMessage('');
    setShowMessageModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking Management</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{booking.listingTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground">Guest: {booking.guestName}</p>
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
                  <span className="text-sm">Check-in: {booking.checkIn}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Check-out: {booking.checkOut}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{booking.guests} guests</span>
                </div>
                <div>
                  <span className="text-lg font-semibold">${booking.totalPrice}</span>
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
                
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Message {selectedBooking?.guestName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Booking: {selectedBooking?.listingTitle}
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
              <Button onClick={handleSendMessage}>
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
