import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/config/supabase';
import { Session } from '@supabase/supabase-js';

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
    if (hasTriedSession) return;

    async function getInitialSession() {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(data.session);
      if (data.session.user) {
        setUser(data.session.user);
      }
      setLoading(false);
    }

    getInitialSession();
    setHasTriedSession(true);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setSession(null);
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [hasTriedSession]);

  async function logout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }

  const value = { session, user, loading, logout };

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        Carregando...
      </div>
    );
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
