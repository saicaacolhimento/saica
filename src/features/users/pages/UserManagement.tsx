import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authService } from '@/services/auth';
import type { User, CreateUserData, UserRole } from '@/types/auth';

export default function UserManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserData>({
    email: '',
    password: '',
    nome: '',
    role: 'padrao',
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.createUser(newUser);
      setUsers(prev => [...prev, user]);
      setIsCreateDialogOpen(false);
      toast({
        title: 'Usuário criado',
        description: 'O usuário foi criado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await authService.blockUser(userId);
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: 'blocked' } : user
        )
      );
      toast({
        title: 'Usuário bloqueado',
        description: 'O usuário foi bloqueado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao bloquear usuário',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await authService.unblockUser(userId);
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: 'active' } : user
        )
      );
      toast({
        title: 'Usuário desbloqueado',
        description: 'O usuário foi desbloqueado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao desbloquear usuário',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Criar Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo usuário
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nome">Nome</label>
                <Input
                  id="nome"
                  value={newUser.nome}
                  onChange={e => setNewUser(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role">Papel</label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) =>
                    setNewUser(prev => ({ ...prev, role: value }))
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
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      Editar
                    </Button>
                    {user.status === 'active' ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBlockUser(user.id)}
                      >
                        Bloquear
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUnblockUser(user.id)}
                      >
                        Desbloquear
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 