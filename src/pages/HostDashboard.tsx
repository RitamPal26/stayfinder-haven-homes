
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { HostSidebar } from "@/components/host/HostSidebar";
import { HostOverview } from "@/components/host/HostOverview";
import { HostListings } from "@/components/host/HostListings";
import { HostBookings } from "@/components/host/HostBookings";
import { HostCalendar } from "@/components/host/HostCalendar";
import { HostEarnings } from "@/components/host/HostEarnings";

const HostDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <HostOverview />;
      case 'listings':
        return <HostListings />;
      case 'bookings':
        return <HostBookings />;
      case 'calendar':
        return <HostCalendar />;
      case 'earnings':
        return <HostEarnings />;
      default:
        return <HostOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <HostSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        <main className="flex-1 p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HostDashboard;
