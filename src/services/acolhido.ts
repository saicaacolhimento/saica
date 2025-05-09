import { supabase } from '@/config/supabase'
import {
  Acolhido,
  CreateAcolhidoData,
  UpdateAcolhidoData,
  AcolhidoFoto,
  CreateAcolhidoFotoData,
  UpdateAcolhidoFotoData
} from '@/types/acolhido'
import { api } from "@/lib/api";
import { FormValues } from "@/pages/AcolhidoCadastro";

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
  },

  async getAll() {
    const response = await api.get("/acolhidos");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/acolhidos/${id}`);
    return response.data;
  },

  async create(data: FormValues) {
    const response = await api.post("/acolhidos", data);
    return response.data;
  },

  async update(id: string, data: Partial<FormValues>) {
    const response = await api.put(`/acolhidos/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/acolhidos/${id}`);
    return response.data;
  },

  async uploadPhoto(file: File, acolhidoId: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("acolhidoId", acolhidoId);

    const response = await api.post("/acolhidos/upload-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async uploadDocument(file: File, acolhidoId: string, type: 'rg' | 'cpf' | 'certidaoNascimento' | 'certidaoCasamento') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('acolhidoId', acolhidoId);
    formData.append('type', type);

    const response = await api.post('/acolhidos/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
} 