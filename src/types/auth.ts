export type UserRole = 'admin' | 'master' | 'padrao' | 'orgao';

export interface BaseUser {
  id: string;
  email: string;
  nome: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  status: 'active' | 'blocked';
}

export interface MasterAdmin extends BaseUser {
  role: 'master';
}

export interface RegularUser extends BaseUser {
  role: 'admin' | 'padrao' | 'orgao';
  abrigo_id?: string;
  orgao_id?: string;
  funcao?: string;
}

export type User = MasterAdmin | RegularUser;

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
  password?: string;
  role?: Exclude<UserRole, 'master'>;
  status?: 'active' | 'blocked';
  abrigo_id?: string;
  orgao_id?: string;
  funcao?: string;
} 