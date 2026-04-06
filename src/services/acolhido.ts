import { supabase } from '@/config/supabase'
import {
  Acolhido,
  CreateAcolhidoData,
  UpdateAcolhidoData,
  AcolhidoFoto,
  CreateAcolhidoFotoData,
  UpdateAcolhidoFotoData
} from '@/types/acolhido'

export const acolhidoService = {
  async getAcolhidos(page = 1, perPage = 10): Promise<{ data: Acolhido[], total: number }> {
    const { count, error: countError } = await supabase
      .from('acolhidos')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const { data, error } = await supabase
      .from('acolhidos')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0
    };
  },

  async getAcolhidoById(id: string): Promise<Acolhido> {
    const { data, error } = await supabase
      .from('acolhidos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error;
    if (!data) throw new Error('Acolhido não encontrado');

    return data;
  },

  async createAcolhido(data: CreateAcolhidoData): Promise<Acolhido> {
    const payload = {
      ...data,
      data_nascimento: data.data_nascimento === '' ? null : data.data_nascimento,
      data_entrada: (data as any).data_entrada === '' ? null : (data as any).data_entrada,
      data_inativacao: (data as any).data_inativacao === '' ? null : (data as any).data_inativacao,
      status: 'ativo'
    };

    const { data: acolhido, error } = await supabase
      .from('acolhidos')
      .insert([payload])
      .select()
      .single()

    if (error) throw error;
    if (!acolhido) throw new Error('Erro ao criar acolhido: nenhum dado retornado');

    return acolhido;
  },

  async updateAcolhido(id: string, data: UpdateAcolhidoData): Promise<Acolhido> {
    const payload = {
      ...data,
      data_nascimento: data.data_nascimento === '' ? null : data.data_nascimento,
      data_entrada: (data as any).data_entrada === '' ? null : (data as any).data_entrada,
      data_inativacao: (data as any).data_inativacao === '' ? null : (data as any).data_inativacao,
    };

    const { data: acolhido, error } = await supabase
      .from('acolhidos')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error;
    if (!acolhido) throw new Error('Erro ao atualizar acolhido: nenhum dado retornado');

    return acolhido;
  },

  async deleteAcolhido(id: string): Promise<void> {
    const { error } = await supabase
      .from('acolhidos')
      .delete()
      .eq('id', id)

    if (error) throw error;
  },

  async getAcolhidoFotos(acolhidoId: string): Promise<AcolhidoFoto[]> {
    const { data, error } = await supabase
      .from('acolhido_fotos')
      .select('*')
      .eq('acolhido_id', acolhidoId)
      .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
  },

  async getFotosByAcolhidoIds(ids: string[]): Promise<AcolhidoFoto[]> {
    if (!ids || ids.length === 0) return [];
    const { data, error } = await supabase
      .from('acolhido_fotos')
      .select('*')
      .in('acolhido_id', ids)
      .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
  },

  async createAcolhidoFoto(data: CreateAcolhidoFotoData): Promise<AcolhidoFoto> {
    const { data: foto, error } = await supabase
      .from('acolhido_fotos')
      .insert([data])
      .select()
      .single()

    if (error) throw error;
    if (!foto) throw new Error('Erro ao criar foto: nenhum dado retornado');

    return foto;
  },

  async updateAcolhidoFoto(id: string, data: UpdateAcolhidoFotoData): Promise<AcolhidoFoto> {
    const { data: foto, error } = await supabase
      .from('acolhido_fotos')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error;
    if (!foto) throw new Error('Erro ao atualizar foto: nenhum dado retornado');

    return foto;
  },

  async deleteAcolhidoFoto(id: string): Promise<void> {
    const { error } = await supabase
      .from('acolhido_fotos')
      .delete()
      .eq('id', id)

    if (error) throw error;
  },

  getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('acolhidos')
      .getPublicUrl(path)
    return publicUrl;
  },

  async uploadFoto(file: File, acolhidoId: string, tipo: 'foto_perfil' | 'foto_documento'): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${acolhidoId}/${tipo}/${Math.random()}.${fileExt}`
    const filePath = `acolhidos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('acolhidos')
      .upload(filePath, file)

    if (uploadError) throw uploadError;

    return this.getPublicUrl(filePath);
  }
}
