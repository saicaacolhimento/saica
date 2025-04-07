
import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="w-full bg-saica-blue text-white p-6 text-center shadow-md">
      <h1 className="text-lg md:text-2xl font-bold mb-2">
        SISTEMA DE ACOLHIMENTO INSTITUCIONAL DE CRIANÇAS E ADOLESCENTES
      </h1>
      <p className="text-sm md:text-base">
        Plataforma para auxiliar na integração entre CRAS, CAPS, CREAS,
        <br className="hidden md:block" /> Conselho Tutelar e Abrigos de uma forma rápida e segura
      </p>
    </div>
  );
};

export default Banner;
