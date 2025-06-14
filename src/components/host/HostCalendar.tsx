
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export function HostCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock booking data for calendar
  const bookings = [
    { checkIn: '2024-01-15', checkOut: '2024-01-18', guest: 'John Smith', listing: 'Mountain Cabin' },
    { checkIn: '2024-01-20', checkOut: '2024-01-25', guest: 'Sarah Johnson', listing: 'Beach House' },
    { checkIn: '2024-01-28', checkOut: '2024-01-30', guest: 'Mike Wilson', listing: 'Urban Loft' }
  ];

  const upcomingBookings = bookings.filter(booking => new Date(booking.checkIn) >= new Date());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar & Availability</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
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
              />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{booking.listing}</h4>
                      <Badge variant="outline" className="text-xs">Confirmed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.guest}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.checkIn} to {booking.checkOut}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                  Block dates
                </button>
                <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                  Set pricing rules
                </button>
                <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                  Bulk availability
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
