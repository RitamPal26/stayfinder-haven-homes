
import { useState, useEffect } from 'react';

interface UseImageOptimizationProps {
  src: string;
  alt: string;
}

export const useImageOptimization = ({ src, alt }: UseImageOptimizationProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    
    // Add Unsplash optimization parameters for better performance
    if (src.includes('unsplash.com')) {
      const url = new URL(src);
      url.searchParams.set('auto', 'format,compress');
      url.searchParams.set('q', '80');
      setOptimizedSrc(url.toString());
    }
    
    img.src = optimizedSrc;
  }, [src, optimizedSrc]);

  return { isLoaded, hasError, optimizedSrc };
};
