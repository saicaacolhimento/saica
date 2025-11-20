import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { shelterService } from '@/services/shelter'
import { supabase } from '@/config/supabase'
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
  console.log('[AcolhidoList] Componente montado');
  const { user, session } = useAuth();
  console.log('[AcolhidoList] Contexto de autenticação:', { user, session });
  
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [fotosMap, setFotosMap] = useState<{ [acolhidoId: string]: string | null }>({});
  const [loadingFotos, setLoadingFotos] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const [abrigosMap, setAbrigosMap] = useState<{ [id: string]: string }>({});
  const [acolhidoToDelete, setAcolhidoToDelete] = useState<Acolhido | null>(null);

  // Buscar acolhidos usando React Query
  const { data: acolhidosData, isLoading, error, isError } = useQuery({
    queryKey: ['acolhidos', paginaAtual],
    queryFn: async () => {
      try {
        console.log('[AcolhidoList] Buscando acolhidos...', { paginaAtual, itensPorPagina });
        const result = await acolhidoService.getAcolhidos(paginaAtual, itensPorPagina);
        console.log('[AcolhidoList] Acolhidos recebidos:', result);
        return result;
      } catch (err) {
        console.error('[AcolhidoList] Erro ao buscar acolhidos:', err);
        throw err;
      }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    retry: 0, // Não tentar novamente automaticamente
    refetchOnWindowFocus: false,
  });

  const acolhidos = acolhidosData?.data || [];
  const totalAcolhidos = acolhidosData?.total || 0;
  const totalPaginas = Math.ceil(totalAcolhidos / itensPorPagina);

  // Buscar fotos dos acolhidos
  useEffect(() => {
    async function fetchFotos() {
      if (!acolhidos) return;
      setLoadingFotos(true);
      const map: { [acolhidoId: string]: string | null } = {};
      for (const acolhido of acolhidos) {
        try {
          const fotos = await acolhidoService.getAcolhidoFotos(acolhido.id);
          if (fotos && fotos.length > 0) {
            // Se a url não for pública, gerar a url pública
            let url = fotos[0].url;
            if (url && !url.startsWith('http')) {
              // Supondo que as fotos estão no storage do Supabase
              const { data } = supabase.storage.from('acolhidos').getPublicUrl(url);
              url = data.publicUrl;
            }
            map[acolhido.id] = url;
          } else {
            map[acolhido.id] = null;
          }
        } catch (e) {
          map[acolhido.id] = null;
        }
      }
      setFotosMap(map);
      setLoadingFotos(false);
    }
    fetchFotos();
  }, [acolhidos]);

  // Buscar nomes das empresas (abrigos) - usar abrigo_id
  useEffect(() => {
    async function fetchEmpresas() {
      if (!acolhidos || acolhidos.length === 0) return;
      // Usar abrigo_id ao invés de empresa_id
      const ids = Array.from(new Set(acolhidos.map(a => (a as any).abrigo_id).filter(Boolean)));
      console.log('[AcolhidoList] IDs de abrigos encontrados nos acolhidos:', ids);
      if (ids.length === 0) return;
      try {
        // Buscar todas as empresas necessárias
        const empresas = await shelterService.getSheltersByIds(ids);
        console.log('[AcolhidoList] Empresas retornadas do banco:', empresas);
        const map: { [id: string]: string } = {};
        empresas.forEach((empresa: any) => {
          map[empresa.id] = empresa.nome;
        });
        setAbrigosMap(map);
      } catch (e) {
        console.error('[AcolhidoList] Erro ao buscar empresas:', e);
        setAbrigosMap({});
      }
    }
    fetchEmpresas();
  }, [acolhidos]);

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

  // Se erro, mostrar mensagem
  if (isError && error) {
    console.error('[AcolhidoList] Erro:', { isError, error });
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error instanceof Error && (error as any).code ? `Código: ${(error as any).code}` : '';
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Erro ao carregar acolhidos</h2>
          <p className="mb-2">Por favor, tente novamente.</p>
          <small className="block mt-2">
            <strong>Detalhes:</strong> {errorMessage}
            {errorDetails && <><br />{errorDetails}</>}
          </small>
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['acolhidos'] });
              }}
            >
              Tentar Novamente
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acolhidos</h1>
          <span className="text-sm text-gray-600">{totalAcolhidos} acolhido(s) cadastrados</span>
        </div>
        <Button onClick={() => navigate('/admin/criancas/novo')}>
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
          <div className="flex flex-col justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 mt-2">Carregando acolhidos...</span>
            <small className="text-gray-500 mt-2">Se demorar muito, verifique o console do navegador (F12)</small>
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
              {loadingFotos ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Carregando fotos...
                  </TableCell>
                </TableRow>
              ) : acolhidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum acolhido encontrado com os critérios de busca.
                  </TableCell>
                </TableRow>
              ) : (
                acolhidos.map((acolhido) => (
                  <TableRow key={acolhido.id}>
                    <TableCell className="text-center">
                      {fotosMap[acolhido.id] ? (
                        <img
                          src={fotosMap[acolhido.id]!}
                          alt={acolhido.nome}
                          className="w-[80px] h-[80px] object-cover border"
                        />
                      ) : (
                        <div className="w-[80px] h-[80px] bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {acolhido.nome.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">{acolhido.nome}</TableCell>
                    <TableCell className="text-center">{new Date(acolhido.data_nascimento).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">{calcularIdade(acolhido.data_nascimento)}</TableCell>
                    <TableCell className="text-center">{abrigosMap[(acolhido as any).abrigo_id] || '-'}</TableCell>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(acolhido)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Controles de paginação */}
      {totalPaginas > 1 && (
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
      )}

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