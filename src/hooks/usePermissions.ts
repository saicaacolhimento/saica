import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useMemo } from 'react'
import { supabase } from '@/config/supabase'

const MODULES = ['dashboard', 'empresas', 'usuarios', 'acolhidos', 'agenda', 'financeiro', 'documentos', 'atividades', 'configuracoes', 'relatorios', 'mensagens'] as const
export type AppModule = typeof MODULES[number]
export { MODULES }

export const ACOLHIDO_FIELDS = [
  { key: 'nome', label: 'Nome', group: 'Dados Pessoais' },
  { key: 'data_nascimento', label: 'Data de Nascimento', group: 'Dados Pessoais' },
  { key: 'genero', label: 'Gênero', group: 'Dados Pessoais' },
  { key: 'cpf', label: 'CPF', group: 'Dados Pessoais' },
  { key: 'rg', label: 'RG', group: 'Dados Pessoais' },
  { key: 'foto_url', label: 'Foto', group: 'Dados Pessoais' },
  { key: 'endereco', label: 'Endereço', group: 'Dados Pessoais' },
  { key: 'telefone', label: 'Telefone', group: 'Dados Pessoais' },
  { key: 'tipo_sanguineo', label: 'Tipo Sanguíneo', group: 'Saúde' },
  { key: 'alergias', label: 'Alergias', group: 'Saúde' },
  { key: 'medicamentos', label: 'Medicamentos', group: 'Saúde' },
  { key: 'deficiencias', label: 'Deficiências', group: 'Saúde' },
  { key: 'escola', label: 'Escola', group: 'Educação' },
  { key: 'serie', label: 'Série', group: 'Educação' },
  { key: 'turno', label: 'Turno', group: 'Educação' },
  { key: 'observacoes_educacionais', label: 'Observações Educacionais', group: 'Educação' },
  { key: 'nome_mae', label: 'Nome da Mãe', group: 'Família' },
  { key: 'nome_responsavel', label: 'Nome do Responsável', group: 'Família' },
  { key: 'parentesco_responsavel', label: 'Parentesco do Responsável', group: 'Família' },
  { key: 'cpf_responsavel', label: 'CPF do Responsável', group: 'Família' },
  { key: 'telefone_responsavel', label: 'Telefone do Responsável', group: 'Família' },
  { key: 'endereco_responsavel', label: 'Endereço do Responsável', group: 'Família' },
  { key: 'data_entrada', label: 'Data de Entrada', group: 'Acolhimento' },
  { key: 'motivo_acolhimento', label: 'Motivo do Acolhimento', group: 'Acolhimento' },
] as const

export type AcolhidoFieldKey = typeof ACOLHIDO_FIELDS[number]['key']

interface UserModulePermission {
  id: string
  user_id: string
  module: string
  can_read: boolean
  can_write: boolean
  can_delete: boolean
  visible_fields?: Record<string, boolean>
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
    const map: Record<string, { read: boolean; write: boolean; delete: boolean; visible_fields?: Record<string, boolean> }> = {}
    if (myPermissions) {
      for (const p of myPermissions) {
        map[p.module] = { read: p.can_read, write: p.can_write, delete: p.can_delete, visible_fields: p.visible_fields }
      }
    }
    return map
  }, [myPermissions])

  const hasAnyPermissions = myPermissions != null && myPermissions.length > 0

  const canAccess = useCallback((module: string, type: 'read' | 'write' | 'delete' = 'read'): boolean => {
    if (!user) return false
    if (isMaster) return true
    if (!hasAnyPermissions) {
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

  const canSeeField = useCallback((module: string, field: string): boolean => {
    if (!user) return false
    if (isMaster) return true
    if (!hasAnyPermissions) return true
    const perm = permMap[module]
    if (!perm) return false
    if (!perm.visible_fields || Object.keys(perm.visible_fields).length === 0) return true
    return perm.visible_fields[field] !== false
  }, [user, isMaster, hasAnyPermissions, permMap])

  // --- Admin functions ---

  const getUserPermissions = useCallback(async (targetUserId: string): Promise<UserModulePermission[]> => {
    const { data, error } = await supabase
      .from('user_module_permissions')
      .select('*')
      .eq('user_id', targetUserId)
    if (error) throw error
    return data || []
  }, [])

  const saveUserPermissions = useMutation({
    mutationFn: async ({ targetUserId, permissions }: {
      targetUserId: string,
      permissions: { module: string; can_read: boolean; can_write: boolean; can_delete: boolean; visible_fields?: Record<string, boolean> }[]
    }) => {
      const { error: deleteError } = await supabase.from('user_module_permissions').delete().eq('user_id', targetUserId)
      if (deleteError) throw deleteError
      const rows = permissions
        .filter(p => p.can_read || p.can_write || p.can_delete)
        .map(p => ({
          user_id: targetUserId,
          module: p.module,
          can_read: p.can_read,
          can_write: p.can_write,
          can_delete: p.can_delete,
          visible_fields: p.visible_fields || {},
        }))
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
    canSeeField,
    isMaster,
    isAdmin,
    userRole,
    getUserPermissions,
    saveUserPermissions: saveUserPermissions.mutateAsync,
    isSaving: saveUserPermissions.isPending,
  }
}
