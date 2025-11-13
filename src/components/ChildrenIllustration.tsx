import React from 'react';
import Logo from './Logo';

const ChildrenIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-full flex flex-col items-center">
      <div className="h-32 sm:h-48 w-full relative overflow-x-auto overflow-y-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-r from-saica-baby-blue via-saica-light-blue to-saica-baby-blue rounded-t-full"></div>
        
        <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-around">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
              <div className="w-6 h-8 sm:w-8 sm:h-12 relative">
                <div className="absolute bottom-0 w-full h-4 sm:h-6 bg-blue-400 rounded-md"></div>
                <div className="absolute bottom-4 sm:bottom-6 w-full h-2 sm:h-3 bg-red-400 rounded-full"></div>
                <div className="absolute bottom-6 sm:bottom-8 w-full h-3 sm:h-4 bg-yellow-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Child figure on the right */}
        <div className="absolute bottom-0 right-1/4 w-8 h-16 sm:w-12 sm:h-24">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-pink-300 absolute top-0 left-2"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-200 absolute top-5 sm:top-7 left-1 rounded-md"></div>
          <div className="w-2 h-5 sm:w-3 sm:h-7 bg-brown-500 absolute top-10 sm:top-14 left-4"></div>
        </div>
        
        {/* Child figure on the left */}
        <div className="absolute bottom-0 left-1/4 w-8 h-16 sm:w-12 sm:h-24">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-300 absolute top-0 left-2"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-200 absolute top-5 sm:top-7 left-1 rounded-md"></div>
          <div className="w-2 h-5 sm:w-3 sm:h-7 bg-brown-500 absolute top-10 sm:top-14 left-4"></div>
        </div>
      </div>
      <div className="mt-2 flex justify-center w-full">
        <div className="w-20 sm:w-28">
          {/* Logo centralizado e pequeno */}
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default ChildrenIllustration;
