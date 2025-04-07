import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, Search, Trash2, Check } from 'lucide-react'
import { useNotificacao } from '@/hooks/useNotificacao'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function NotificacaoList() {
  const navigate = useNavigate()
  const { notificacoes, isLoadingNotificacoes, deleteNotificacao, marcarComoLida } = useNotificacao()
  const [searchTerm, setSearchTerm] = useState('')
  const [notificacaoToDelete, setNotificacaoToDelete] = useState<string | null>(null)

  const filteredNotificacoes = notificacoes?.filter(notificacao =>
    notificacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notificacao.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (notificacaoToDelete) {
      await deleteNotificacao(notificacaoToDelete)
      setNotificacaoToDelete(null)
    }
  }

  const handleMarcarComoLida = async (id: string) => {
    await marcarComoLida(id)
  }

  if (isLoadingNotificacoes) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notificações</h1>
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Envio</TableHead>
              <TableHead>Data de Leitura</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotificacoes?.map((notificacao) => (
              <TableRow key={notificacao.id}>
                <TableCell>{notificacao.titulo}</TableCell>
                <TableCell>{notificacao.mensagem}</TableCell>
                <TableCell>
                  <Badge variant="outline">{notificacao.tipo}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={notificacao.status === 'lida' ? 'default' : 'secondary'}>
                    {notificacao.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(notificacao.data_envio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {notificacao.data_leitura
                    ? format(new Date(notificacao.data_leitura), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {notificacao.status !== 'lida' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarcarComoLida(notificacao.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNotificacaoToDelete(notificacao.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!notificacaoToDelete} onOpenChange={() => setNotificacaoToDelete(null)}>
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