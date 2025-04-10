import { supabase } from '@/config/supabase';
import type { Shelter, CreateShelterData, UpdateShelterData } from '@/types/shelter';

export const shelterService = {
  async getShelters(): Promise<Shelter[]> {
    const { data, error } = await supabase
      .from('abrigos')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data;
  },

  async getShelterById(id: string): Promise<Shelter> {
    const { data, error } = await supabase
      .from('abrigos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createShelter(shelterData: CreateShelterData): Promise<Shelter> {
    const { data, error } = await supabase
      .from('abrigos')
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

  async updateShelter(id: string, shelterData: UpdateShelterData): Promise<Shelter> {
    const { data, error } = await supabase
      .from('abrigos')
      .update({
        ...shelterData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteShelter(id: string): Promise<void> {
    const { error } = await supabase
      .from('abrigos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateOccupancy(id: string, ocupacao: number): Promise<Shelter> {
    const { data, error } = await supabase
      .from('abrigos')
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
    const fileName = `${tempId}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('abrigos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('abrigos')
      .getPublicUrl(filePath);

    return publicUrl;
  }
}; 