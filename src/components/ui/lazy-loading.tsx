
import { lazy, Suspense, ReactNode } from 'react';
import { LoadingSpinner, FullPageLoader } from '@/components/ui/loading-spinner';

interface LazyComponentWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const LazyComponentWrapper = ({ 
  children, 
  fallback = <FullPageLoader message="Loading page..." /> 
}: LazyComponentWrapperProps) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Lazy loaded page components
export const LazyPropertyDetails = lazy(() => import('@/pages/PropertyDetails'));
export const LazyHostDashboard = lazy(() => import('@/pages/HostDashboard'));
export const LazySearchResults = lazy(() => import('@/pages/SearchResults'));
export const LazyFavoritesPage = lazy(() => 
  import('@/components/favorites/FavoritesPage').then(module => ({ 
    default: module.FavoritesPage 
  }))
);

interface IntersectionObserverWrapperProps {
  children: ReactNode;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const IntersectionObserverWrapper = ({
  children,
  onIntersect,
  threshold = 0.1,
  rootMargin = '50px',
  className
}: IntersectionObserverWrapperProps) => {
  const ref = (element: HTMLDivElement | null) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  };

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
