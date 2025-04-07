import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, MessageSquare, Trash2 } from 'lucide-react'
import { useMensagem } from '@/hooks/useMensagem'
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

export const ConversaList = () => {
  const navigate = useNavigate()
  const { getConversas, deleteConversa } = useMensagem()
  const [searchTerm, setSearchTerm] = useState('')
  const [conversaToDelete, setConversaToDelete] = useState<string | null>(null)

  const { data: conversas, isLoading } = getConversas('current-user-id')

  const filteredConversas = conversas?.filter((conversa) =>
    conversa.ultima_mensagem.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!conversaToDelete) return

    try {
      await deleteConversa(conversaToDelete)
      setConversaToDelete(null)
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
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredConversas?.map((conversa) => (
          <Card key={conversa.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <h3 className="font-medium">
                    {conversa.participante1_id === 'current-user-id'
                      ? conversa.participante2_id
                      : conversa.participante1_id}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {conversa.ultima_mensagem}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(conversa.data_ultima_mensagem), 'PPp', {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/mensagens/${conversa.id}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConversaToDelete(conversa.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!conversaToDelete} onOpenChange={() => setConversaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
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