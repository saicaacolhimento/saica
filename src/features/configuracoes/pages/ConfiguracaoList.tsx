import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, Settings, Trash2, Edit } from 'lucide-react'
import { useConfiguracao } from '@/hooks/useConfiguracao'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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

export const ConfiguracaoList = () => {
  const navigate = useNavigate()
  const { getConfiguracoes, deleteConfiguracao } = useConfiguracao()
  const [searchTerm, setSearchTerm] = useState('')
  const [configuracaoToDelete, setConfiguracaoToDelete] = useState<string | null>(null)

  const { data: configuracoes, isLoading } = getConfiguracoes()

  const filteredConfiguracoes = configuracoes?.filter((configuracao) =>
    configuracao.chave.toLowerCase().includes(searchTerm.toLowerCase()) ||
    configuracao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!configuracaoToDelete) return

    try {
      await deleteConfiguracao(configuracaoToDelete)
      setConfiguracaoToDelete(null)
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar configurações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => navigate('/configuracoes/nova')}>
          Nova Configuração
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredConfiguracoes?.map((configuracao) => (
          <Card key={configuracao.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <h3 className="font-medium">{configuracao.chave}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {configuracao.descricao}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{configuracao.tipo}</Badge>
                  <Badge variant="outline">{configuracao.categoria}</Badge>
                  {configuracao.obrigatorio && (
                    <Badge variant="destructive">Obrigatório</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(configuracao.updated_at), 'PPp', {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/configuracoes/${configuracao.id}/editar`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfiguracaoToDelete(configuracao.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!configuracaoToDelete} onOpenChange={() => setConfiguracaoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir configuração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta configuração? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 