export interface Mensagem {
  id: string
  conteudo: string
  remetente_id: string
  destinatario_id: string
  lida: boolean
  data_envio: string
  data_leitura?: string
  created_at: string
  updated_at: string
}

export interface CreateMensagemData {
  conteudo: string
  remetente_id: string
  destinatario_id: string
}

export interface UpdateMensagemData {
  conteudo?: string
  lida?: boolean
  data_leitura?: string
}

export interface Conversa {
  id: string
  participante1_id: string
  participante2_id: string
  ultima_mensagem?: string
  data_ultima_mensagem?: string
  created_at: string
  updated_at: string
}

export interface CreateConversaData {
  participante1_id: string
  participante2_id: string
}

export interface UpdateConversaData {
  ultima_mensagem?: string
  data_ultima_mensagem?: string
} 