import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useMemo } from 'react'
import { supabase } from '@/config/supabase'

const MODULES = ['dashboard', 'empresas', 'usuarios', 'acolhidos', 'agenda', 'financeiro', 'documentos', 'atividades', 'configuracoes', 'relatorios', 'mensagens'] as const
export type AppModule = typeof MODULES[number]
export { MODULES }

interface UserModulePermission {
  id: string
  user_id: string
  module: string
  can_read: boolean
  can_write: boolean
  can_delete: boolean
}

export const usePermissions = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()

  const userId = user?.id
  const userRole = (user as any)?.role as string | undefined
  const isMaster = userRole === 'master'
  const isAdmin = userRole === 'admin' || isMaster

  const { data: myPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['userModulePermissions', userId],
    queryFn: async () => {
      if (!userId || isMaster) return null
      const { data, error } = await supabase
        .from('user_module_permissions')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data as UserModulePermission[]
    },
    enabled: !!userId && !isMaster,
  })

  const permMap = useMemo(() => {
    const map: Record<string, { read: boolean; write: boolean; delete: boolean }> = {}
    if (myPermissions) {
      for (const p of myPermissions) {
        map[p.module] = { read: p.can_read, write: p.can_write, delete: p.can_delete }
      }
    }
    return map
  }, [myPermissions])

  const hasAnyPermissions = myPermissions != null && myPermissions.length > 0

  const canAccess = useCallback((module: string, type: 'read' | 'write' | 'delete' = 'read'): boolean => {
    if (!user) return false
    if (isMaster) return true
    if (!hasAnyPermissions) {
      // Default: admin can access everything except empresas; others only dashboard
      if (isAdmin) return module !== 'empresas'
      return module === 'dashboard'
    }
    const perm = permMap[module]
    if (!perm) return false
    return perm[type]
  }, [user, isMaster, isAdmin, hasAnyPermissions, permMap])

  const canRead = useCallback((module: string) => canAccess(module, 'read'), [canAccess])
  const canWrite = useCallback((module: string) => canAccess(module, 'write'), [canAccess])
  const canDelete = useCallback((module: string) => canAccess(module, 'delete'), [canAccess])

  // --- Admin functions: manage permissions of other users ---

  const getUserPermissions = useCallback(async (targetUserId: string): Promise<UserModulePermission[]> => {
    const { data, error } = await supabase
      .from('user_module_permissions')
      .select('*')
      .eq('user_id', targetUserId)
    if (error) throw error
    return data || []
  }, [])

  const saveUserPermissions = useMutation({
    mutationFn: async ({ targetUserId, permissions }: { targetUserId: string, permissions: { module: string; can_read: boolean; can_write: boolean; can_delete: boolean }[] }) => {
      // Delete existing
      await supabase.from('user_module_permissions').delete().eq('user_id', targetUserId)
      // Insert new (only those with at least one true)
      const rows = permissions
        .filter(p => p.can_read || p.can_write || p.can_delete)
        .map(p => ({ user_id: targetUserId, module: p.module, can_read: p.can_read, can_write: p.can_write, can_delete: p.can_delete }))
      if (rows.length > 0) {
        const { error } = await supabase.from('user_module_permissions').insert(rows)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userModulePermissions'] })
      toast({ title: 'Sucesso', description: 'Permissões salvas com sucesso' })
    },
    onError: (err: any) => {
      toast({ title: 'Erro', description: err?.message || 'Erro ao salvar permissões', variant: 'destructive' })
    }
  })

  return {
    myPermissions,
    isLoadingPermissions,
    canAccess,
    canRead,
    canWrite,
    canDelete,
    isMaster,
    isAdmin,
    userRole,
    getUserPermissions,
    saveUserPermissions: saveUserPermissions.mutateAsync,
    isSaving: saveUserPermissions.isPending,
  }
}
