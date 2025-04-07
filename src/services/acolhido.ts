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
  // Acolhidos
  async getAcolhidos(): Promise<Acolhido[]> {
    const { data, error } = await supabase
      .from('acolhidos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getAcolhidoById(id: string): Promise<Acolhido> {
    const { data, error } = await supabase
      .from('acolhidos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createAcolhido(data: CreateAcolhidoData): Promise<Acolhido> {
    const { data: acolhido, error } = await supabase
      .from('acolhidos')
      .insert([{ ...data, status: 'ativo' }])
      .select()
      .single()

    if (error) throw error
    return acolhido
  },

  async updateAcolhido(id: string, data: UpdateAcolhidoData): Promise<Acolhido> {
    const { data: acolhido, error } = await supabase
      .from('acolhidos')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return acolhido
  },

  async deleteAcolhido(id: string): Promise<void> {
    const { error } = await supabase
      .from('acolhidos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Fotos
  async getAcolhidoFotos(acolhidoId: string): Promise<AcolhidoFoto[]> {
    const { data, error } = await supabase
      .from('acolhido_fotos')
      .select('*')
      .eq('acolhido_id', acolhidoId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createAcolhidoFoto(data: CreateAcolhidoFotoData): Promise<AcolhidoFoto> {
    const { data: foto, error } = await supabase
      .from('acolhido_fotos')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return foto
  },

  async updateAcolhidoFoto(id: string, data: UpdateAcolhidoFotoData): Promise<AcolhidoFoto> {
    const { data: foto, error } = await supabase
      .from('acolhido_fotos')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return foto
  },

  async deleteAcolhidoFoto(id: string): Promise<void> {
    const { error } = await supabase
      .from('acolhido_fotos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Upload de Fotos
  async uploadFoto(file: File, acolhidoId: string, tipo: 'foto_perfil' | 'foto_documento'): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${acolhidoId}/${tipo}/${Math.random()}.${fileExt}`
    const filePath = `acolhidos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('acolhidos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('acolhidos')
      .getPublicUrl(filePath)

    return publicUrl
  }
} 