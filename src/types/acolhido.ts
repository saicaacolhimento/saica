export interface AcolhidoFoto {
  id: string
  url: string
}

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
  fotos?: AcolhidoFoto[]
} 