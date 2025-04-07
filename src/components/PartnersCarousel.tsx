
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PartnersCarousel: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto mt-12 relative">
      <div className="flex overflow-x-auto py-4 hide-scrollbar space-x-8 justify-center">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={`/placeholder.svg`}
                alt={`Partner ${index + 1}`}
                className="w-20 h-20 md:w-28 md:h-28 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PartnersCarousel;
