export interface Acolhido {
  id: string
  nome: string
  data_nascimento: string
  nome_mae: string
  cpf?: string
  rg?: string
  endereco?: string
  telefone?: string
  foto_url?: string
  abrigo_id: string
  status: 'ativo' | 'inativo'
  created_at: string
  updated_at: string
}

export interface CreateAcolhidoData {
  nome: string
  data_nascimento: string
  nome_mae: string
  cpf?: string
  rg?: string
  endereco?: string
  telefone?: string
  foto_url?: string
  abrigo_id: string
}

export interface UpdateAcolhidoData {
  nome?: string
  data_nascimento?: string
  nome_mae?: string
  cpf?: string
  rg?: string
  endereco?: string
  telefone?: string
  foto_url?: string
  abrigo_id?: string
  status?: 'ativo' | 'inativo'
}

export interface AcolhidoFoto {
  id: string
  acolhido_id: string
  url: string
  tipo: 'foto_perfil' | 'foto_documento'
  created_at: string
  updated_at: string
}

export interface CreateAcolhidoFotoData {
  acolhido_id: string
  url: string
  tipo: 'foto_perfil' | 'foto_documento'
}

export interface UpdateAcolhidoFotoData {
  url?: string
  tipo?: 'foto_perfil' | 'foto_documento'
} 