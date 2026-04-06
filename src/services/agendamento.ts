import { supabase } from '@/config/supabase'
import {
  Agendamento,
  CreateAgendamentoData,
  UpdateAgendamentoData,
  AgendamentoNotificacao
} from '@/types/agendamento'

export const agendamentoService = {
  // Agendamentos
  async getAgendamentos(userId?: string, role?: string): Promise<Agendamento[]> {
    let query = supabase
      .from('agendamentos')
      .select('*')
      .order('data_hora', { ascending: true });

    if (userId && role !== 'master') {
      query = query.or(`criador_id.eq.${userId},participantes.cs.{${userId}}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
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

  async createAgendamento(payload: CreateAgendamentoData): Promise<Agendamento> {
    const row: Record<string, any> = {
      titulo: payload.titulo || null,
      descricao: payload.descricao || null,
      local: (payload as any).local || null,
      status: 'agendado',
    };

    const p = payload as any;

    if (p.data_hora) row.data_hora = p.data_hora;
    if (p.criador_id) row.criador_id = p.criador_id;
    if (Array.isArray(p.participantes) && p.participantes.length > 0) row.participantes = p.participantes;
    if (Array.isArray(p.acolhidos) && p.acolhidos.length > 0) row.acolhidos = p.acolhidos;
    if (p.recorrente != null) row.recorrente = p.recorrente;
    if (p.tipoRecorrencia && p.tipoRecorrencia !== 'nenhuma') row.tipoRecorrencia = p.tipoRecorrencia;
    if (p.dataFinalRecorrencia && p.dataFinalRecorrencia !== '') row.dataFinalRecorrencia = p.dataFinalRecorrencia;
    if (p.eventos_adicionais) row.eventos_adicionais = p.eventos_adicionais;
    if (p.tipo) row.tipo = p.tipo;
    if (p.observacoes) row.observacoes = p.observacoes;

    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .insert([row])
      .select()
      .single();

    if (error) throw error;

    // Notificar cada participante (exceto o criador)
    const participantes: string[] = row.participantes || [];
    const criadorId = row.criador_id;
    const destinatarios = participantes.filter(uid => uid !== criadorId);

    if (destinatarios.length > 0) {
      const dataFormatada = row.data_hora
        ? new Date(row.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        : '';

      const notificacoes = destinatarios.map(uid => ({
        titulo: `Novo agendamento: ${row.titulo || 'Sem título'}`,
        mensagem: `Você foi incluído no agendamento "${row.titulo}"${dataFormatada ? ` em ${dataFormatada}` : ''}${row.local ? ` - ${row.local}` : ''}.`,
        tipo: 'agendamento',
        destinatario_id: uid,
        remetente_id: criadorId || null,
        lida: false,
        agendamento_id: agendamento.id,
      }));

      await supabase.from('notificacoes').insert(notificacoes);
    }

    return agendamento;
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