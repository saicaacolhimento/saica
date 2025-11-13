import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/config/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Definir tipo User completo
interface UserFull {
  id: string;
  email: string;
  nome?: string;
  role?: string;
  empresa_id?: string;
  [key: string]: any;
}

interface AuthContextType {
  session: Session | null;
  user: UserFull | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTriedSession, setHasTriedSession] = useState(false);

  useEffect(() => {
    console.log('[AuthContext] Estado atual:', { user, session, loading });
    if (hasTriedSession) return; // Não tenta de novo
    console.log('[AuthContext] useEffect montado');
    // Verificar sessão atual
    async function getInitialSession() {
      console.log('[DEBUG] Entrou no getInitialSession');
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      console.log('[DEBUG] Resultado do getSession:', { data, error });
      if (error || !data.session) {
        setSession(null);
        setUser(null);
        setLoading(false);
        console.log('[DEBUG] Sem sessão, liberando loading instantaneamente para tela inicial.');
        return;
      }
      setSession(data.session);
      // NÃO consultar a tabela usuarios aqui!
      const { user: authUser } = data.session;
      if (authUser) {
        setUser(authUser);
      }
      setLoading(false);
      console.log('[DEBUG] Fim do getInitialSession, loading liberado');
    }
    getInitialSession();
    setHasTriedSession(true);

    // Configurar listener para alterações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[AuthContext] Evento de autenticação:', {
          event,
          newSession,
          user: newSession?.user || null
        });

        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log('[AuthContext] Usuário deslogado ou deletado');
          setSession(null);
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('[AuthContext] Usuário autenticado ou token atualizado');
          setSession(newSession);

          if (newSession?.user) {
            setUser(newSession.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    // Adicionar listener para storage
    const handleStorageChange = (e: StorageEvent) => {
      console.log('[AuthContext] StorageEvent:', e);
      if (e.key === 'saica-auth-token') {
        console.log('[AuthContext] Mudança detectada no localStorage:', {
          key: e.key,
          oldValue: e.oldValue ? 'presente' : 'ausente',
          newValue: e.newValue ? 'presente' : 'ausente'
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      console.log('[AuthContext] Limpando listeners');
      authListener.subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  async function logout() {
    setLoading(true);
    try {
      console.log('[AuthContext] Logout iniciado');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthContext] Erro ao fazer logout:', error);
        throw error;
      }
      console.log('[AuthContext] Logout realizado com sucesso');
      setSession(null);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('[AuthContext] Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    session,
    user,
    loading,
    logout
  };

  // Renderizar loading global enquanto loading for true
  if (loading) {
    return <div style={{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 