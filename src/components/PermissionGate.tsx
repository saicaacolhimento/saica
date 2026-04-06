import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  module: string;
  type?: 'read' | 'write' | 'delete';
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ module, type = 'read', children, fallback = null }: PermissionGateProps) {
  const { canAccess, isLoadingPermissions } = usePermissions();

  if (isLoadingPermissions) return null;
  if (!canAccess(module, type)) return <>{fallback}</>;
  return <>{children}</>;
}
