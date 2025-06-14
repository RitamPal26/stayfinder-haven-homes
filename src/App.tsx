
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "@/components/ui/error-boundary";
import { SkipLink } from "@/components/ui/accessibility";
import { EnvironmentBanner } from "@/components/ui/environment-banner";
import { AnalyticsProvider } from "@/components/ui/analytics";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { LazyComponentWrapper, LazyPropertyDetails, LazyHostDashboard, LazySearchResults, LazyFavoritesPage } from "@/components/ui/lazy-loading";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PerformanceMonitor />
            <AnalyticsProvider>
              <EnvironmentBanner />
              <SkipLink href="#main-content">Skip to main content</SkipLink>
              <div id="main-content">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route 
                    path="/search" 
                    element={
                      <LazyComponentWrapper>
                        <LazySearchResults />
                      </LazyComponentWrapper>
                    } 
                  />
                  <Route 
                    path="/property/:id" 
                    element={
                      <LazyComponentWrapper>
                        <LazyPropertyDetails />
                      </LazyComponentWrapper>
                    } 
                  />
                  <Route 
                    path="/favorites" 
                    element={
                      <LazyComponentWrapper>
                        <LazyFavoritesPage />
                      </LazyComponentWrapper>
                    } 
                  />
                  <Route 
                    path="/host" 
                    element={
                      <LazyComponentWrapper>
                        <LazyHostDashboard />
                      </LazyComponentWrapper>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AnalyticsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
