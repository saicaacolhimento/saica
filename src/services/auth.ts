import { supabase } from '@/config/supabase';
import { api } from '@/lib/api';
import type { LoginCredentials, CreateUserData, UpdateUserData, User } from '@/types/auth';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*, abrigos(*)')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw new Error('Usuário não encontrado');

    return userData;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nome, email, role, status, empresa_id, cargo, telefone, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (userError) return null;
    return userData;
  },

  async getUserById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post('/admin/criar-usuario', userData);
    const result = response.data;
    return {
      id: result.userId,
      email: userData.email,
      nome: userData.nome,
      role: userData.role,
      status: 'active',
      cargo: userData.cargo,
      empresa_id: userData.empresa_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<void> {
    await api.put(`/admin/atualizar-usuario/${id}`, userData);
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await api.post('/admin/alterar-senha', { userId: id, novaSenha: newPassword });
  },

  async blockUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({ status: 'blocked', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async unblockUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getAllMasters(): Promise<User[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, telefone, cargo, created_at, empresa_id, empresas(id, nome, logo_url, cnpj, cidade)')
      .eq('role', 'master');
    if (error) throw error;
    return data as User[];
  },

  async getUsersByEmpresa(empresa_id: string): Promise<{ data: User[]; error: unknown }> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, telefone, cargo, role, status, empresa_id, created_at, updated_at')
      .eq('empresa_id', empresa_id)
      .order('created_at', { ascending: false });

    return { data: (data as User[]) || [], error };
  },

  async getAllAdmins(): Promise<User[]> {
    const { data, error } = await supabase.rpc('get_admins_with_user_count');
    if (error) throw error;
    return data as User[];
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getAllUsuarios(): Promise<User[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, cargo, role')
      .neq('role', 'master');
    if (error) throw error;
    return data as User[];
  },
};
