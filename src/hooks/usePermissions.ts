import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { permissionService } from '@/services/permissions'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useMemo } from 'react'

export const usePermissions = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()

  const userRole = (user as any)?.role as string | undefined

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionService.getPermissions,
    enabled: !!user
  })

  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useQuery({
    queryKey: ['rolePermissions', userRole],
    queryFn: async () => {
      if (!userRole || userRole === 'master') return null
      const { data, error } = await (await import('@/config/supabase')).supabase
        .from('permissions')
        .select('*')
        .eq('role', userRole)
      if (error) throw error
      return data
    },
    enabled: !!userRole && userRole !== 'master',
  })

  const permissionSet = useMemo(() => {
    if (!rolePermissions) return new Set<string>()
    return new Set(
      rolePermissions.map((p: any) => `${p.table || p.table_name}:${p.permission_type}`)
    )
  }, [rolePermissions])

  const canAccess = useCallback((module: string, type: 'read' | 'write' | 'delete' | 'admin' = 'read'): boolean => {
    if (!user) return false
    if (userRole === 'master') return true
    return permissionSet.has(`${module}:${type}`)
  }, [user, userRole, permissionSet])

  const canRead = useCallback((module: string) => canAccess(module, 'read'), [canAccess])
  const canWrite = useCallback((module: string) => canAccess(module, 'write'), [canAccess])
  const canDelete = useCallback((module: string) => canAccess(module, 'delete'), [canAccess])

  const createPermissionMutation = useMutation({
    mutationFn: permissionService.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] })
      toast({ title: 'Sucesso', description: 'Permissão criada com sucesso' })
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao criar permissão', variant: 'destructive' })
    }
  })

  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      permissionService.updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] })
      toast({ title: 'Sucesso', description: 'Permissão atualizada com sucesso' })
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao atualizar permissão', variant: 'destructive' })
    }
  })

  const deletePermissionMutation = useMutation({
    mutationFn: permissionService.deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] })
      toast({ title: 'Sucesso', description: 'Permissão excluída com sucesso' })
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao excluir permissão', variant: 'destructive' })
    }
  })

  return {
    permissions,
    rolePermissions,
    isLoadingPermissions,
    isLoadingRolePermissions,
    canAccess,
    canRead,
    canWrite,
    canDelete,
    isMaster: userRole === 'master',
    userRole,
    createPermission: createPermissionMutation.mutate,
    updatePermission: updatePermissionMutation.mutate,
    deletePermission: deletePermissionMutation.mutate,
  }
}
