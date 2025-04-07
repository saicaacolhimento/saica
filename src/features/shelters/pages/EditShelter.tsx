import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { shelterService } from '@/services/shelter';
import type { Shelter, UpdateShelterData, ShelterStatus } from '@/types/shelter';

export default function EditShelter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [formData, setFormData] = useState<UpdateShelterData>({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    capacidade: 0,
    status: 'ativo',
  });

  const { data: shelterData, isLoading } = useQuery({
    queryKey: ['shelter', id],
    queryFn: () => shelterService.getShelterById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (shelterData) {
      setShelter(shelterData);
      setFormData({
        nome: shelterData.nome,
        endereco: shelterData.endereco,
        cidade: shelterData.cidade,
        estado: shelterData.estado,
        cep: shelterData.cep,
        telefone: shelterData.telefone,
        email: shelterData.email,
        capacidade: shelterData.capacidade,
        status: shelterData.status,
      });
    }
  }, [shelterData]);

  const updateMutation = useMutation({
    mutationFn: () => shelterService.updateShelter(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelters'] });
      queryClient.invalidateQueries({ queryKey: ['shelter', id] });
      toast({
        title: 'Abrigo atualizado',
        description: 'As informações do abrigo foram atualizadas com sucesso.',
      });
      navigate('/abrigos');
    },
    onError: error => {
      toast({
        title: 'Erro ao atualizar abrigo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateMutation.mutateAsync();
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !shelter) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Abrigo</h1>
          <Button variant="outline" onClick={() => navigate('/abrigos')}>
            Voltar
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
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
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={e =>
                  setFormData(prev => ({ ...prev, endereco: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, cidade: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, estado: e.target.value }))
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
                  value={formData.cep}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, cep: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, telefone: e.target.value }))
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
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade</Label>
                <Input
                  id="capacidade"
                  type="number"
                  min="0"
                  value={formData.capacidade}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      capacidade: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ShelterStatus) =>
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="em_construcao">Em Construção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/abrigos')}
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