import { supabase } from '@/config/supabase';
import { EmpresaPermission, CreateEmpresaPermissionData } from '@/types/permissions';

export const empresaPermissionService = {
  async getEmpresaPermissions(): Promise<EmpresaPermission[]> {
    try {
      const { data, error } = await supabase
        .from('empresa_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[empresaPermissionService] Erro ao buscar permissões:', error);
      throw error;
    }
  },

  async getEmpresaPermissionByType(type: string): Promise<EmpresaPermission> {
    try {
      const { data, error } = await supabase
        .from('empresa_permissions')
        .select('*')
        .eq('empresa_type', type)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[empresaPermissionService] Erro ao buscar permissão:', error);
      throw error;
    }
  },

  async createEmpresaPermission(data: CreateEmpresaPermissionData): Promise<EmpresaPermission> {
    try {
      const { data: permission, error } = await supabase
        .from('empresa_permissions')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return permission;
    } catch (error) {
      console.error('[empresaPermissionService] Erro ao criar permissão:', error);
      throw error;
    }
  },

  async updateEmpresaPermission(type: string, data: Partial<EmpresaPermission>): Promise<EmpresaPermission> {
    try {
      const { data: permission, error } = await supabase
        .from('empresa_permissions')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('empresa_type', type)
        .select()
        .single();

      if (error) throw error;
      return permission;
    } catch (error) {
      console.error('[empresaPermissionService] Erro ao atualizar permissão:', error);
      throw error;
    }
  }
}; 