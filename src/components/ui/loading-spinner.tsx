
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-[#FF5A5F]", sizeClasses[size], className)} />
  );
};

export const FullPageLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
  </div>
);
