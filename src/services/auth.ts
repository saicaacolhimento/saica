import { supabase } from '@/config/supabase';
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
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw new Error(userError.message);

    if (userData.status === 'blocked') {
      await supabase.auth.signOut();
      throw new Error('Usuário bloqueado. Entre em contato com o administrador.');
    }

    // Atualiza último login
    await supabase
      .from('usuarios')
      .update({ ultimo_login: new Date().toISOString() })
      .eq('id', userData.id);

    return userData;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw new Error(sessionError.message);
    if (!session) return null;

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) throw new Error(userError.message);
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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw new Error(authError.message);

    try {
      const { data: newUser, error: userError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user!.id,
            email: userData.email,
            nome: userData.nome,
            role: userData.role,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (userError) throw userError;
      return newUser;
    } catch (error) {
      // Rollback: remove o usuário auth se houver erro ao criar no banco
      await supabase.auth.admin.deleteUser(authData.user!.id);
      throw error;
    }
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<void> {
    const updates: any = {
      nome: userData.nome,
      email: userData.email,
      role: userData.role,
      updated_at: new Date().toISOString(),
    };

    if (userData.password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        id,
        { password: userData.password }
      );
      if (passwordError) throw new Error(passwordError.message);
    }

    const { error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const { error } = await supabase.auth.admin.updateUserById(
      id,
      { password: newPassword }
    );
    if (error) throw new Error(error.message);
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
}; 