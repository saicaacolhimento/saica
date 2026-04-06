import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  module: string;
  type?: 'read' | 'write' | 'delete';
  children: ReactNode;
}

export function ProtectedRoute({ module, type = 'read', children }: ProtectedRouteProps) {
  const { canAccess, isLoadingPermissions, isMaster } = usePermissions();

  if (isLoadingPermissions) return null;

  if (isMaster || canAccess(module, type)) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Lock className="h-12 w-12 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-600">Acesso Restrito</h2>
      <p className="text-gray-400 mt-2">Você não tem permissão para acessar este módulo.</p>
      <p className="text-sm text-gray-400 mt-1">Solicite acesso ao administrador.</p>
    </div>
  );
}
