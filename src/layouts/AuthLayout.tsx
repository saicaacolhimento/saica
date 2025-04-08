import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import headerImage from '@/assets/images/header-kids.png';
import footerImage from '@/assets/images/footer-kids.png';
import logoSaica from '@/assets/images/logo-saica.png';
import Login from '@/features/auth/pages/Login';

export const AuthLayout = () => {
  const { user } = useAuth();

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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

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

export default AuthLayout; 