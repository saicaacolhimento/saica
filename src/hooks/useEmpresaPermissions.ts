import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { empresaPermissionService } from '@/services/empresaPermissions';
import type { EmpresaPermission } from '@/types/permissions';

export function useEmpresaPermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<EmpresaPermission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      if (!user?.empresa_type) return;

      try {
        const data = await empresaPermissionService.getEmpresaPermissionByType(user.empresa_type);
        setPermissions(data);
      } catch (error) {
        console.error('Erro ao carregar permissões:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, [user?.empresa_type]);

  const can = (section: keyof EmpresaPermission['permissions'], action: string) => {
    if (!permissions) return false;
    return permissions.permissions[section]?.[action] || false;
  };

  return {
    permissions,
    loading,
    can,
  };
} 