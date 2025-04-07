import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authService } from '@/services/auth';
import type { User, UpdateUserData, UserRole } from '@/types/auth';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    nome: '',
    email: '',
    role: 'padrao',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // TODO: Implementar método para buscar usuário por ID
        const userData = await authService.getUserById(id!);
        setUser(userData);
        setFormData({
          nome: userData.nome,
          email: userData.email,
          role: userData.role,
        });
      } catch (error) {
        toast({
          title: 'Erro ao carregar usuário',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/admin/users');
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.updateUser(id!, formData);
      toast({
        title: 'Usuário atualizado',
        description: 'As informações do usuário foram atualizadas com sucesso.',
      });
      navigate('/admin/users');
    } catch (error) {
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Usuário</h1>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            Voltar
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={e =>
                  setFormData(prev => ({ ...prev, nome: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Papel
              </label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="orgao">Órgão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nova Senha (opcional)
              </label>
              <Input
                id="newPassword"
                type="password"
                value={formData.password || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/users')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 