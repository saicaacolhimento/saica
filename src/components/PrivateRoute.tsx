import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  console.log('[PrivateRoute] Componente montado');
  const { user, loading, session } = useAuth();
  console.log('[PrivateRoute] Estado inicial:', { user, loading, session });

  useEffect(() => {
    console.log('[PrivateRoute] Estado atual:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      loading,
      session: session ? { 
        expires_at: session.expires_at,
        access_token: session.access_token ? 'presente' : 'ausente',
        refresh_token: session.refresh_token ? 'presente' : 'ausente'
      } : null
    });

    // Verificar token expirado
    if (session?.expires_at) {
      const tokenExpiration = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiration = tokenExpiration.getTime() - now.getTime();
      
      console.log('[PrivateRoute] Status do token:', {
        expira_em: tokenExpiration.toISOString(),
        tempo_restante: `${Math.floor(timeUntilExpiration / 1000)} segundos`,
        expirado: timeUntilExpiration <= 0
      });
    }
  }, [user, loading, session]);

  if (loading) {
    console.log('[PrivateRoute] Carregando...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !session || !session.access_token) {
    console.log('[PrivateRoute] Redirecionando para login:', {
      motivo: !user ? 'usuário não encontrado' : 
              !session ? 'sessão não encontrada' : 
              'token de acesso ausente'
    });
    return <Navigate to="/" replace />;
  }

  // Verifica se o token expirou
  const tokenExpiration = session.expires_at ? new Date(session.expires_at * 1000) : null;
  if (tokenExpiration && tokenExpiration < new Date()) {
    console.log('[PrivateRoute] Token expirado, redirecionando para login');
    return <Navigate to="/" replace />;
  }

  console.log('[PrivateRoute] Usuário autenticado, renderizando conteúdo protegido');
  return <>{children || <Outlet />}</>;
} 