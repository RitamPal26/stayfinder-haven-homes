
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-[#FF5A5F]" />
              <span className="text-xl font-bold">StayHere</span>
            </div>
            <p className="text-gray-300">
              Find unique accommodations around the world. Your home away from home.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white">Safety Information</Link></li>
              <li><Link to="/cancellation" className="hover:text-white">Cancellation Options</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/host" className="hover:text-white">Become a Host</Link></li>
              <li><Link to="/newsroom" className="hover:text-white">Newsroom</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/investors" className="hover:text-white">Investors</Link></li>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h3 className="font-semibold mb-4">Host</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/host-home" className="hover:text-white">Host Your Home</Link></li>
              <li><Link to="/host-resources" className="hover:text-white">Host Resources</Link></li>
              <li><Link to="/community-center" className="hover:text-white">Community Center</Link></li>
              <li><Link to="/responsible-hosting" className="hover:text-white">Responsible Hosting</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm">
            © 2024 StayHere. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-300 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
