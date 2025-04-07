export type UserRole = 'admin' | 'master' | 'padrao' | 'orgao';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  abrigo_id?: string;
  orgao_id?: string;
  funcao?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  ultimo_login?: string;
  tentativas_login: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  nome: string;
  role: UserRole;
  abrigo_id?: string;
  orgao_id?: string;
  funcao?: string;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  role?: UserRole;
  abrigo_id?: string;
  orgao_id?: string;
  funcao?: string;
  status?: UserStatus;
} 