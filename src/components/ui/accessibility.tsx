
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

export const SkipLink = ({ href, children }: SkipLinkProps) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#FF5A5F] text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F]"
  >
    {children}
  </a>
);

interface VisuallyHiddenProps {
  children: ReactNode;
  className?: string;
}

export const VisuallyHidden = ({ children, className }: VisuallyHiddenProps) => (
  <span className={cn("sr-only", className)}>
    {children}
  </span>
);

interface FocusTrapProps {
  children: ReactNode;
  className?: string;
}

export const FocusTrap = ({ children, className }: FocusTrapProps) => {
  return (
    <div 
      className={className}
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          const focusableElements = e.currentTarget.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }}
    >
      {children}
    </div>
  );
};
