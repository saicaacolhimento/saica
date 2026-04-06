import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
    return <Navigate to="/" replace />;
  }

  return <>{children || <Outlet />}</>;
}
