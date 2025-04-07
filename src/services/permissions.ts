import { supabase } from '@/config/supabase'
import {
  Permission,
  CreatePermissionData,
  UpdatePermissionData,
  UserPermission,
  CreateUserPermissionData,
  UpdateUserPermissionData,
  ShelterPermission,
  CreateShelterPermissionData,
  UpdateShelterPermissionData,
  OrgaoPermission,
  CreateOrgaoPermissionData,
  UpdateOrgaoPermissionData
} from '@/types/permissions'

export const permissionService = {
  // Permissões Gerais
  async getPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createPermission(data: CreatePermissionData): Promise<Permission> {
    const { data: permission, error } = await supabase
      .from('permissions')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return permission
  },

  async updatePermission(id: string, data: UpdatePermissionData): Promise<Permission> {
    const { data: permission, error } = await supabase
      .from('permissions')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return permission
  },

  async deletePermission(id: string): Promise<void> {
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Permissões por Usuário
  async getUserPermissions(userId: string): Promise<UserPermission> {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*, permissions(*)')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async createUserPermission(data: CreateUserPermissionData): Promise<UserPermission> {
    const { data: permission, error } = await supabase
      .from('user_permissions')
      .insert([data])
      .select('*, permissions(*)')
      .single()

    if (error) throw error
    return permission
  },

  async updateUserPermission(userId: string, data: UpdateUserPermissionData): Promise<UserPermission> {
    const { data: permission, error } = await supabase
      .from('user_permissions')
      .update(data)
      .eq('user_id', userId)
      .select('*, permissions(*)')
      .single()

    if (error) throw error
    return permission
  },

  // Permissões por Abrigo
  async getShelterPermissions(shelterId: string): Promise<ShelterPermission> {
    const { data, error } = await supabase
      .from('shelter_permissions')
      .select('*, permissions(*)')
      .eq('shelter_id', shelterId)
      .single()

    if (error) throw error
    return data
  },

  async createShelterPermission(data: CreateShelterPermissionData): Promise<ShelterPermission> {
    const { data: permission, error } = await supabase
      .from('shelter_permissions')
      .insert([data])
      .select('*, permissions(*)')
      .single()

    if (error) throw error
    return permission
  },

  async updateShelterPermission(shelterId: string, data: UpdateShelterPermissionData): Promise<ShelterPermission> {
    const { data: permission, error } = await supabase
      .from('shelter_permissions')
      .update(data)
      .eq('shelter_id', shelterId)
      .select('*, permissions(*)')
      .single()

    if (error) throw error
    return permission
  },

  // Permissões por Órgão
  async getOrgaoPermissions(orgaoId: string): Promise<OrgaoPermission> {
    const { data, error } = await supabase
      .from('orgao_permissions')
      .select('*, permissions(*)')
      .eq('orgao_id', orgaoId)
      .single()

    if (error) throw error
    return data
  },

  async createOrgaoPermission(data: CreateOrgaoPermissionData): Promise<OrgaoPermission> {
    const { data: permission, error } = await supabase
      .from('orgao_permissions')
      .insert([data])
      .select('*, permissions(*)')
      .single()

    if (error) throw error
    return permission
  },

  async updateOrgaoPermission(orgaoId: string, data: UpdateOrgaoPermissionData): Promise<OrgaoPermission> {
    const { data: permission, error } = await supabase
      .from('orgao_permissions')
      .update(data)
      .eq('orgao_id', orgaoId)
      .select('*, permissions(*)')
      .single()

    if (error) throw error
    return permission
  },

  // Verificação de Permissões
  async checkPermission(userId: string, table: string, field: string, permissionType: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_permission', {
        p_user_id: userId,
        p_table: table,
        p_field: field,
        p_permission_type: permissionType
      })

    if (error) throw error
    return data
  }
} 