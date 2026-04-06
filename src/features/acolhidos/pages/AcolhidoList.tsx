import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
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
import { Pencil, Trash2, Loader2, Eye } from 'lucide-react'
import { acolhidoService } from '@/services/acolhido'
import { Acolhido } from '@/types/acolhido'
import { shelterService } from '@/services/shelter'
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

  const { data: acolhidosData, isLoading, error } = useQuery({
    queryKey: ['acolhidos', paginaAtual],
    queryFn: () => acolhidoService.getAcolhidos(paginaAtual, itensPorPagina),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const acolhidos = acolhidosData?.data || [];
  const totalAcolhidos = acolhidosData?.total || 0;
  const totalPaginas = Math.ceil(totalAcolhidos / itensPorPagina);

  const filteredAcolhidos = useMemo(() => {
    if (!searchTerm.trim()) return acolhidos;
    const term = searchTerm.toLowerCase();
    return acolhidos.filter(a =>
      a.nome?.toLowerCase().includes(term) ||
      a.nome_mae?.toLowerCase().includes(term)
    );
  }, [acolhidos, searchTerm]);

  useEffect(() => {
    async function fetchFotos() {
      if (!acolhidos || acolhidos.length === 0) return;
      setLoadingFotos(true);
      try {
        const ids = acolhidos.map(a => a.id);
        const allFotos = await acolhidoService.getFotosByAcolhidoIds(ids);
        const map: { [acolhidoId: string]: string | null } = {};
        for (const acolhido of acolhidos) {
          const foto = allFotos.find(f => f.acolhido_id === acolhido.id);
          if (foto) {
            let url = foto.url;
            if (url && !url.startsWith('http')) {
              url = acolhidoService.getPublicUrl(url);
            }
            map[acolhido.id] = url;
          } else {
            map[acolhido.id] = null;
          }
        }
        setFotosMap(map);
      } catch {
        const map: { [acolhidoId: string]: string | null } = {};
        acolhidos.forEach(a => { map[a.id] = null; });
        setFotosMap(map);
      } finally {
        setLoadingFotos(false);
      }
    }
    fetchFotos();
  }, [acolhidos]);

  useEffect(() => {
    async function fetchEmpresas() {
      if (!acolhidos || acolhidos.length === 0) return;
      const ids = Array.from(new Set(acolhidos.map(a => a.empresa_id).filter(Boolean)));
      if (ids.length === 0) return;
      try {
        const empresas = await shelterService.getSheltersByIds(ids);
        const map: { [id: string]: string } = {};
        empresas.forEach((empresa) => {
          map[empresa.id] = empresa.nome;
        });
        setAbrigosMap(map);
      } catch {
        setAbrigosMap({});
      }
    }
    fetchEmpresas();
  }, [acolhidos]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => acolhidoService.deleteAcolhido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acolhidos'] });
      toast({
        title: "Sucesso",
        description: "Acolhido removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover acolhido",
        variant: "destructive",
      });
    }
  });

  if (error) {
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
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Carregando acolhidos...</span>
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
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Carregando fotos...
                  </TableCell>
                </TableRow>
              ) : filteredAcolhidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum acolhido encontrado com os critérios de busca.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAcolhidos.map((acolhido) => (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/criancas/${acolhido.id}/visualizar`)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/criancas/${acolhido.id}`)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setAcolhidoToDelete(acolhido)}
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
