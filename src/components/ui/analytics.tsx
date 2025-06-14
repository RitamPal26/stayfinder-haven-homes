
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    trackPageView(location.pathname);
  }, [location]);

  const trackPageView = (page: string) => {
    console.log('Page view:', page);
    // Replace with your analytics provider
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { page_path: page });
  };

  const trackEvent = ({ event, category, action, label, value }: AnalyticsEvent) => {
    console.log('Event tracked:', { event, category, action, label, value });
    // Replace with your analytics provider
    // Example: gtag('event', action, { event_category: category, event_label: label, value });
  };

  const trackUserInteraction = (element: string, action: string) => {
    trackEvent({
      event: 'user_interaction',
      category: 'engagement',
      action,
      label: element
    });
  };

  const trackError = (error: string, page: string) => {
    trackEvent({
      event: 'error',
      category: 'error',
      action: 'javascript_error',
      label: `${page}: ${error}`
    });
  };

  const trackPerformance = (metric: string, value: number) => {
    trackEvent({
      event: 'performance',
      category: 'performance',
      action: metric,
      value
    });
  };

  return {
    trackEvent,
    trackUserInteraction,
    trackError,
    trackPerformance
  };
};

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  useAnalytics();
  return <>{children}</>;
};
