export interface Agendamento {
  id: string
  titulo: string
  descricao?: string
  data_hora: string
  tipo: 'consulta' | 'exame' | 'procedimento' | 'outros'
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido'
  acolhido_id: string
  profissional_id: string
  local: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface CreateAgendamentoData {
  titulo: string
  descricao?: string
  data_hora: string
  tipo: 'consulta' | 'exame' | 'procedimento' | 'outros'
  acolhido_id: string
  profissional_id: string
  local: string
  observacoes?: string
}

export interface UpdateAgendamentoData {
  titulo?: string
  descricao?: string
  data_hora?: string
  tipo?: 'consulta' | 'exame' | 'procedimento' | 'outros'
  status?: 'agendado' | 'confirmado' | 'cancelado' | 'concluido'
  acolhido_id?: string
  profissional_id?: string
  local?: string
  observacoes?: string
}

export interface AgendamentoNotificacao {
  id: string
  agendamento_id: string
  tipo: 'email' | 'sms' | 'whatsapp'
  status: 'pendente' | 'enviado' | 'erro'
  data_envio: string
  created_at: string
  updated_at: string
} 