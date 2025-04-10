import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
import type { Shelter, CreateShelterData, ShelterFormData } from '@/types/shelter';
import { Plus, Eye, EyeOff, X, Upload } from 'lucide-react';
import { CityAutocomplete } from '@/components/ui/city-autocomplete';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function ShelterList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const [newShelter, setNewShelter] = useState<ShelterFormData>({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    postal_code: '',
    telefone: '',
    email: '',
    capacidade: '',
    logo_url: '',
    responsavel_nome: '',
    responsavel_telefone: '',
    responsavel_email: '',
    master_email: '',
    master_password: '',
    confirm_password: ''
  });

  const { data: sheltersData, isLoading: sheltersLoading } = useQuery({
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
      setOpen(false);
      setNewShelter({
        nome: '',
        endereco: '',
        cidade: '',
        estado: '',
        postal_code: '',
        telefone: '',
        email: '',
        capacidade: '',
        logo_url: '',
        responsavel_nome: '',
        responsavel_telefone: '',
        responsavel_email: '',
        master_email: '',
        master_password: '',
        confirm_password: ''
      });
      setSelectedLogo(null);
      setLogoPreview(null);
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar autenticado para criar um abrigo',
        variant: 'destructive'
      });
      return;
    }
    
    if (!passwordMatch) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);

      // Remove os campos de senha do formulário
      const { confirm_password, master_password, ...shelterData } = newShelter;

      // Prepara os dados para enviar ao banco
      const dataToSend = {
        ...shelterData,
        master_password_hash: master_password, // Enviamos a senha direto para o backend fazer o hash
        capacidade: shelterData.capacidade ? parseInt(shelterData.capacidade) : 0
      };

      // Se tiver um logo selecionado, faz o upload primeiro
      let logoUrl = '';
      if (selectedLogo) {
        const tempId = Math.random().toString(36).substring(7);
        logoUrl = await shelterService.uploadLogo(selectedLogo, tempId);
      }

      // Cria o abrigo com todos os dados
      await createMutation.mutateAsync({
        ...dataToSend,
        logo_url: logoUrl || newShelter.logo_url
      });

      toast({
        title: 'Sucesso',
        description: 'Abrigo criado com sucesso!'
      });
      
      // Reseta o formulário
      setNewShelter({
        nome: '',
        endereco: '',
        cidade: '',
        estado: '',
        postal_code: '',
        telefone: '',
        email: '',
        capacidade: '',
        logo_url: '',
        responsavel_nome: '',
        responsavel_telefone: '',
        responsavel_email: '',
        master_email: '',
        master_password: '',
        confirm_password: ''
      });
      setSelectedLogo(null);
      setLogoPreview(null);
      setOpen(false);
    } catch (error: any) {
      console.error('Erro ao criar abrigo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar abrigo: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este abrigo?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredShelters = sheltersData?.filter(shelter =>
    shelter.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para validar se as senhas são iguais
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (confirmPassword === '') return true;
    return password === confirmPassword;
  };

  if (sheltersLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Abrigos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Abrigo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold">Novo Abrigo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-sm font-medium">Logo do Abrigo</Label>
                  <div className="flex items-start gap-2">
                    {logoPreview ? (
                      <div className="relative w-32 h-32">
                        <img
                          src={logoPreview}
                          alt="Preview do logo"
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLogo(null);
                            setLogoPreview(null);
                            setNewShelter(prev => ({ ...prev, logo_url: '' }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Label
                        htmlFor="logo"
                        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2">Clique para upload</span>
                      </Label>
                    )}
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">Nome do Abrigo</Label>
                    <Input
                      id="nome"
                      className="h-9"
                      value={newShelter.nome}
                      onChange={e => setNewShelter(prev => ({ ...prev, nome: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacidade" className="text-sm font-medium">Capacidade</Label>
                    <Input
                      id="capacidade"
                      type="number"
                      className="h-9"
                      value={newShelter.capacidade}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '' || parseInt(value) >= 0) {
                          setNewShelter(prev => ({ ...prev, capacidade: value }));
                        }
                      }}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco" className="text-sm font-medium">Endereço</Label>
                  <Input
                    id="endereco"
                    className="h-9"
                    value={newShelter.endereco}
                    onChange={e => setNewShelter(prev => ({ ...prev, endereco: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-sm font-medium">Cidade</Label>
                    <CityAutocomplete
                      value={newShelter.cidade}
                      onCityChange={(city) => setNewShelter({ ...newShelter, cidade: city })}
                      onStateChange={(state) => setNewShelter({ ...newShelter, estado: state })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-sm font-medium">Estado</Label>
                    <Input
                      id="estado"
                      className="h-9"
                      value={newShelter.estado}
                      readOnly
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code" className="text-sm font-medium">CEP</Label>
                  <Input
                    id="postal_code"
                    className="h-9"
                    value={newShelter.postal_code}
                    onChange={e => setNewShelter(prev => ({ ...prev, postal_code: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                    <Input
                      id="telefone"
                      className="h-9"
                      value={newShelter.telefone}
                      onChange={e => setNewShelter(prev => ({ ...prev, telefone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      className="h-9"
                      value={newShelter.email}
                      onChange={e => setNewShelter(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">Dados do Responsável</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsavel_nome" className="text-sm font-medium">Nome do Responsável</Label>
                      <Input
                        id="responsavel_nome"
                        className="h-9"
                        value={newShelter.responsavel_nome}
                        onChange={e => setNewShelter(prev => ({ ...prev, responsavel_nome: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="responsavel_telefone" className="text-sm font-medium">Telefone do Responsável</Label>
                        <Input
                          id="responsavel_telefone"
                          className="h-9"
                          value={newShelter.responsavel_telefone}
                          onChange={e => setNewShelter(prev => ({ ...prev, responsavel_telefone: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsavel_email" className="text-sm font-medium">Email do Responsável</Label>
                        <Input
                          id="responsavel_email"
                          type="email"
                          className="h-9"
                          value={newShelter.responsavel_email}
                          onChange={e => setNewShelter(prev => ({ ...prev, responsavel_email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">Dados do Usuário Master</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="master_email" className="text-sm font-medium">Email do Usuário Master</Label>
                      <Input
                        id="master_email"
                        type="email"
                        className="h-9"
                        value={newShelter.master_email}
                        onChange={e => setNewShelter(prev => ({ ...prev, master_email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="master_password" className="text-sm font-medium">Senha</Label>
                        <div className="relative">
                          <Input
                            id="master_password"
                            type={showPassword ? "text" : "password"}
                            className="h-9 pr-10"
                            value={newShelter.master_password}
                            onChange={e => {
                              const newPassword = e.target.value;
                              setNewShelter(prev => ({ ...prev, master_password: newPassword }));
                              setPasswordMatch(validatePasswords(newPassword, newShelter.confirm_password));
                            }}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm_password" className="text-sm font-medium">Confirmar Senha</Label>
                        <div className="relative">
                          <Input
                            id="confirm_password"
                            type={showConfirmPassword ? "text" : "password"}
                            className={`h-9 pr-10 ${!passwordMatch && newShelter.confirm_password ? 'border-red-500' : ''}`}
                            value={newShelter.confirm_password}
                            onChange={e => {
                              const confirmPassword = e.target.value;
                              setNewShelter(prev => ({ ...prev, confirm_password: confirmPassword }));
                              setPasswordMatch(validatePasswords(newShelter.master_password, confirmPassword));
                            }}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {!passwordMatch && newShelter.confirm_password && (
                          <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || !passwordMatch}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Abrigo'
                  )}
                </Button>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {shelter.logo_url ? (
                        <img 
                          src={shelter.logo_url} 
                          alt={`Logo do ${shelter.nome}`}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{shelter.nome.charAt(0)}</span>
                        </div>
                      )}
                      <span>{shelter.nome}</span>
                    </div>
                  </TableCell>
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
                        onClick={() => navigate(`/admin/abrigos/${shelter.id}`)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/abrigos/${shelter.id}/editar`)}
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