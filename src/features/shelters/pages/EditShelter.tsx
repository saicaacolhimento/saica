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
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateShelterData>({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    postal_code: '',
    telefone: '',
    email: '',
    capacidade: 0,
    status: 'ativo',
    logo_url: '',
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
        postal_code: shelterData.postal_code,
        telefone: shelterData.telefone,
        email: shelterData.email,
        capacidade: shelterData.capacidade,
        status: shelterData.status,
        logo_url: shelterData.logo_url,
      });
      if (shelterData.logo_url) {
        setLogoPreview(shelterData.logo_url);
      }
    }
  }, [shelterData]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedLogo(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateShelterData) => {
      if (selectedLogo) {
        const logoUrl = await shelterService.uploadLogo(selectedLogo, shelter!.id);
        data.logo_url = logoUrl;
      }
      return shelterService.update(shelter!.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelters'] });
      toast.success('Abrigo atualizado com sucesso!');
      navigate('/shelters');
    },
    onError: () => {
      toast.error('Erro ao atualizar abrigo');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateMutation.mutateAsync(formData);
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
          <Button variant="outline" onClick={() => navigate('/admin/abrigos')}>
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

            <div className="space-y-1">
              <Label htmlFor="postal_code">CEP</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={e => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                className="h-8 border-2 border-gray-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex flex-col gap-4 mb-4">
              <label className="font-medium">Logo do Abrigo</label>
              
              {logoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-cover rounded" />
                  <Button variant="outline" onClick={handleRemoveLogo}>
                    Remover Logo
                  </Button>
                </div>
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full"
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/abrigos')}
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