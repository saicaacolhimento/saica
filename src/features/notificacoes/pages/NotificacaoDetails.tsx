import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, Trash2, Check } from 'lucide-react'
import { useNotificacao } from '@/hooks/useNotificacao'
import { Button } from '@/components/ui/button'
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

export function NotificacaoDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getNotificacaoById, deleteNotificacao, marcarComoLida } = useNotificacao()
  const { data: notificacao, isLoading } = getNotificacaoById(id || '')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (notificacao && notificacao.status !== 'lida') {
      marcarComoLida(notificacao.id)
    }
  }, [notificacao])

  const handleDelete = async () => {
    if (notificacao) {
      await deleteNotificacao(notificacao.id)
      navigate('/notificacoes')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (!notificacao) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Notificação não encontrada</h1>
        <Button onClick={() => navigate('/notificacoes')}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/notificacoes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Notificação</h1>
        </div>
        <div className="flex items-center gap-2">
          {notificacao.status !== 'lida' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => marcarComoLida(notificacao.id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar como lida
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Título</h2>
          <p className="text-lg">{notificacao.titulo}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Mensagem</h2>
          <p className="whitespace-pre-wrap">{notificacao.mensagem}</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Tipo</h2>
            <Badge variant="outline">{notificacao.tipo}</Badge>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Status</h2>
            <Badge variant={notificacao.status === 'lida' ? 'default' : 'secondary'}>
              {notificacao.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Data de Envio</h2>
            <p>
              {format(new Date(notificacao.data_envio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Data de Leitura</h2>
            <p>
              {notificacao.data_leitura
                ? format(new Date(notificacao.data_leitura), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                : '-'}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Destinatário</h2>
          <p>
            {notificacao.destinatario_tipo === 'usuario'
              ? 'Usuário'
              : notificacao.destinatario_tipo === 'acolhido'
              ? 'Acolhido'
              : 'Profissional'}{' '}
            ID: {notificacao.destinatario_id}
          </p>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Notificação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
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