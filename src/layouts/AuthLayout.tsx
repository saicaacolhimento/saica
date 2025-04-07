import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            SAICA
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Acompanhamento Integrado de Crianças e Adolescentes
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
} 