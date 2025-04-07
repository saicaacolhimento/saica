import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { shelterService } from '@/services/shelter';
import type { Shelter, CreateShelterData } from '@/types/shelter';

export default function ShelterList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newShelter, setNewShelter] = useState<CreateShelterData>({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    capacidade: 0,
  });

  const { data: shelters, isLoading } = useQuery({
    queryKey: ['shelters'],
    queryFn: shelterService.getShelters,
  });

  const createMutation = useMutation({
    mutationFn: shelterService.createShelter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelters'] });
      toast({
        title: 'Abrigo criado',
        description: 'O abrigo foi criado com sucesso.',
      });
      setIsCreateDialogOpen(false);
      setNewShelter({
        nome: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        email: '',
        capacidade: 0,
      });
    },
    onError: error => {
      toast({
        title: 'Erro ao criar abrigo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: shelterService.deleteShelter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelters'] });
      toast({
        title: 'Abrigo excluído',
        description: 'O abrigo foi excluído com sucesso.',
      });
    },
    onError: error => {
      toast({
        title: 'Erro ao excluir abrigo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(newShelter);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este abrigo?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredShelters = shelters?.filter(shelter =>
    shelter.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Abrigos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Abrigo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Abrigo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={newShelter.nome}
                  onChange={e =>
                    setNewShelter(prev => ({ ...prev, nome: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={newShelter.endereco}
                  onChange={e =>
                    setNewShelter(prev => ({ ...prev, endereco: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={newShelter.cidade}
                    onChange={e =>
                      setNewShelter(prev => ({ ...prev, cidade: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={newShelter.estado}
                    onChange={e =>
                      setNewShelter(prev => ({ ...prev, estado: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={newShelter.cep}
                    onChange={e =>
                      setNewShelter(prev => ({ ...prev, cep: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={newShelter.telefone}
                    onChange={e =>
                      setNewShelter(prev => ({ ...prev, telefone: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newShelter.email}
                  onChange={e =>
                    setNewShelter(prev => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade</Label>
                <Input
                  id="capacidade"
                  type="number"
                  min="0"
                  value={newShelter.capacidade}
                  onChange={e =>
                    setNewShelter(prev => ({
                      ...prev,
                      capacidade: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar abrigos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredShelters?.length === 0 ? (
        <div className="text-center text-gray-500">
          Nenhum abrigo encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Ocupação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShelters?.map(shelter => (
                <TableRow key={shelter.id}>
                  <TableCell>{shelter.nome}</TableCell>
                  <TableCell>{shelter.cidade}</TableCell>
                  <TableCell>{shelter.estado}</TableCell>
                  <TableCell>{shelter.capacidade}</TableCell>
                  <TableCell>{shelter.ocupacao_atual}</TableCell>
                  <TableCell className="capitalize">{shelter.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/abrigos/${shelter.id}`)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/abrigos/${shelter.id}/editar`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(shelter.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 