import { supabase } from '@/config/supabase'
import {
  Documento,
  CreateDocumentoData,
  UpdateDocumentoData,
  DocumentoMetadata
} from '@/types/documento'

export const documentoService = {
  // Documentos
  async getDocumentos(): Promise<Documento[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getDocumentoById(id: string): Promise<Documento> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getDocumentosByAcolhido(acolhidoId: string): Promise<Documento[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('acolhido_id', acolhidoId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createDocumento(data: CreateDocumentoData): Promise<Documento> {
    const { data: documento, error } = await supabase
      .from('documentos')
      .insert([{ ...data, status: 'ativo' }])
      .select()
      .single()

    if (error) throw error
    return documento
  },

  async updateDocumento(id: string, data: UpdateDocumentoData): Promise<Documento> {
    const { data: documento, error } = await supabase
      .from('documentos')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return documento
  },

  async deleteDocumento(id: string): Promise<void> {
    const { error } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Upload de Documentos
  async uploadDocumento(file: File, acolhidoId: string): Promise<{ url: string; metadata: DocumentoMetadata }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${acolhidoId}/${Math.random()}.${fileExt}`
    const filePath = `documentos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath)

    const metadata: DocumentoMetadata = {
      nome_original: file.name,
      tipo_mime: file.type,
      tamanho: file.size,
      extensao: fileExt || ''
    }

    return { url: publicUrl, metadata }
  },

  // Download de Documentos
  async downloadDocumento(url: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('documentos')
      .download(url)

    if (error) throw error
    return data
  }
} 