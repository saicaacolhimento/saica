import { supabase } from '@/config/supabase'
import {
  Mensagem,
  CreateMensagemData,
  UpdateMensagemData,
  Conversa,
  CreateConversaData,
  UpdateConversaData
} from '@/types/mensagem'

export const mensagemService = {
  // Mensagens
  async getMensagens(conversaId: string): Promise<Mensagem[]> {
    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('data_envio', { ascending: true })

    if (error) throw error
    return data
  },

  async getMensagemById(id: string): Promise<Mensagem> {
    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createMensagem(data: CreateMensagemData): Promise<Mensagem> {
    const { data: mensagem, error } = await supabase
      .from('mensagens')
      .insert([{ ...data, lida: false }])
      .select()
      .single()

    if (error) throw error
    return mensagem
  },

  async updateMensagem(id: string, data: UpdateMensagemData): Promise<Mensagem> {
    const { data: mensagem, error } = await supabase
      .from('mensagens')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mensagem
  },

  async deleteMensagem(id: string): Promise<void> {
    const { error } = await supabase
      .from('mensagens')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async marcarComoLida(id: string): Promise<Mensagem> {
    const { data: mensagem, error } = await supabase
      .from('mensagens')
      .update({ lida: true, data_leitura: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mensagem
  },

  // Conversas
  async getConversas(usuarioId: string): Promise<Conversa[]> {
    const { data, error } = await supabase
      .from('conversas')
      .select('*')
      .or(`participante1_id.eq.${usuarioId},participante2_id.eq.${usuarioId}`)
      .order('data_ultima_mensagem', { ascending: false })

    if (error) throw error
    return data
  },

  async getConversaById(id: string): Promise<Conversa> {
    const { data, error } = await supabase
      .from('conversas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createConversa(data: CreateConversaData): Promise<Conversa> {
    const { data: conversa, error } = await supabase
      .from('conversas')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return conversa
  },

  async updateConversa(id: string, data: UpdateConversaData): Promise<Conversa> {
    const { data: conversa, error } = await supabase
      .from('conversas')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return conversa
  },

  async deleteConversa(id: string): Promise<void> {
    const { error } = await supabase
      .from('conversas')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 