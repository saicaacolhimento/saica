
import React from 'react';

const ChildrenDrawing: React.FC = () => {
  return (
    <div className="w-full h-64 relative">
      <div className="absolute bottom-0 left-4 w-16 h-24">
        <div className="w-8 h-8 rounded-full bg-red-300 absolute top-0 left-4"></div>
        <div className="w-12 h-12 bg-blue-200 absolute top-8 left-2"></div>
        <div className="w-4 h-8 bg-brown-500 absolute top-16 left-6"></div>
      </div>

      <div className="absolute bottom-0 left-24 w-16 h-24">
        <div className="w-8 h-8 rounded-full bg-orange-300 absolute top-0 left-4"></div>
        <div className="w-12 h-12 bg-pink-200 absolute top-8 left-2"></div>
        <div className="w-4 h-8 bg-brown-500 absolute top-16 left-6"></div>
      </div>

      <div className="absolute bottom-0 right-24 w-16 h-24">
        <div className="w-8 h-8 rounded-full bg-green-300 absolute top-0 left-4"></div>
        <div className="w-12 h-12 bg-yellow-200 absolute top-8 left-2"></div>
        <div className="w-4 h-8 bg-brown-500 absolute top-16 left-6"></div>
      </div>

      <div className="absolute bottom-0 right-4 w-16 h-24">
        <div className="w-8 h-8 rounded-full bg-yellow-300 absolute top-0 left-4"></div>
        <div className="w-12 h-12 bg-orange-200 absolute top-8 left-2"></div>
        <div className="w-4 h-8 bg-brown-500 absolute top-16 left-6"></div>
      </div>

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-16">
        <div className="w-20 h-12 bg-blue-100 rounded-lg absolute top-0 left-2"></div>
        <div className="w-8 h-8 bg-red-100 rounded-full absolute top-4 left-8"></div>
      </div>
    </div>
  );
};

export default ChildrenDrawing;
