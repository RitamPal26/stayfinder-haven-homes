
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, Heart, User, LogOut, Menu, PlusCircle } from 'lucide-react';

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-[#FF5A5F]" />
            <span className="text-xl font-bold text-gray-900">StayHere</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Explore
            </Link>
            {user && (
              <>
                <Link 
                  to="/favorites" 
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center space-x-1"
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Link>
                <Link 
                  to="/host" 
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center space-x-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Host</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Menu className="h-4 w-4" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/favorites" className="flex items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/host" className="flex items-center">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Host Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
