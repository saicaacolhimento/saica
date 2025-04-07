export interface User {
  id: string;
  email: string;
  role: 'admin' | 'master' | 'padrao' | 'orgao';
  name: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
  orgao_id?: string;
  abrigo_id?: string;
  funcao?: string;
  status: 'active' | 'blocked';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 