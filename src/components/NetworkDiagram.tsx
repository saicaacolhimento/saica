
import React from 'react';
import Logo from './Logo';

const NetworkDiagram: React.FC = () => {
  const connections = [
    { label: "CASA LAR", position: "top-8 left-8" },
    { label: "ABRIGO", position: "top-8 right-8" },
    { label: "CAPS", position: "bottom-40 left-8" },
    { label: "CRAS", position: "bottom-40 right-8" },
    { label: "CREAS", position: "bottom-8 left-8" },
    { label: "CONSELHO TUTELAR", position: "bottom-8 right-8" }
  ];

  return (
    <div className="relative h-96 w-96 mx-auto mt-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <Logo />
      </div>
      
      {connections.map((connection, index) => (
        <div key={index} className={`absolute ${connection.position} text-saica-blue font-bold text-center`}>
          {connection.label}
          <div className="border-dashed border-saica-blue border w-16 h-px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default NetworkDiagram;
