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
import { X } from 'lucide-react';

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
    cnpj: '',
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
        cnpj: shelterData.cnpj,
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
      console.log('🔄 Iniciando mutation de atualização:', { shelterId: shelter!.id, data });
      
      try {
        if (selectedLogo) {
          console.log('📤 Iniciando upload de nova logo...');
          const logoUrl = await shelterService.uploadLogo(selectedLogo, shelter!.id);
          console.log('✅ Logo enviada com sucesso:', logoUrl);
          data.logo_url = logoUrl;
        }

        console.log('📝 Dados finais para atualização:', data);
        const result = await shelterService.updateShelter(shelter!.id, data, shelter?.created_by);
        console.log('✅ Atualização concluída com sucesso:', result);
        return result;
      } catch (error) {
        console.error('❌ Erro na mutation:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
          errorStack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🎉 Mutation bem sucedida:', data);
      queryClient.invalidateQueries({ queryKey: ['shelters'] });
      toast({
        title: 'Abrigo atualizado',
        description: 'Abrigo atualizado com sucesso!',
      });
      navigate('/admin/abrigos');
    },
    onError: (error: any) => {
      console.error('❌ Erro na mutation:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: 'Erro ao atualizar abrigo',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o abrigo.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Iniciando submissão do formulário');
    setLoading(true);

    try {
      console.log('📦 Dados do formulário:', formData);
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error('❌ Erro no handleSubmit:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        errorStack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      console.log('🏁 Finalizando submissão do formulário');
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
            {logoPreview && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                    title="Remover Logo"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {!logoPreview && (
              <div className="flex justify-center mb-6">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-64"
                />
              </div>
            )}

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
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 14) {
                    const formattedValue = value.replace(
                      /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
                      (_, p1, p2, p3, p4, p5) => {
                        if (p5) return `${p1}.${p2}.${p3}/${p4}-${p5}`;
                        if (p4) return `${p1}.${p2}.${p3}/${p4}`;
                        if (p3) return `${p1}.${p2}.${p3}`;
                        if (p2) return `${p1}.${p2}`;
                        return p1;
                      }
                    );
                    setFormData(prev => ({ ...prev, cnpj: formattedValue }));
                  }
                }}
                placeholder="00.000.000/0000-00"
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
                  className="w-24"
                  value={formData.capacidade}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 999)) {
                      setFormData(prev => ({ ...prev, capacidade: value }));
                    }
                  }}
                  min="0"
                  max="999"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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