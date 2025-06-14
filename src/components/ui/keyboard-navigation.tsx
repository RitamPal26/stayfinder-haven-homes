
import { useEffect, useState } from 'react';

export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (isKeyboardUser) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }
  }, [isKeyboardUser]);

  return isKeyboardUser;
};

interface SkipNavigationProps {
  links: Array<{ href: string; label: string }>;
}

export const SkipNavigation = ({ links }: SkipNavigationProps) => (
  <div className="sr-only focus-within:not-sr-only">
    <div className="fixed top-0 left-0 z-50 bg-white border border-gray-300 rounded-br-lg p-4 shadow-lg">
      <h2 className="text-sm font-semibold mb-2">Skip to:</h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[#FF5A5F] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] rounded px-2 py-1"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
