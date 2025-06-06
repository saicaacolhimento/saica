import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/config/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] useEffect montado');
    // Verificar sessão atual
    async function getInitialSession() {
      setLoading(true);
      try {
        console.log('[AuthContext] Iniciando verificação de sessão...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Erro ao verificar sessão:', error);
          setSession(null);
          setUser(null);
          return;
        }
        
        console.log('[AuthContext] Sessão inicial:', {
          session: data.session ? {
            expires_at: data.session.expires_at,
            user: data.session.user ? {
              id: data.session.user.id,
              email: data.session.user.email
            } : null
          } : null
        });

        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('[AuthContext] Nenhuma sessão encontrada');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Erro inesperado ao verificar sessão:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // Configurar listener para alterações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[AuthContext] Evento de autenticação:', {
          event,
          newSession,
          user: newSession?.user || null
        });
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log('[AuthContext] Usuário deslogado ou deletado', {
            event,
            newSession,
            user: newSession?.user || null
          });
          setSession(null);
          setUser(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('[AuthContext] Usuário autenticado ou token atualizado', {
            event,
            newSession,
            user: newSession?.user || null
          });
          setSession(newSession);
          setUser(newSession?.user || null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthContext] Token atualizado', {
            event,
            newSession
          });
          setSession(newSession);
        }
        setLoading(false);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 