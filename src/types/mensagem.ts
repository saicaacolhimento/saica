export interface Mensagem {
  id: string
  conversa_id: string
  remetente_id: string
  destinatario_id: string
  conteudo: string
  lida: boolean
  data_envio: string
  data_leitura?: string
  created_at: string
  updated_at: string
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

export interface ContatoInfo {
  id: string
  nome: string
  email: string
  role: string
  empresa_id?: string
}
