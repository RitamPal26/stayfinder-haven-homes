
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
}

export const useErrorBoundary = () => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const { toast } = useToast();

  const captureError = useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    const errorDetails: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    };

    setError(errorDetails);
    
    // Log to console for development
    console.error('Error captured:', errorDetails);
    
    // Show user-friendly error message
    toast({
      title: 'Something went wrong',
      description: 'We\'ve been notified of this issue. Please try refreshing the page.',
      variant: 'destructive',
    });

    // In production, send to error monitoring service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetErrorBoundary = useCallback(() => {
    clearError();
    window.location.reload();
  }, [clearError]);

  return {
    error,
    captureError,
    clearError,
    resetErrorBoundary
  };
};
