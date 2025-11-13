export type ShelterStatus = 'ativo' | 'inativo' | 'em_construcao';

export interface Shelter {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  postal_code: string;
  telefone: string;
  email: string;
  capacidade: number;
  ocupacao_atual: number;
  status: ShelterStatus;
  descricao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  responsavel_nome: string;
  responsavel_telefone: string;
  responsavel_email: string;
  master_email: string;
  master_password_hash: string;
}

export interface CreateShelterData {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  postal_code: string;
  telefone: string;
  telefone_orgao?: string;
  email: string;
  capacidade: string;
  logo_url?: string;
  responsavel_nome: string;
  responsavel_telefone: string;
  responsavel_email: string;
  master_email: string;
  master_password_hash: string;
}

// Interface apenas para o formulário
export interface ShelterFormData {
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  postal_code: string;
  telefone: string;
  telefone_orgao?: string;
  email: string;
  capacidade: string;
  logo_url?: string;
  responsavel_nome: string;
  responsavel_telefone: string;
  responsavel_email: string;
  master_email: string;
  master_password: string;
  confirm_password: string;
}

export interface UpdateShelterData {
  nome?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  postal_code?: string;
  telefone?: string;
  email?: string;
  capacidade?: number;
  ocupacao?: number;
  status?: ShelterStatus;
  descricao?: string;
  observacoes?: string;
  logo_url?: string;
  responsavel_nome?: string;
  responsavel_telefone?: string;
  responsavel_email?: string;
  master_email?: string;
  master_password_hash?: string;
  empresas_vinculadas?: string[];
} 