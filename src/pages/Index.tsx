
import { Hero } from "@/components/Hero";
import { FeaturedListings } from "@/components/FeaturedListings";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <FeaturedListings />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
