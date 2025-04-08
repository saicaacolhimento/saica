import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData);
      navigate(from, { replace: true });
    } catch (error) {
      // Erro já é tratado no contexto de autenticação
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        placeholder="USUÁRIO"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="bg-gray-100 h-[35px] text-sm w-[200px]"
        value={formData.email}
        onChange={e =>
          setFormData(prev => ({ ...prev, email: e.target.value }))
        }
      />
      <div className="relative">
        <Input
          placeholder="SENHA"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          className="bg-gray-100 h-[35px] text-sm w-[200px] pr-8"
          value={formData.password}
          onChange={e =>
            setFormData(prev => ({ ...prev, password: e.target.value }))
          }
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-[20px] w-[20px] p-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      <Button
        type="submit"
        className="bg-[#6366F1] hover:bg-[#4F46E5] min-w-[35px] h-[35px] p-0"
        disabled={loading}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-[35px] w-[35px]">
        <HelpCircle className="h-5 w-5 text-[#4267B2]" />
      </Button>
    </form>
  );
} 