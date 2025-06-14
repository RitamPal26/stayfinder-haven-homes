
import { useEffect } from 'react';
import { useAnalytics } from '@/components/ui/analytics';

export const PerformanceMonitor = () => {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.fetchStart;
          const fcp = navEntry.loadEventEnd - navEntry.fetchStart;
          
          trackPerformance('time_to_first_byte', ttfb);
          trackPerformance('first_contentful_paint', fcp);
        }
        
        if (entry.entryType === 'paint') {
          const paintEntry = entry as PerformancePaintTiming;
          if (paintEntry.name === 'first-contentful-paint') {
            trackPerformance('first_contentful_paint_precise', paintEntry.startTime);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint'] });

    // Monitor largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackPerformance('largest_contentful_paint', lastEntry.startTime);
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor cumulative layout shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Report CLS on page unload
    const reportCLS = () => trackPerformance('cumulative_layout_shift', clsValue);
    window.addEventListener('beforeunload', reportCLS);

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
      window.removeEventListener('beforeunload', reportCLS);
    };
  }, [trackPerformance]);

  return null;
};
