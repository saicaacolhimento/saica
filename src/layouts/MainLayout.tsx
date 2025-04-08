import React from 'react';
import { Outlet } from 'react-router-dom';
import headerImage from '@/assets/images/header-kids.png';
import footerImage from '@/assets/images/footer-kids.png';
import logoSaica from '@/assets/images/logo-saica.png';
import diagramaSaica from '@/assets/images/diagrama-saica.png';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full bg-white relative">
        <div className="w-full">
          <img 
            src={headerImage} 
            alt="Crianças desenhando" 
            className="w-full h-auto object-cover max-h-[200px]"
          />
        </div>
        <div className="absolute top-4 left-[32.5%] transform -translate-x-1/2">
          <img
            src={logoSaica}
            alt="Logo SAICA"
            className="w-32 h-auto"
          />
        </div>
      </header>

      {/* Title Bar */}
      <div className="w-full bg-[#6366F1] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">
            SISTEMA DE ACOLHIMENTO INSTITUCIONAL DE CRIANÇAS E ADOLESCENTES
          </h1>
          <p className="text-sm mt-1">
            Plataforma para auxiliar na integração entre CRAS, CAPS, CREAS,
            Conselho Tutelar e Abrigos de uma forma rápida e segura
          </p>
        </div>
      </div>

      {/* Diagrama SAICA */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          <div className="w-1/2">
            <img 
              src={diagramaSaica}
              alt="Diagrama de integração SAICA"
              className="w-full max-w-[500px] h-auto"
            />
          </div>
          <div className="w-1/2">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-auto">
        <img 
          src={footerImage} 
          alt="Crianças brincando" 
          className="w-full h-auto object-cover"
        />
      </footer>
    </div>
  );
};

export default MainLayout; 