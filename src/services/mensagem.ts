import { supabase } from '@/config/supabase'
import { Mensagem, Conversa, ContatoInfo } from '@/types/mensagem'

export const mensagemService = {
  async getContatos(empresaId: string | null, currentUserId: string, isMaster: boolean): Promise<ContatoInfo[]> {
    let query = supabase
      .from('usuarios')
      .select('id, nome, email, role, empresa_id')
      .neq('id', currentUserId)
      .order('nome')

    if (isMaster) {
      query = query.neq('role', 'master')
    } else if (empresaId) {
      query = query.eq('empresa_id', empresaId).neq('role', 'master')
    } else {
      return []
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getConversas(userId: string): Promise<Conversa[]> {
    const { data, error } = await supabase
      .from('conversas')
      .select('*')
      .or(`participante1_id.eq.${userId},participante2_id.eq.${userId}`)
      .order('data_ultima_mensagem', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getOrCreateConversa(userId: string, otherUserId: string): Promise<Conversa> {
    const [p1, p2] = [userId, otherUserId].sort()
    const { data: existing } = await supabase
      .from('conversas')
      .select('*')
      .eq('participante1_id', p1)
      .eq('participante2_id', p2)
      .maybeSingle()

    if (existing) return existing

    const { data, error } = await supabase
      .from('conversas')
      .insert({ participante1_id: p1, participante2_id: p2 })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getMensagens(conversaId: string): Promise<Mensagem[]> {
    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('data_envio', { ascending: true })
    if (error) throw error
    return data || []
  },

  async sendMensagem(conversaId: string, remetenteId: string, destinatarioId: string, conteudo: string): Promise<Mensagem> {
    const { data, error } = await supabase
      .from('mensagens')
      .insert({ conversa_id: conversaId, remetente_id: remetenteId, destinatario_id: destinatarioId, conteudo, lida: false })
      .select()
      .single()
    if (error) throw error

    await supabase
      .from('conversas')
      .update({ ultima_mensagem: conteudo, data_ultima_mensagem: new Date().toISOString() })
      .eq('id', conversaId)

    return data
  },

  async marcarComoLida(conversaId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('mensagens')
      .update({ lida: true, data_leitura: new Date().toISOString() })
      .eq('conversa_id', conversaId)
      .eq('destinatario_id', userId)
      .eq('lida', false)
    if (error) throw error
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('mensagens')
      .select('*', { count: 'exact', head: true })
      .eq('destinatario_id', userId)
      .eq('lida', false)
    if (error) return 0
    return count || 0
  },

  async deleteConversa(id: string): Promise<void> {
    const { error } = await supabase.from('conversas').delete().eq('id', id)
    if (error) throw error
  }
}
