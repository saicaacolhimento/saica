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
    <div className="w-full max-w-full md:max-w-[220px] flex flex-col items-center md:overflow-hidden p-2">
      <div className="w-full flex justify-center mb-4">
        <Logo className="w-20 h-auto max-w-full mx-auto md:w-full md:max-w-[80px]" />
      </div>
      <div className="w-full flex flex-col items-center mt-2">
        {connections.map((connection, index) => (
          <div key={index} className="text-saica-blue font-bold text-center text-[10px] sm:text-xs md:text-base break-words w-full">
            {connection.label}
            <div className="border-dashed border-saica-blue border w-6 sm:w-10 h-px mx-auto my-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkDiagram;
