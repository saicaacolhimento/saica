import { supabase } from '@/config/supabase';
import type { TipoOrgao, CreateTipoOrgaoData, UpdateTipoOrgaoData } from '@/types/tipoOrgao';

export const tipoOrgaoService = {
  async getTiposOrgaos(): Promise<TipoOrgao[]> {
    const { data, error } = await supabase
      .from('tipos_orgaos')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
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

