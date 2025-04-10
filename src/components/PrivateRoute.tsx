import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('PrivateRoute - Estado atual:', { user, loading });
    
    // Verificamos se o usuário está logado via localStorage
    const session = localStorage.getItem('supabase.auth.token');
    console.log('Session do localStorage:', !!session);
  }, [user, loading]);

  // Simplifique o carregamento para evitar problemas
  if (loading) {
    console.log('PrivateRoute - Carregando...');
    return <div>Carregando...</div>;
  }

  if (!user) {
    console.log('PrivateRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/" replace />;
  }

  console.log('PrivateRoute - Usuário autenticado, renderizando conteúdo protegido');
  return <>{children || <Outlet />}</>;
} 