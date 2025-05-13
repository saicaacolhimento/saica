import { useState, useEffect, useRef } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { shelterService } from '@/services/shelter';
import type { Shelter, CreateShelterData, ShelterFormData } from '@/types/shelter';
import { Plus, Eye, EyeOff, X, Upload, Trash2, Loader2, Filter } from 'lucide-react';
import { CityAutocomplete } from '@/components/ui/city-autocomplete';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth';
import { supabase } from '@/config/supabase';

export default function ShelterList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [shelterToDelete, setShelterToDelete] = useState<string | null>(null);
  const [newShelter, setNewShelter] = useState<ShelterFormData>({
    nome: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    postal_code: '',
    telefone_orgao: '',
    email: '',
    capacidade: '',
    logo_url: '',
    responsavel_nome: '',
    responsavel_telefone: '',
    responsavel_email: '',
    master_email: '',
    master_password: '',
    confirm_password: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const prevOpen = useRef(open);

  // Filtros avançados
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterNome, setFilterNome] = useState('');
  const [filterCidade, setFilterCidade] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterAtivo, setFilterAtivo] = useState(true);
  const [filterInativo, setFilterInativo] = useState(true);
  const [filterTipo, setFilterTipo] = useState('');

  // Paginação
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Adicionar estado para tipo de empresa
  const [tipoEmpresa, setTipoEmpresa] = useState('');

  const { data: sheltersData, isLoading: sheltersLoading } = useQuery({
    queryKey: ['shelters', page],
    queryFn: () => shelterService.getShelters(page, pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: shelterService.deleteShelter,
    onSuccess: (_data, deletedId) => {
      // Log para debug
      queryClient.setQueryData(['shelters', page], (oldData) => {
        console.log('oldData:', oldData);
        if (!Array.isArray(oldData)) return [];
        return oldData.filter((shelter) => shelter.id !== deletedId);
      });
      toast({
        title: 'Empresa excluída',
        description: 'A empresa foi excluída com sucesso.',
      });
    },
    onError: error => {
      toast({
        title: 'Erro ao excluir empresa',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = async (id: string) => {
    setShelterToDelete(id);
  };

  const confirmDelete = async () => {
    if (shelterToDelete) {
      console.log('Tentando excluir empresa com id:', shelterToDelete);
      try {
        await deleteMutation.mutateAsync(shelterToDelete);
      } finally {
        setShelterToDelete(null);
      }
    }
  };

  const filteredShelters = sheltersData?.filter(shelter => {
    const matchSearch = searchTerm
      ? shelter.nome.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchNome = filterNome ? shelter.nome.toLowerCase().includes(filterNome.toLowerCase()) : true;
    const matchCidade = filterCidade ? shelter.cidade.toLowerCase().includes(filterCidade.toLowerCase()) : true;
    const matchEstado = filterEstado ? shelter.estado.toLowerCase().includes(filterEstado.toLowerCase()) : true;
    const matchStatus = (filterAtivo && shelter.status === 'ativo') || (filterInativo && shelter.status === 'inativo');
    const matchTipo = filterTipo ? shelter.tipo === filterTipo : true;
    return matchSearch && matchNome && matchCidade && matchEstado && matchStatus && matchTipo;
  });

  // Função para criar empresa
  const createMutation = useMutation({
    mutationFn: shelterService.createShelter,
    onSuccess: () => {
      toast({
        title: 'Empresa criada',
        description: 'A empresa foi criada com sucesso.',
      });
      setOpen(false);
      setNewShelter({
        nome: '',
        cnpj: '',
        endereco: '',
        cidade: '',
        estado: '',
        postal_code: '',
        telefone_orgao: '',
        email: '',
        capacidade: '',
        logo_url: '',
        responsavel_nome: '',
        responsavel_telefone: '',
        responsavel_email: '',
        master_email: '',
        master_password: '',
        confirm_password: '',
      });
      setSelectedLogo(null);
      setLogoPreview(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar empresa',
        description: error?.message || 'Ocorreu um erro ao criar a empresa.',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (prevOpen.current && !open) {
      queryClient.invalidateQueries({ queryKey: ['shelters'] });
    }
    prevOpen.current = open;
  }, [open, queryClient]);

  // Adicionar um ref no popup do filtro e um useEffect para fechar ao clicar fora
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

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
        <h1 className="text-2xl font-bold">Empresas</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="outline" size="icon" onClick={() => setFilterOpen(!filterOpen)} title="Filtrar empresas">
              <Filter className="h-5 w-5" />
            </Button>
            {filterOpen && (
              <div ref={filterRef} className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-50">
                <div className="mb-2">
                  <Label className="text-xs">Nome</Label>
                  <Input value={filterNome} onChange={e => setFilterNome(e.target.value)} placeholder="Filtrar por nome" className="h-8" />
                </div>
                <div className="mb-2">
                  <Label className="text-xs">Cidade</Label>
                  <Input value={filterCidade} onChange={e => setFilterCidade(e.target.value)} placeholder="Filtrar por cidade" className="h-8" />
                </div>
                <div className="mb-2">
                  <Label className="text-xs">Estado</Label>
                  <Input value={filterEstado} onChange={e => setFilterEstado(e.target.value)} placeholder="Filtrar por estado" className="h-8" />
                </div>
                <div className="mb-2">
                  <Label className="text-xs">Tipo de Empresa</Label>
                  <select
                    value={filterTipo}
                    onChange={e => setFilterTipo(e.target.value)}
                    className="h-8 w-full border rounded px-2 text-xs"
                  >
                    <option value="">Todos</option>
                    <option value="ABRIGO">ABRIGO</option>
                    <option value="CREAS">CREAS</option>
                    <option value="CRAS">CRAS</option>
                    <option value="CAPS">CAPS</option>
                    <option value="Conselho Tutelar">Conselho Tutelar</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="ativo" checked={filterAtivo} onChange={() => setFilterAtivo(v => !v)} />
                  <Label htmlFor="ativo" className="text-xs">Ativo</Label>
                  <input type="checkbox" id="inativo" checked={filterInativo} onChange={() => setFilterInativo(v => !v)} />
                  <Label htmlFor="inativo" className="text-xs">Inativo</Label>
                </div>
              </div>
            )}
          </div>
          <Button onClick={() => setOpen(true)}>Nova Empresa</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredShelters?.length === 0 ? (
        <div className="text-center text-gray-500">
          Nenhuma empresa encontrada.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap text-center">Nome</TableHead>
                <TableHead className="text-center whitespace-nowrap">CNPJ</TableHead>
                <TableHead className="text-center">Cidade</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShelters?.map(shelter => (
                <TableRow key={shelter.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {shelter.logo_url ? (
                        <img 
                          src={shelter.logo_url} 
                          alt={`Logo da ${shelter.nome}`}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{shelter.nome.charAt(0)}</span>
                        </div>
                      )}
                      <span className="w-full text-center">{shelter.tipo && shelter.tipo !== 'ABRIGO' ? shelter.tipo.toUpperCase() : shelter.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">{shelter.cnpj}</TableCell>
                  <TableCell className="text-center">{shelter.cidade}</TableCell>
                  <TableCell className="text-center">{shelter.estado}</TableCell>
                  <TableCell className="capitalize">{shelter.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/empresas/${shelter.id}`)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/empresas/${shelter.id}/editar`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(shelter.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!shelterToDelete} onOpenChange={() => setShelterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de cadastro de empresa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!user) {
              toast({
                title: 'Erro',
                description: 'Você precisa estar autenticado para criar uma empresa',
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
            // Validação dos campos obrigatórios
            if (!tipoEmpresa) {
              toast({
                title: 'Erro',
                description: 'Selecione o tipo de empresa',
                variant: 'destructive'
              });
              return;
            }
            if (tipoEmpresa === 'ABRIGO' && !newShelter.nome) {
              toast({
                title: 'Erro',
                description: 'O nome do abrigo é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (tipoEmpresa === 'ABRIGO' && (newShelter.capacidade === '' || isNaN(Number(newShelter.capacidade)))) {
              toast({
                title: 'Erro',
                description: 'A capacidade do abrigo é obrigatória e deve ser um número',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.cnpj) {
              toast({
                title: 'Erro',
                description: 'O CNPJ é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.endereco) {
              toast({
                title: 'Erro',
                description: 'O endereço é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.cidade) {
              toast({
                title: 'Erro',
                description: 'A cidade é obrigatória',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.estado) {
              toast({
                title: 'Erro',
                description: 'O estado é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.telefone_orgao) {
              toast({
                title: 'Erro',
                description: 'O telefone da empresa é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.responsavel_nome) {
              toast({
                title: 'Erro',
                description: 'O nome do responsável é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.responsavel_email) {
              toast({
                title: 'Erro',
                description: 'O e-mail do responsável é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.master_email) {
              toast({
                title: 'Erro',
                description: 'O e-mail do usuário master é obrigatório',
                variant: 'destructive'
              });
              return;
            }
            if (!newShelter.master_password) {
              toast({
                title: 'Erro',
                description: 'A senha do usuário master é obrigatória',
                variant: 'destructive'
              });
              return;
            }
            try {
              setIsLoading(true);
              const { confirm_password, master_password, ...shelterData } = newShelter;
              const dataToSend = {
                ...shelterData,
                capacidade: tipoEmpresa === 'ABRIGO' ? (shelterData.capacidade === '' ? null : Number(shelterData.capacidade)) : null,
                master_password_hash: master_password,
                tipo: tipoEmpresa,
              };
              let logoUrl = '';
              if (selectedLogo) {
                const tempId = Math.random().toString(36).substring(7);
                logoUrl = await shelterService.uploadLogo(selectedLogo, tempId);
              }
              // Cria a empresa
              let empresaCriada;
              try {
                empresaCriada = await createMutation.mutateAsync({
                  ...dataToSend,
                  logo_url: logoUrl || newShelter.logo_url
                });
                console.log('Empresa criada:', empresaCriada);
              } catch (err) {
                console.error('Erro ao criar empresa:', err);
                toast({
                  title: 'Erro ao criar empresa',
                  description: err?.message || 'Erro desconhecido',
                  variant: 'destructive'
                });
                setIsLoading(false);
                return;
              }
              if (!empresaCriada?.id) {
                toast({
                  title: 'Erro',
                  description: 'Não foi possível obter o ID da empresa criada.',
                  variant: 'destructive'
                });
                setIsLoading(false);
                return;
              }
              // Cria o usuário admin vinculado à empresa
              await authService.createUser({
                email: newShelter.master_email,
                password: newShelter.master_password,
                nome: newShelter.responsavel_nome,
                cargo: 'admin',
                role: 'admin',
                status: 'active',
                empresa_id: empresaCriada.id,
              });
            } catch (error) {
              // O toast de erro já é tratado no onError da mutation
            } finally {
              setIsLoading(false);
            }
          }} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium">Logo da Empresa</Label>
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
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedLogo(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLogoPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_empresa" className="text-sm font-medium">Tipo de Empresa</Label>
                <select
                  id="tipo_empresa"
                  className="h-9 w-full border rounded px-2"
                  value={tipoEmpresa}
                  onChange={e => setTipoEmpresa(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="ABRIGO">ABRIGO</option>
                  <option value="CREAS">CREAS</option>
                  <option value="CRAS">CRAS</option>
                  <option value="CAPS">CAPS</option>
                  <option value="Conselho Tutelar">Conselho Tutelar</option>
                </select>
              </div>
              {(tipoEmpresa === 'ABRIGO') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">Nome do {tipoEmpresa}</Label>
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
                      className="h-9 w-24"
                      value={newShelter.capacidade}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 999)) {
                          setNewShelter(prev => ({ ...prev, capacidade: value }));
                        }
                      }}
                      min="0"
                      max="999"
                      required
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
                  <Input
                    id="cnpj"
                    className="h-9"
                    value={newShelter.cnpj}
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
                        setNewShelter(prev => ({ ...prev, cnpj: formattedValue }));
                      }
                    }}
                    placeholder="00.000.000/0000-00"
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
                    onCityChange={city => setNewShelter(prev => ({ ...prev, cidade: city }))}
                    onStateChange={state => setNewShelter(prev => ({ ...prev, estado: state }))}
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
              {/* Novo campo Telefone da Empresa */}
              <div className="space-y-2">
                <Label htmlFor="telefone_orgao" className="text-sm font-medium">Telefone da Empresa</Label>
                <Input
                  id="telefone_orgao"
                  className="h-9"
                  value={newShelter.telefone_orgao || ''}
                  onChange={e => setNewShelter(prev => ({ ...prev, telefone_orgao: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-700 mt-6 mb-2 text-center">DADOS DO RESPONSÁVEL</h3>
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
            <div>
              <h3 className="text-base font-semibold text-gray-700 mt-6 mb-2 text-center">CADASTRO DE USUÁRIO</h3>
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
                          setPasswordMatch(newPassword === newShelter.confirm_password);
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
                        className="h-9 pr-10"
                        value={newShelter.confirm_password}
                        onChange={e => {
                          const confirmPassword = e.target.value;
                          setNewShelter(prev => ({ ...prev, confirm_password: confirmPassword }));
                          setPasswordMatch(newShelter.master_password === confirmPassword);
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
                      <span className="text-xs text-red-500">As senhas não coincidem</span>
                    )}
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
                  'Criar Empresa'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Controles de paginação */}
      <div className="flex justify-center mt-4 gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {page}</span>
        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={sheltersData?.length < pageSize}>Próxima</Button>
      </div>
    </div>
  );
} 