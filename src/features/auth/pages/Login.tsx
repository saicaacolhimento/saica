import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/config/supabase';
import { authService } from '@/services/auth';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Tentando fazer login com:', { email });
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        console.error('Erro na autenticação:', authError);
        setError('Email ou senha inválidos.');
        return;
      }

      if (!authData.user) {
        console.error('Usuário não encontrado após autenticação');
        setError('Usuário não encontrado.');
        return;
      }

      console.log('Login bem sucedido, buscando dados do usuário...');
      await authService.getCurrentUser();
      
      console.log('Redirecionando para dashboard...');
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error('Erro inesperado ao fazer login:', err);
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex justify-center md:justify-end">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 md:gap-1 w-full max-w-md">
        <Input
          type="text"
          placeholder="usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-8 w-full md:w-[180px] text-xs border-gray-300"
          required
          disabled={loading}
        />
        <div className="relative w-full md:w-auto">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 w-full md:w-[140px] text-xs border-gray-300"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
        <button
          type="submit"
          className="h-8 w-8 bg-blue-600 text-white rounded-sm flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          className="h-6 w-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          ?
        </button>
      </form>
      {error && (
        <div className="mt-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 