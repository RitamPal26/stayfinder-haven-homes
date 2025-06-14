
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SuccessAnimation = ({ size = 'md', className }: SuccessAnimationProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn("relative", className)}>
      <CheckCircle 
        className={cn(
          "text-green-500 animate-bounce",
          sizeClasses[size]
        )} 
      />
      <div className={cn(
        "absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75",
        sizeClasses[size]
      )} />
    </div>
  );
};

export const SuccessMessage = ({ 
  title, 
  message, 
  onClose 
}: { 
  title: string; 
  message: string; 
  onClose?: () => void; 
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center animate-scale-in">
      <SuccessAnimation size="lg" className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-[#FF5A5F] text-white px-4 py-2 rounded-md hover:bg-[#E04E53] transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  </div>
);
