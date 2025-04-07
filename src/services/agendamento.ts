import { supabase } from '@/config/supabase'
import {
  Agendamento,
  CreateAgendamentoData,
  UpdateAgendamentoData,
  AgendamentoNotificacao
} from '@/types/agendamento'

export const agendamentoService = {
  // Agendamentos
  async getAgendamentos(): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('data_hora', { ascending: true })

    if (error) throw error
    return data
  },

  async getAgendamentoById(id: string): Promise<Agendamento> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getAgendamentosByAcolhido(acolhidoId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('acolhido_id', acolhidoId)
      .order('data_hora', { ascending: true })

    if (error) throw error
    return data
  },

  async getAgendamentosByProfissional(profissionalId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('profissional_id', profissionalId)
      .order('data_hora', { ascending: true })

    if (error) throw error
    return data
  },

  async createAgendamento(data: CreateAgendamentoData): Promise<Agendamento> {
    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .insert([{ ...data, status: 'agendado' }])
      .select()
      .single()

    if (error) throw error
    return agendamento
  },

  async updateAgendamento(id: string, data: UpdateAgendamentoData): Promise<Agendamento> {
    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return agendamento
  },

  async deleteAgendamento(id: string): Promise<void> {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Notificações
  async getNotificacoesByAgendamento(agendamentoId: string): Promise<AgendamentoNotificacao[]> {
    const { data, error } = await supabase
      .from('agendamento_notificacoes')
      .select('*')
      .eq('agendamento_id', agendamentoId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createNotificacao(data: Omit<AgendamentoNotificacao, 'id' | 'created_at' | 'updated_at'>): Promise<AgendamentoNotificacao> {
    const { data: notificacao, error } = await supabase
      .from('agendamento_notificacoes')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return notificacao
  },

  async updateNotificacao(id: string, data: Partial<AgendamentoNotificacao>): Promise<AgendamentoNotificacao> {
    const { data: notificacao, error } = await supabase
      .from('agendamento_notificacoes')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return notificacao
  },

  async deleteNotificacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('agendamento_notificacoes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 