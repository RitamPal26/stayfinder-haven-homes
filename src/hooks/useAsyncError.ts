
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAsyncError = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      showLoading?: boolean;
    }
  ): Promise<T | null> => {
    const { successMessage, errorMessage = 'Something went wrong', showLoading = true } = options || {};
    
    try {
      if (showLoading) setLoading(true);
      
      const result = await asyncFunction();
      
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Async operation failed:', error);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [toast]);

  return { executeAsync, loading };
};
