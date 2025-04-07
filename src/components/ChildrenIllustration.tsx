
import React from 'react';

const ChildrenIllustration: React.FC = () => {
  return (
    <div className="h-48 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-saica-baby-blue via-saica-light-blue to-saica-baby-blue rounded-t-full"></div>
      
      <div className="absolute bottom-4 w-full flex justify-around">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
            <div className="w-8 h-12 relative">
              <div className="absolute bottom-0 w-full h-6 bg-blue-400 rounded-md"></div>
              <div className="absolute bottom-6 w-full h-3 bg-red-400 rounded-full"></div>
              <div className="absolute bottom-8 w-full h-4 bg-yellow-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Child figure on the right */}
      <div className="absolute bottom-0 right-1/4 w-12 h-24">
        <div className="w-8 h-8 rounded-full bg-pink-300 absolute top-0 left-2"></div>
        <div className="w-10 h-10 bg-blue-200 absolute top-7 left-1 rounded-md"></div>
        <div className="w-3 h-7 bg-brown-500 absolute top-14 left-4"></div>
      </div>
      
      {/* Child figure on the left */}
      <div className="absolute bottom-0 left-1/4 w-12 h-24">
        <div className="w-8 h-8 rounded-full bg-green-300 absolute top-0 left-2"></div>
        <div className="w-10 h-10 bg-yellow-200 absolute top-7 left-1 rounded-md"></div>
        <div className="w-3 h-7 bg-brown-500 absolute top-14 left-4"></div>
      </div>
    </div>
  );
};

export default ChildrenIllustration;
