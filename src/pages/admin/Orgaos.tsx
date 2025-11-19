import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
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
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { tipoOrgaoService } from '@/services/tipoOrgao';
import type { TipoOrgao, CreateTipoOrgaoData } from '@/types/tipoOrgao';

export default function Orgaos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tiposOrgaos, setTiposOrgaos] = useState<TipoOrgao[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tipoOrgaoToDelete, setTipoOrgaoToDelete] = useState<string | null>(null);
  const [editingTipoOrgao, setEditingTipoOrgao] = useState<TipoOrgao | null>(null);
  const [formData, setFormData] = useState<CreateTipoOrgaoData>({
    nome: '',
    codigo: '',
    descricao: '',
    ativo: true,
    ordem: 0,
  });

  useEffect(() => {
    fetchTiposOrgaos();
  }, []);

  const fetchTiposOrgaos = async () => {
    try {
      setLoading(true);
      console.log('[Orgaos] Iniciando busca de tipos de órgãos...');
      const data = await tipoOrgaoService.getTiposOrgaos();
      console.log('[Orgaos] Dados recebidos:', data);
      setTiposOrgaos(data || []);
      
      if (!data || data.length === 0) {
        console.warn('[Orgaos] Nenhum tipo de órgão encontrado. Verifique se a migration foi aplicada.');
      }
    } catch (error: any) {
      console.error('[Orgaos] Erro completo ao buscar tipos de órgãos:', error);
      const errorMessage = error?.message || 'Erro desconhecido ao carregar tipos de órgãos';
      const detailedMessage = error?.code 
        ? `${errorMessage} (Código: ${error.code})`
        : errorMessage;
      
      toast({
        title: 'Erro',
        description: detailedMessage,
        variant: 'destructive',
      });
      
      // Mesmo com erro, definir array vazio para não quebrar a UI
      setTiposOrgaos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tipoOrgao?: TipoOrgao) => {
    if (tipoOrgao) {
      setEditingTipoOrgao(tipoOrgao);
      setFormData({
        nome: tipoOrgao.nome,
        codigo: tipoOrgao.codigo,
        descricao: tipoOrgao.descricao || '',
        ativo: tipoOrgao.ativo,
        ordem: tipoOrgao.ordem,
      });
    } else {
      setEditingTipoOrgao(null);
      setFormData({
        nome: '',
        codigo: '',
        descricao: '',
        ativo: true,
        ordem: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTipoOrgao(null);
    setFormData({
      nome: '',
      codigo: '',
      descricao: '',
      ativo: true,
      ordem: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo) {
      toast({
        title: 'Erro',
        description: 'Nome e código são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      if (editingTipoOrgao) {
        await tipoOrgaoService.updateTipoOrgao(editingTipoOrgao.id, formData);
        toast({
          title: 'Sucesso',
          description: 'Órgão atualizado com sucesso!',
        });
      } else {
        await tipoOrgaoService.createTipoOrgao(formData);
        toast({
          title: 'Sucesso',
          description: 'Órgão criado com sucesso!',
        });
      }
      handleCloseDialog();
      fetchTiposOrgaos();
      // Invalidar queries relacionadas para atualizar listas que usam tipos de órgãos
      queryClient.invalidateQueries({ queryKey: ['tiposOrgaos'] });
    } catch (error: any) {
      console.error('Erro ao salvar tipo de órgão:', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao salvar tipo de órgão',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tipoOrgaoToDelete) return;

    try {
      setLoading(true);
      await tipoOrgaoService.deleteTipoOrgao(tipoOrgaoToDelete);
      toast({
        title: 'Sucesso',
        description: 'Órgão excluído com sucesso!',
      });
      setTipoOrgaoToDelete(null);
      fetchTiposOrgaos();
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['tiposOrgaos'] });
    } catch (error: any) {
      console.error('Erro ao excluir tipo de órgão:', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao excluir tipo de órgão',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Órgãos</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Órgão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTipoOrgao ? 'Editar Órgão' : 'Adicionar Novo Órgão'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, codigo: e.target.value.toUpperCase() }))
                  }
                  required
                  placeholder="Ex: CRAS, CREAS, CAPS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, descricao: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={formData.ordem}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ativo: e.target.checked }))
                  }
                  className="rounded"
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : editingTipoOrgao ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && !tiposOrgaos.length ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposOrgaos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum órgão cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                tiposOrgaos.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell className="font-medium">{tipo.nome}</TableCell>
                    <TableCell>{tipo.codigo}</TableCell>
                    <TableCell>{tipo.descricao || '-'}</TableCell>
                    <TableCell>{tipo.ordem}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          tipo.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tipo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(tipo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTipoOrgaoToDelete(tipo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!tipoOrgaoToDelete}
        onOpenChange={() => setTipoOrgaoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Órgão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este órgão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

