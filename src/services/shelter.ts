import { supabase } from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { Shelter, CreateShelterData, UpdateShelterData } from '@/types/shelter';

export const shelterService = {
  async getShelters(page = 1, pageSize = 20): Promise<Shelter[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('empresas')
      .select('id, nome, cnpj, cidade, estado, capacidade, ocupacao_atual, status, logo_url, tipo')
      .order('nome')
      .range(from, to);

    if (error) throw error;
    return data;
  },

  async getShelterById(id: string): Promise<Shelter> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createShelter(shelterData: CreateShelterData): Promise<Shelter> {
    const { data, error } = await supabase
      .from('empresas')
      .insert([
        {
          ...shelterData,
          status: 'ativo',
          ocupacao_atual: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateShelter(id: string, shelterData: UpdateShelterData, createdBy?: string): Promise<Shelter> {
    console.log('🚀 Iniciando updateShelter:', { id, shelterData, createdBy });
    
    try {
      console.log('📝 Preparando dados para atualização:', {
        ...shelterData,
        created_by: createdBy,
        updated_at: new Date().toISOString(),
      });

    const { data, error } = await supabase
      .from('empresas')
      .update({
        ...shelterData,
          created_by: createdBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

      if (error) {
        console.error('❌ Erro na atualização do Supabase:', {
          error,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          errorCode: error.code
        });
        throw error;
      }

      console.log('✅ Atualização concluída com sucesso:', data);
    return data;
    } catch (error) {
      console.error('❌ Erro não tratado em updateShelter:', error);
      throw error;
    }
  },

  async deleteShelter(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateOccupancy(id: string, ocupacao: number): Promise<Shelter> {
    const { data, error } = await supabase
      .from('empresas')
      .update({
        ocupacao_atual: ocupacao,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadLogo(file: File, tempId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    let fileName = `${tempId}-${uuidv4()}.${fileExt}`;
    fileName = fileName.replace(/^logotipos\//, '').replace(/^logotipos\//, '');
    const filePath = `logotipos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('empresas')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('empresas')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async updateAllShelterLogos(shelterLogos: { id: string, logo_url: string }[]): Promise<void> {
    for (const shelter of shelterLogos) {
      const { error } = await supabase
        .from('empresas')
        .update({ logo_url: shelter.logo_url })
        .eq('id', shelter.id);
      if (error) throw error;
    }
  },
}; 