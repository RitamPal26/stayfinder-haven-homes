
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  BookOpen, 
  DollarSign 
} from "lucide-react";

interface HostSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    id: "overview"
  },
  {
    title: "Listings",
    icon: Home,
    id: "listings"
  },
  {
    title: "Bookings",
    icon: BookOpen,
    id: "bookings"
  },
  {
    title: "Calendar",
    icon: Calendar,
    id: "calendar"
  },
  {
    title: "Earnings",
    icon: DollarSign,
    id: "earnings"
  }
];

export function HostSidebar({ activeSection, setActiveSection }: HostSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <h2 className="text-xl font-bold text-primary">StayFinder Host</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
