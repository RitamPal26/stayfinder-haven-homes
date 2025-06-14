
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEOHead 
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to StayFinder to find your perfect accommodation."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-4">
          <div className="mb-8">
            <div className="text-6xl font-bold text-[#FF5A5F] mb-2 animate-pulse">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Page not found</h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to finding your perfect stay.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              asChild 
              className="w-full bg-[#FF5A5F] hover:bg-[#E04E53] text-white"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
