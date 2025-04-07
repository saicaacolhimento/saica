export interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  tipo: 'email' | 'sms' | 'whatsapp' | 'sistema'
  status: 'pendente' | 'enviado' | 'erro'
  destinatario_id: string
  destinatario_tipo: 'usuario' | 'acolhido' | 'profissional'
  data_envio: string
  data_leitura?: string
  created_at: string
  updated_at: string
}

export interface CreateNotificacaoData {
  titulo: string
  mensagem: string
  tipo: 'email' | 'sms' | 'whatsapp' | 'sistema'
  destinatario_id: string
  destinatario_tipo: 'usuario' | 'acolhido' | 'profissional'
  data_envio: string
}

export interface UpdateNotificacaoData {
  titulo?: string
  mensagem?: string
  tipo?: 'email' | 'sms' | 'whatsapp' | 'sistema'
  status?: 'pendente' | 'enviado' | 'erro'
  data_envio?: string
  data_leitura?: string
}

export interface NotificacaoTemplate {
  id: string
  nome: string
  titulo: string
  mensagem: string
  tipo: 'email' | 'sms' | 'whatsapp' | 'sistema'
  variaveis: string[]
  created_at: string
  updated_at: string
}

export interface CreateNotificacaoTemplateData {
  nome: string
  titulo: string
  mensagem: string
  tipo: 'email' | 'sms' | 'whatsapp' | 'sistema'
  variaveis: string[]
}

export interface UpdateNotificacaoTemplateData {
  nome?: string
  titulo?: string
  mensagem?: string
  tipo?: 'email' | 'sms' | 'whatsapp' | 'sistema'
  variaveis?: string[]
} 