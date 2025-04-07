import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth';
import type { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isMaster: () => boolean;
  isOrgao: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setState(prev => ({
          ...prev,
          user,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }
    };

    initAuth();
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await authService.login(credentials);

      if (user.status === 'blocked') {
        throw new Error('Usuário bloqueado. Entre em contato com o administrador.');
      }

      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }));

      // Redirecionar baseado no papel do usuário
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));

      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await authService.logout();
      setState({ user: null, loading: false, error: null });
      navigate('/login');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));

      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const isAdmin = () => state.user?.role === 'admin';
  const isMaster = () => state.user?.role === 'master';
  const isOrgao = () => state.user?.role === 'orgao';

  return (
    <AuthContext.Provider 
      value={{ 
        ...state, 
        signIn, 
        signOut,
        isAdmin,
        isMaster,
        isOrgao,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 