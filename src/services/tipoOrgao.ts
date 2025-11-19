import { supabase } from '@/config/supabase';
import type { TipoOrgao, CreateTipoOrgaoData, UpdateTipoOrgaoData } from '@/types/tipoOrgao';

export const tipoOrgaoService = {
  async getTiposOrgaos(): Promise<TipoOrgao[]> {
    try {
      console.log('[tipoOrgaoService] Buscando todos os tipos de órgãos...');
      const { data, error } = await supabase
        .from('tipos_orgaos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) {
        console.error('[tipoOrgaoService] Erro ao buscar tipos de órgãos:', error);
        throw error;
      }
      
      console.log('[tipoOrgaoService] Tipos de órgãos encontrados:', data?.length || 0, data);
      return data || [];
    } catch (error: any) {
      console.error('[tipoOrgaoService] Erro completo:', error);
      // Se a tabela não existir, retornar array vazio em vez de quebrar
      if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
        console.warn('[tipoOrgaoService] Tabela tipos_orgaos não existe. Execute a migration.');
        return [];
      }
      throw error;
    }
  },

  async getTiposOrgaosAtivos(): Promise<TipoOrgao[]> {
    const { data, error } = await supabase
      .from('tipos_orgaos')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getTipoOrgaoById(id: string): Promise<TipoOrgao> {
    const { data, error } = await supabase
      .from('tipos_orgaos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createTipoOrgao(tipoOrgaoData: CreateTipoOrgaoData): Promise<TipoOrgao> {
    const { data, error } = await supabase
      .from('tipos_orgaos')
      .insert([
        {
          ...tipoOrgaoData,
          ativo: tipoOrgaoData.ativo ?? true,
          ordem: tipoOrgaoData.ordem ?? 0,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTipoOrgao(id: string, tipoOrgaoData: UpdateTipoOrgaoData): Promise<TipoOrgao> {
    const { data, error } = await supabase
      .from('tipos_orgaos')
      .update({
        ...tipoOrgaoData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTipoOrgao(id: string): Promise<void> {
    const { error } = await supabase
      .from('tipos_orgaos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

