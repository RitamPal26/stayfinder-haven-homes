
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export const EnvironmentBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('lovableproject.com');

  if (!isDevelopment || !isVisible) return null;

  return (
    <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium relative">
      <div className="flex items-center justify-center space-x-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Development Environment - This is not the production site</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-yellow-600 rounded p-1"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
