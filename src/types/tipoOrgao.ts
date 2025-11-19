export interface TipoOrgao {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTipoOrgaoData {
  nome: string;
  codigo: string;
  descricao?: string;
  ativo?: boolean;
  ordem?: number;
}

export interface UpdateTipoOrgaoData {
  nome?: string;
  codigo?: string;
  descricao?: string;
  ativo?: boolean;
  ordem?: number;
}

