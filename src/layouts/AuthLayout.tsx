import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import headerImage from '@/assets/images/header-kids.png';
import logoSaica from '@/assets/images/logo-saica.png';
import diagramaSaica from '@/assets/images/diagrama-saica.png';
import Login from '@/features/auth/pages/Login';

export const AuthLayout = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full bg-white relative">
        <div className="w-full">
          <img 
            src={headerImage} 
            alt="Crianças desenhando" 
            className="w-full h-auto object-cover max-h-[570px]"
          />
        </div>
        <div className="absolute top-[475px] left-[50%] transform -translate-x-1/2">
          <img
            src={logoSaica}
            alt="Logo SAICA"
            className="w-32 h-auto"
          />
        </div>
        <div className="absolute top-[20px] right-4">
          <Login />
        </div>
      </header>

      {/* Title Bar */}
      <div className="w-full bg-[#6366F1] text-white h-[80px] flex items-center mt-[50px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-[2.5em] font-semibold text-center mb-0">
            Sistema de Acompanhamento Integrado de Crianças e Adolescentes
          </h1>
          <p className="text-[1.5em] -mt-2">
            Uma plataforma para auxiliar na integração entre CRAS, CAPS, CREAS,
            Conselho Tutelar e Abrigos de uma forma rápida e segura
          </p>
        </div>
      </div>

      {/* Diagrama SAICA e Card Informativo */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-1/2 pl-20">
            <img 
              src={diagramaSaica}
              alt="Diagrama de integração SAICA"
              className="w-full max-w-[500px] h-auto"
            />
          </div>
          <div className="w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-[500px]">
              <h2 className="text-[#6366F1] text-2xl font-bold mb-4 text-center">O QUE É O SISTEMA SAICA?</h2>
              <div className="space-y-4 text-gray-600 text-lg mb-8">
                <p>É uma plataforma onde o Abrigo cadastro o acolhido com todas informações pessoais.</p>
                <p>Os órgãos como CREAS, CRAS, CAPS, Conselho Tutelar acessam estas informações e podem também fazer a inserção de qualquer evolução por parte destas instituições no cadastro do respectivo acolhido.</p>
                <p>Desta forma, as informações são unificadas, com segurança e facilidade, criando assim uma rede de informações com históricos a nível nacional.</p>
                <p>Nossa plataforma tem além do cadastro completo do acolhido um sistema de agenda e mensagem integrado entre todos e um sistema único.</p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white py-2 px-8 rounded transition-colors font-semibold"
                >
                  FALE CONOSCO
                </button>
              </div>

              {/* Formulário de Contato */}
              {showForm && (
                <form className="space-y-4 mt-6">
                  <div>
                    <input
                      type="text"
                      placeholder="NOME"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="E-MAIL"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="MENSAGEM"
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-2 px-4 rounded transition-colors"
                    >
                      ENVIAR MENSAGEM
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-auto bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2024 SAICA - Sistema de Acompanhamento Integrado de Crianças e Adolescentes
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout; 