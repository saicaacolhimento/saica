import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Plus, Loader2, Eye } from 'lucide-react'
import { acolhidoService } from '@/services/acolhido'
import { useAuth } from '@/contexts/AuthContext'
import { Acolhido } from '@/types/acolhido'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Função utilitária para calcular idade
function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

export function AcolhidoList() {
  const { user, session } = useAuth();
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [acolhidoToDelete, setAcolhidoToDelete] = useState<Acolhido | null>(null)

  // Buscar acolhidos com dados relacionados usando React Query
  const { data: acolhidosData, isLoading, error } = useQuery({
    queryKey: ['acolhidos', paginaAtual],
    queryFn: async () => {
      try {
        console.log('[AcolhidoList] Iniciando busca de acolhidos...');
        const result = await acolhidoService.getAcolhidos(paginaAtual, itensPorPagina);
        console.log('[AcolhidoList] Acolhidos encontrados:', result.data.length);
        return result;
      } catch (error) {
        console.error('[AcolhidoList] Erro ao buscar acolhidos:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const acolhidos = acolhidosData?.data || [];
  const totalAcolhidos = acolhidosData?.total || 0;
  const totalPaginas = Math.ceil(totalAcolhidos / itensPorPagina);

  // Mapear fotos e abrigos usando useMemo
  const fotosMap = useMemo(() => {
    const map: { [acolhidoId: string]: string | null } = {};
    acolhidos?.forEach(acolhido => {
      const foto = acolhido.fotos?.[0];
      if (foto?.url) {
        map[acolhido.id] = foto.url;
      } else {
        map[acolhido.id] = null;
      }
    });
    return map;
  }, [acolhidos]);

  const abrigosMap = useMemo(() => {
    const map: { [id: string]: string } = {};
    acolhidos?.forEach(acolhido => {
      if (acolhido.empresa) {
        map[acolhido.empresa_id] = acolhido.empresa.nome;
      }
    });
    return map;
  }, [acolhidos]);

  // Filtrar acolhidos baseado no termo de busca
  const filteredAcolhidos = acolhidos?.filter(acolhido => 
    acolhido.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acolhido.nome_mae?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutação para deletar acolhido
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('[AcolhidoList] Deletando acolhido:', id);
      await acolhidoService.deleteAcolhido(id);
    },
    onSuccess: () => {
      console.log('[AcolhidoList] Acolhido deletado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['acolhidos'] });
      toast({
        title: "Sucesso",
        description: "Acolhido removido com sucesso",
      });
    },
    onError: (error) => {
      console.error('[AcolhidoList] Erro ao deletar acolhido:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover acolhido",
        variant: "destructive",
      });
    }
  });

  const handleDeleteAcolhido = (acolhido: Acolhido) => {
    setAcolhidoToDelete(acolhido);
  };

  const handleEdit = (acolhido: Acolhido) => {
    navigate(`/admin/criancas/${acolhido.id}`);
  };

  const handleView = (acolhido: Acolhido) => {
    navigate(`/admin/criancas/${acolhido.id}/visualizar`);
  };

  if (error) {
    console.error('[AcolhidoList] Erro ao carregar acolhidos:', error);
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">
          Erro ao carregar acolhidos. Por favor, tente novamente.
          <br />
          <small>Detalhes: {error instanceof Error ? error.message : 'Erro desconhecido'}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Acolhidos</h1>
        <Button onClick={() => navigate('/admin/criancas/novo')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Acolhido
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por nome ou nome da mãe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Carregando acolhidos...</span>
          </div>
        ) : filteredAcolhidos?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum acolhido encontrado com os critérios de busca.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Foto</TableHead>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">Data de Nascimento</TableHead>
                <TableHead className="text-center">Idade</TableHead>
                <TableHead className="text-center">Abrigo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAcolhidos?.map((acolhido) => (
                <TableRow key={acolhido.id}>
                  <TableCell className="text-center">
                    {fotosMap[acolhido.id] ? (
                      <img
                        src={fotosMap[acolhido.id]!}
                        alt={acolhido.nome}
                        className="w-[80px] h-[80px] rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-[80px] h-[80px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {acolhido.nome.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium">{acolhido.nome}</TableCell>
                  <TableCell className="text-center">{new Date(acolhido.data_nascimento).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">{calcularIdade(acolhido.data_nascimento)}</TableCell>
                  <TableCell className="text-center">{abrigosMap[acolhido.empresa_id] || '-'}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      acolhido.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {acolhido.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/criancas/${acolhido.id}/visualizar`} title="Visualizar">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(acolhido)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAcolhido(acolhido)}
                        title="Excluir"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Controles de paginação */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
        >
          Anterior
        </Button>
        <span className="mx-2">Página {paginaAtual} de {totalPaginas}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
        >
          Próxima
        </Button>
      </div>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={!!acolhidoToDelete} onOpenChange={() => setAcolhidoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cadastro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cadastro de criança? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (acolhidoToDelete) {
                  await deleteMutation.mutateAsync(acolhidoToDelete.id);
                  setAcolhidoToDelete(null);
                }
              }}
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
    </div>
  )
} 