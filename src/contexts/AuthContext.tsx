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
    // Verificar sessão atual
    async function getInitialSession() {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          return;
        }
        
        console.log('[AuthContext] Sessão inicial:', data.session);
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Erro inesperado ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // Configurar listener para alterações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('[AuthContext] Evento de autenticação:', event, newSession);
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    setLoading(true);
    try {
      console.log('[AuthContext] Logout iniciado');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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