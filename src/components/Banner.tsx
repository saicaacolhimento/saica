import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="w-full bg-saica-blue text-white px-4 py-4 sm:px-6 sm:py-6 md:p-8 text-center shadow-md mb-4 rounded-b-lg">
      <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 break-words leading-tight whitespace-pre-line">
        SISTEMA DE ACOLHIMENTO INSTITUCIONAL DE CRIANÇAS E ADOLESCENTES
      </h1>
      <p className="text-xs sm:text-sm md:text-base break-words text-wrap">
        Plataforma para auxiliar na integração entre CRAS, CAPS, CREAS,
        <br className="hidden md:block" /> Conselho Tutelar e Abrigos de uma forma rápida e segura
      </p>
    </div>
  );
};

export default Banner;
