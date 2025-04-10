import { supabase } from '@/config/supabase';
import type { LoginCredentials, CreateUserData, UpdateUserData, User } from '@/types/auth';

const MASTER_ADMIN = {
  email: 'saicaacolhimento2025@gmail.com',
  uid: '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'
};

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<User> {
    console.log('Tentando fazer login...', { email });
    
    // 1. Autenticação com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Erro na autenticação:', authError);
      throw new Error(authError.message);
    }

    console.log('Login bem sucedido, verificando se é master admin...');

    // 2. Verifica se é o master admin
    if (email === MASTER_ADMIN.email && authData.user.id === MASTER_ADMIN.uid) {
      return {
        id: MASTER_ADMIN.uid,
        email: MASTER_ADMIN.email,
        nome: 'Master Admin',
        role: 'master' as const,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // 3. Se não for master admin, busca dados do usuário normal
    console.log('Buscando dados do usuário normal...');
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*, abrigos(*)')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError);
      await supabase.auth.signOut();
      throw new Error('Usuário não encontrado');
    }

    return userData;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Verifica se é master admin
    if (user.email === MASTER_ADMIN.email && user.id === MASTER_ADMIN.uid) {
      return {
        id: MASTER_ADMIN.uid,
        email: MASTER_ADMIN.email,
        nome: 'Master Admin',
        role: 'master' as const,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // Se não for master admin, busca dados do usuário normal
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*, abrigos(*)')
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