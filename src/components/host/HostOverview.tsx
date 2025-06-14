
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Home, Calendar, Users, TrendingUp } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HostStats {
  totalEarnings: number;
  totalListings: number;
  upcomingBookings: number;
  totalGuests: number;
  monthlyGrowth: number;
}

export function HostOverview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<HostStats>({
    totalEarnings: 0,
    totalListings: 0,
    upcomingBookings: 0,
    totalGuests: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchHostStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchHostStats = async () => {
    try {
      // Fetch total listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id, price_per_night')
        .eq('host_id', user?.id);

      if (listingsError) throw listingsError;

      // Fetch bookings for earnings and guest count
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_price, guests, status, check_in_date')
        .in('listing_id', listings?.map(l => l.id) || []);

      if (bookingsError) throw bookingsError;

      // Calculate stats
      const totalEarnings = bookings
        ?.filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

      const upcomingBookings = bookings
        ?.filter(b => new Date(b.check_in_date) > new Date()).length || 0;

      const totalGuests = bookings
        ?.filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.guests), 0) || 0;

      setStats({
        totalEarnings,
        totalListings: listings?.length || 0,
        upcomingBookings,
        totalGuests,
        monthlyGrowth: 12 // Mock growth percentage
      });
    } catch (error) {
      console.error('Error fetching host stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard stats.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title')
        .eq('host_id', user?.id);

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, listings!inner(title)')
        .in('listing_id', listings?.map(l => l.id) || [])
        .order('created_at', { ascending: false })
        .limit(5);

      const activities = bookings?.map(booking => ({
        type: 'booking',
        message: `New booking for ${booking.listings.title}`,
        time: new Date(booking.created_at).toLocaleString(),
        status: booking.status
      })) || [];

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back! Here's how your properties are performing.
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{stats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">Properties available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">Lifetime guests hosted</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'confirmed' ? 'bg-green-500' : 
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
