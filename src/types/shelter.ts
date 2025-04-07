export type ShelterStatus = 'ativo' | 'inativo' | 'em_construcao';

export interface Shelter {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  capacidade: number;
  ocupacao_atual: number;
  status: ShelterStatus;
  descricao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateShelterData {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  capacidade: number;
  descricao?: string;
  observacoes?: string;
}

export interface UpdateShelterData {
  nome?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  capacidade?: number;
  status?: ShelterStatus;
  descricao?: string;
  observacoes?: string;
} 