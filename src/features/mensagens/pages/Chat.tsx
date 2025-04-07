import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Send, Trash2 } from 'lucide-react'
import { useMensagem } from '@/hooks/useMensagem'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
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

export const Chat = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { getConversaById, getMensagens, createMensagem, deleteConversa } = useMensagem()
  const [message, setMessage] = useState('')
  const [conversaToDelete, setConversaToDelete] = useState<string | null>(null)

  const { data: conversa, isLoading: isLoadingConversa } = getConversaById(id || '')
  const { data: mensagens, isLoading: isLoadingMensagens } = getMensagens(id || '')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const handleSendMessage = async () => {
    if (!message.trim() || !id) return

    try {
      await createMensagem({
        conteudo: message.trim(),
        remetente_id: 'current-user-id',
        destinatario_id: conversa?.participante1_id === 'current-user-id'
          ? conversa.participante2_id
          : conversa?.participante1_id || '',
        conversa_id: id
      })
      setMessage('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    try {
      await deleteConversa(id)
      navigate('/mensagens')
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoadingConversa || isLoadingMensagens) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
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
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-lg font-semibold">
            {conversa?.participante1_id === 'current-user-id'
              ? conversa.participante2_id
              : conversa?.participante1_id}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setConversaToDelete(conversa?.id || '')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {mensagens?.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${
                mensagem.remetente_id === 'current-user-id'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <Card
                className={`max-w-[70%] p-3 ${
                  mensagem.remetente_id === 'current-user-id'
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }`}
              >
                <p className="text-sm">{mensagem.conteudo}</p>
                <p className="mt-1 text-xs opacity-70">
                  {format(new Date(mensagem.data_envio), 'HH:mm', {
                    locale: ptBR,
                  })}
                </p>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
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