export interface Documento {
  id: string
  titulo: string
  descricao?: string
  tipo: 'rg' | 'cpf' | 'certidao_nascimento' | 'certidao_casamento' | 'carteira_trabalho' | 'outros'
  url: string
  acolhido_id: string
  status: 'ativo' | 'inativo'
  created_at: string
  updated_at: string
}

export interface CreateDocumentoData {
  titulo: string
  descricao?: string
  tipo: 'rg' | 'cpf' | 'certidao_nascimento' | 'certidao_casamento' | 'carteira_trabalho' | 'outros'
  url: string
  acolhido_id: string
}

export interface UpdateDocumentoData {
  titulo?: string
  descricao?: string
  tipo?: 'rg' | 'cpf' | 'certidao_nascimento' | 'certidao_casamento' | 'carteira_trabalho' | 'outros'
  url?: string
  acolhido_id?: string
  status?: 'ativo' | 'inativo'
}

export interface DocumentoMetadata {
  nome_original: string
  tipo_mime: string
  tamanho: number
  extensao: string
} 