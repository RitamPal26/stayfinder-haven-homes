
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useImageOptimization } from '@/hooks/useImageOptimization';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center'
}: OptimizedImageProps) => {
  const { isLoaded, hasError, optimizedSrc } = useImageOptimization({ src, alt });
  const [showFallback, setShowFallback] = useState(false);

  const handleError = () => {
    if (!showFallback && fallbackSrc) {
      setShowFallback(true);
    }
  };

  if (!isLoaded && !hasError) {
    return <Skeleton className={cn("w-full h-full", className)} />;
  }

  return (
    <img
      src={showFallback ? fallbackSrc : optimizedSrc}
      alt={alt}
      className={cn("w-full h-full object-cover transition-opacity duration-300", className)}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
};
