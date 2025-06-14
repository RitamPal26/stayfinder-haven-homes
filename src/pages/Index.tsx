
import { Hero } from "@/components/Hero";
import { FeaturedListings } from "@/components/FeaturedListings";
import { EnhancedSearchBar } from "@/components/search/EnhancedSearchBar";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-16 -mt-32 relative z-10">
        <EnhancedSearchBar />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF5A5F] to-[#FF385C] bg-clip-text text-transparent">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover handpicked accommodations from around the world
          </p>
        </div>
        <FeaturedListings />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
