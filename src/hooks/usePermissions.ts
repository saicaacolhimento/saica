import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { permissionService } from '@/services/permissions'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'

export const usePermissions = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()

  // Queries
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionService.getPermissions,
    enabled: !!user
  })

  const { data: userPermissions, isLoading: isLoadingUserPermissions } = useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: () => user ? permissionService.getUserPermissions(user.id) : null,
    enabled: !!user
  })

  // Mutations
  const createPermissionMutation = useMutation({
    mutationFn: permissionService.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast({
        title: 'Sucesso',
        description: 'Permissão criada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar permissão',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      permissionService.updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast({
        title: 'Sucesso',
        description: 'Permissão atualizada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar permissão',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deletePermissionMutation = useMutation({
    mutationFn: permissionService.deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast({
        title: 'Sucesso',
        description: 'Permissão excluída com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir permissão',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateUserPermissionMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      permissionService.updateUserPermission(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions'] })
      toast({
        title: 'Sucesso',
        description: 'Permissões do usuário atualizadas com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar permissões do usuário',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  // Funções de verificação de permissão
  const hasPermission = async (table: string, field: string, permissionType: string): Promise<boolean> => {
    if (!user) return false
    return permissionService.checkPermission(user.id, table, field, permissionType)
  }

  const hasReadPermission = async (table: string, field: string): Promise<boolean> => {
    return hasPermission(table, field, 'read')
  }

  const hasWritePermission = async (table: string, field: string): Promise<boolean> => {
    return hasPermission(table, field, 'write')
  }

  const hasDeletePermission = async (table: string, field: string): Promise<boolean> => {
    return hasPermission(table, field, 'delete')
  }

  const hasAdminPermission = async (table: string, field: string): Promise<boolean> => {
    return hasPermission(table, field, 'admin')
  }

  return {
    permissions,
    userPermissions,
    isLoadingPermissions,
    isLoadingUserPermissions,
    createPermission: createPermissionMutation.mutate,
    updatePermission: updatePermissionMutation.mutate,
    deletePermission: deletePermissionMutation.mutate,
    updateUserPermission: updateUserPermissionMutation.mutate,
    hasPermission,
    hasReadPermission,
    hasWritePermission,
    hasDeletePermission,
    hasAdminPermission
  }
} 