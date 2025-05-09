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
  genero?: string
  tipo_sanguineo?: string
  alergias?: string
  medicamentos?: string
  deficiencias?: string
  escola?: string
  serie?: string
  turno?: string
  observacoes_educacionais?: string
  nome_responsavel?: string
  parentesco_responsavel?: string
  cpf_responsavel?: string
  telefone_responsavel?: string
  endereco_responsavel?: string
  data_entrada?: string
  motivo_acolhimento?: string
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
  genero?: string
  tipo_sanguineo?: string
  alergias?: string
  medicamentos?: string
  deficiencias?: string
  escola?: string
  serie?: string
  turno?: string
  observacoes_educacionais?: string
  nome_responsavel?: string
  parentesco_responsavel?: string
  cpf_responsavel?: string
  telefone_responsavel?: string
  endereco_responsavel?: string
  data_entrada?: string
  motivo_acolhimento?: string
  rg_file?: File
  cpf_file?: File
  certidaoNascimento_file?: File
  certidaoCasamento_file?: File
  carteira_vacinacao_file?: File
  fotos?: File[]
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
  genero?: string
  tipo_sanguineo?: string
  alergias?: string
  medicamentos?: string
  deficiencias?: string
  escola?: string
  serie?: string
  turno?: string
  observacoes_educacionais?: string
  nome_responsavel?: string
  parentesco_responsavel?: string
  cpf_responsavel?: string
  telefone_responsavel?: string
  endereco_responsavel?: string
  data_entrada?: string
  motivo_acolhimento?: string
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
export interface UpdateAcolhidoFotoData {
  url?: string
  tipo?: 'foto_perfil' | 'foto_documento'
} 