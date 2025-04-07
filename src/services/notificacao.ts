import { supabase } from '@/config/supabase'
import {
  Notificacao,
  CreateNotificacaoData,
  UpdateNotificacaoData,
  NotificacaoTemplate,
  CreateNotificacaoTemplateData,
  UpdateNotificacaoTemplateData
} from '@/types/notificacao'

export const notificacaoService = {
  // Notificações
  async getNotificacoes(): Promise<Notificacao[]> {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getNotificacaoById(id: string): Promise<Notificacao> {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getNotificacoesByDestinatario(
    destinatarioId: string,
    destinatarioTipo: 'usuario' | 'acolhido' | 'profissional'
  ): Promise<Notificacao[]> {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('destinatario_id', destinatarioId)
      .eq('destinatario_tipo', destinatarioTipo)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createNotificacao(data: CreateNotificacaoData): Promise<Notificacao> {
    const { data: notificacao, error } = await supabase
      .from('notificacoes')
      .insert([{ ...data, status: 'pendente' }])
      .select()
      .single()

    if (error) throw error
    return notificacao
  },

  async updateNotificacao(id: string, data: UpdateNotificacaoData): Promise<Notificacao> {
    const { data: notificacao, error } = await supabase
      .from('notificacoes')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return notificacao
  },

  async deleteNotificacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('notificacoes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async marcarComoLida(id: string): Promise<Notificacao> {
    const { data: notificacao, error } = await supabase
      .from('notificacoes')
      .update({ data_leitura: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return notificacao
  },

  // Templates
  async getTemplates(): Promise<NotificacaoTemplate[]> {
    const { data, error } = await supabase
      .from('notificacao_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getTemplateById(id: string): Promise<NotificacaoTemplate> {
    const { data, error } = await supabase
      .from('notificacao_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createTemplate(data: CreateNotificacaoTemplateData): Promise<NotificacaoTemplate> {
    const { data: template, error } = await supabase
      .from('notificacao_templates')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return template
  },

  async updateTemplate(id: string, data: UpdateNotificacaoTemplateData): Promise<NotificacaoTemplate> {
    const { data: template, error } = await supabase
      .from('notificacao_templates')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return template
  },

  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('notificacao_templates')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Envio de Notificações
  async enviarEmail(destinatario: string, titulo: string, mensagem: string): Promise<void> {
    // TODO: Implementar integração com serviço de email
    console.log('Enviando email:', { destinatario, titulo, mensagem })
  },

  async enviarSMS(destinatario: string, mensagem: string): Promise<void> {
    // TODO: Implementar integração com serviço de SMS
    console.log('Enviando SMS:', { destinatario, mensagem })
  },

  async enviarWhatsApp(destinatario: string, mensagem: string): Promise<void> {
    // TODO: Implementar integração com API do WhatsApp
    console.log('Enviando WhatsApp:', { destinatario, mensagem })
  }
} 